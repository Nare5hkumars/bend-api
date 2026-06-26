const express = require("express");
const mongoose = require("mongoose");
const Product = require("./models/Product");
const Customer = require("./models/Customer");
const Order = require("./models/Order");

const app = express();
const PORT = 5000;
const MONGO_URI = "mongodb://127.0.0.1:27017/ecommerce";

app.use(express.json());

mongoose.connect(MONGO_URI)
  .then(() => console.log("Connected to MongoDB"))
  .catch(err => console.error("MongoDB connection error:", err));

function validateId(id) {
  return mongoose.Types.ObjectId.isValid(id);
}

function handleIdError(res) {
  return res.status(400).json({ message: "Invalid ID format" });
}

// ───────────── PRODUCTS ─────────────

app.post("/products", async (req, res) => {
  try {
    const { name, price, stock, description } = req.body;
    if (!name || price === undefined) {
      return res.status(400).json({ message: "Name and price are required" });
    }
    const product = new Product({ name, price, stock, description });
    await product.save();
    res.status(201).json({ message: "Product created", product });
  } catch (err) {
    res.status(500).json({ message: "Server error", error: err.message });
  }
});

app.get("/products", async (req, res) => {
  try {
    const products = await Product.find();
    res.json(products);
  } catch (err) {
    res.status(500).json({ message: "Server error", error: err.message });
  }
});

app.get("/products/:id", async (req, res) => {
  try {
    if (!validateId(req.params.id)) return handleIdError(res);
    const product = await Product.findById(req.params.id);
    if (!product) return res.status(404).json({ message: "Product not found" });
    res.json(product);
  } catch (err) {
    res.status(500).json({ message: "Server error", error: err.message });
  }
});

app.put("/products/:id", async (req, res) => {
  try {
    if (!validateId(req.params.id)) return handleIdError(res);
    const { name, price, stock, description } = req.body;
    const product = await Product.findByIdAndUpdate(
      req.params.id,
      { ...(name && { name }), ...(price !== undefined && { price }), ...(stock !== undefined && { stock }), ...(description && { description }) },
      { new: true, runValidators: true }
    );
    if (!product) return res.status(404).json({ message: "Product not found" });
    res.json({ message: "Product updated", product });
  } catch (err) {
    res.status(500).json({ message: "Server error", error: err.message });
  }
});

app.delete("/products/:id", async (req, res) => {
  try {
    if (!validateId(req.params.id)) return handleIdError(res);
    const product = await Product.findByIdAndDelete(req.params.id);
    if (!product) return res.status(404).json({ message: "Product not found" });
    res.json({ message: "Product deleted" });
  } catch (err) {
    res.status(500).json({ message: "Server error", error: err.message });
  }
});

// ───────────── CUSTOMERS ─────────────

app.post("/customers", async (req, res) => {
  try {
    const { name, email, phone } = req.body;
    if (!name || !email) {
      return res.status(400).json({ message: "Name and email are required" });
    }
    const customer = new Customer({ name, email, phone });
    await customer.save();
    res.status(201).json({ message: "Customer created", customer });
  } catch (err) {
    if (err.code === 11000) return res.status(409).json({ message: "Email already exists" });
    res.status(500).json({ message: "Server error", error: err.message });
  }
});

app.get("/customers", async (req, res) => {
  try {
    const customers = await Customer.find();
    res.json(customers);
  } catch (err) {
    res.status(500).json({ message: "Server error", error: err.message });
  }
});

app.get("/customers/:id", async (req, res) => {
  try {
    if (!validateId(req.params.id)) return handleIdError(res);
    const customer = await Customer.findById(req.params.id);
    if (!customer) return res.status(404).json({ message: "Customer not found" });
    res.json(customer);
  } catch (err) {
    res.status(500).json({ message: "Server error", error: err.message });
  }
});

app.put("/customers/:id", async (req, res) => {
  try {
    if (!validateId(req.params.id)) return handleIdError(res);
    const { name, email, phone } = req.body;
    const customer = await Customer.findByIdAndUpdate(
      req.params.id,
      { ...(name && { name }), ...(email && { email }), ...(phone && { phone }) },
      { new: true, runValidators: true }
    );
    if (!customer) return res.status(404).json({ message: "Customer not found" });
    res.json({ message: "Customer updated", customer });
  } catch (err) {
    if (err.code === 11000) return res.status(409).json({ message: "Email already exists" });
    res.status(500).json({ message: "Server error", error: err.message });
  }
});

app.delete("/customers/:id", async (req, res) => {
  try {
    if (!validateId(req.params.id)) return handleIdError(res);
    const customer = await Customer.findByIdAndDelete(req.params.id);
    if (!customer) return res.status(404).json({ message: "Customer not found" });
    res.json({ message: "Customer deleted" });
  } catch (err) {
    res.status(500).json({ message: "Server error", error: err.message });
  }
});

// ───────────── ORDERS ─────────────

app.post("/orders", async (req, res) => {
  try {
    const { customer, items } = req.body;

    if (!customer || !items || items.length === 0) {
      return res.status(400).json({ message: "Customer and items are required" });
    }

    const customerExists = await Customer.findById(customer);
    if (!customerExists) {
      return res.status(404).json({ message: "Customer not found" });
    }

    const orderItems = [];
    let totalAmount = 0;

    for (const item of items) {
      const product = await Product.findById(item.product);
      if (!product) {
        return res.status(404).json({ message: `Product ${item.product} not found` });
      }
      if (product.stock < item.quantity) {
        return res.status(400).json({
          message: `Insufficient stock for ${product.name}. Available: ${product.stock}, requested: ${item.quantity}`
        });
      }
      orderItems.push({
        product: product._id,
        quantity: item.quantity,
        price: product.price
      });
      totalAmount += product.price * item.quantity;
    }

    const order = new Order({ customer, items: orderItems, totalAmount });
    await order.save();

    for (const item of items) {
      await Product.findByIdAndUpdate(item.product, { $inc: { stock: -item.quantity } });
    }

    await order.populate("items.product customer");
    res.status(201).json({ message: "Order placed", order });
  } catch (err) {
    res.status(500).json({ message: "Server error", error: err.message });
  }
});

app.get("/orders", async (req, res) => {
  try {
    const orders = await Order.find().populate("items.product customer").sort({ createdAt: -1 });
    res.json(orders);
  } catch (err) {
    res.status(500).json({ message: "Server error", error: err.message });
  }
});

app.get("/orders/:id", async (req, res) => {
  try {
    if (!validateId(req.params.id)) return handleIdError(res);
    const order = await Order.findById(req.params.id).populate("items.product customer");
    if (!order) return res.status(404).json({ message: "Order not found" });
    res.json(order);
  } catch (err) {
    res.status(500).json({ message: "Server error", error: err.message });
  }
});

app.put("/orders/:id/status", async (req, res) => {
  try {
    if (!validateId(req.params.id)) return handleIdError(res);
    const { status } = req.body;
    const validStatuses = ["Pending", "Processing", "Shipped", "Delivered"];
    if (!status || !validStatuses.includes(status)) {
      return res.status(400).json({ message: `Status must be one of: ${validStatuses.join(", ")}` });
    }
    const order = await Order.findByIdAndUpdate(
      req.params.id,
      { status },
      { new: true, runValidators: true }
    ).populate("items.product customer");
    if (!order) return res.status(404).json({ message: "Order not found" });
    res.json({ message: "Order status updated", order });
  } catch (err) {
    res.status(500).json({ message: "Server error", error: err.message });
  }
});

app.listen(PORT, () => {
  console.log(`E-Commerce API running on port ${PORT}`);
});
