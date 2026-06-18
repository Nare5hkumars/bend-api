const express = require("express");

const app = express();
const PORT = 3000;

app.use(express.json());

// In-memory user storage
let users = [
  { id: 1, name: "John Doe", email: "john@example.com" },
  { id: 2, name: "Jane Smith", email: "jane@example.com" }
];

// GET /users - Retrieve all users
app.get("/users", (req, res) => {
  res.status(200).json(users);
});

// POST /users - Add a new user
app.post("/users", (req, res) => {
  const { name, email } = req.body;

  if (!name || !email) {
    return res.status(400).json({
      message: "Name and email are required"
    });
  }

  const newUser = {
    id: users.length ? users[users.length - 1].id + 1 : 1,
    name,
    email
  };

  users.push(newUser);

  res.status(201).json({
    message: "User added successfully",
    user: newUser
  });
});

// PUT /users/:id - Update a user
app.put("/users/:id", (req, res) => {
  const id = parseInt(req.params.id);

  const user = users.find(u => u.id === id);

  if (!user) {
    return res.status(404).json({
      message: "User not found"
    });
  }

  const { name, email } = req.body;

  if (name) user.name = name;
  if (email) user.email = email;

  res.status(200).json({
    message: "User updated successfully",
    user
  });
});

// DELETE /users/:id - Delete a user
app.delete("/users/:id", (req, res) => {
  const id = parseInt(req.params.id);

  const userIndex = users.findIndex(u => u.id === id);

  if (userIndex === -1) {
    return res.status(404).json({
      message: "User not found"
    });
  }

  users.splice(userIndex, 1);

  res.status(200).json({
    message: "User deleted successfully"
  });
});

app.listen(PORT, () => {
  console.log(`Server running on port ${PORT}`);
});