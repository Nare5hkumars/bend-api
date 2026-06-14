const express = require("express");

const app = express();
const PORT = 3000;

// Middleware to parse JSON request bodies
app.use(express.json());

// Sample user data
let users = [
    {
        id: 1,
        name: "John Doe",
        email: "john@example.com",
        role: "Developer"
    },
    {
        id: 2,
        name: "Jane Smith",
        email: "jane@example.com",
        role: "Manager"
    }
];

// Optional: GET user by ID
app.get("/user/:id", (req, res) => {
    const userId = parseInt(req.params.id);

    const user = users.find(u => u.id === userId);

    if (!user) {
        return res.status(404).json({
            success: false,
            message: "User not found"
        });
    }

    res.status(200).json({
        success: true,
        user: user
    });
});

// PUT API to update user information
app.put("/user/:id", (req, res) => {
    const userId = parseInt(req.params.id);

    const user = users.find(u => u.id === userId);

    if (!user) {
        return res.status(404).json({
            success: false,
            message: "User not found"
        });
    }

    // Prevent errors if request body is empty
    const { name, email, role } = req.body || {};

    // Check if at least one field is provided
    if (!name && !email && !role) {
        return res.status(400).json({
            success: false,
            message: "Please provide name, email, or role to update."
        });
    }

    // Update only the fields that were sent
    if (name) {
        user.name = name;
    }

    if (email) {
        user.email = email;
    }

    if (role) {
        user.role = role;
    }

    res.status(200).json({
        success: true,
        message: "User information updated successfully",
        updatedUser: user
    });
});

// Root route
app.get("/", (req, res) => {
    res.send("Update User API is running...");
});

// Start server
app.listen(PORT, () => {
    console.log(`Server is running on port ${PORT}`);
});