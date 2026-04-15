const bcrypt = require("bcrypt");
const jwt = require("jsonwebtoken");
const db = require("../config/db");
const AppDataSource = require("../config/data-source");


const { createUser, findUserByEmail, updatePassword } = require("../models/userModel");
const { genrateRefreshToken, generateAccessToken } = require("../utils/jwt");


const registerUser = async (req, res) => {

    try {
        const { name, email, password } = req.body;

        const existingUser = await findUserByEmail(email);

        if (existingUser) {
            return res.status(400).json({
                message: "Email already exists"
            });
        }


        const hashedPassword = await bcrypt.hash(password, 10);

        const user = await createUser(name, email, hashedPassword);
        res.status(201).json({ message: "User registered successfully", user: user });
    } catch (error) {
        console.error("Error registering user:", error);
        res.status(500).json({ message: "Internal server error" });
    }
};


const loginUser = async (req, res) => {
    try {
        const { email, password } = req.body;

        const user = await findUserByEmail(email);

        if (!user) {
            return res.status(400).json({
                message: "User not found"
            });
        }

        const isMatch = await bcrypt.compare(password, user.password);

        if (!isMatch) {
            return res.status(400).json({
                message: "Invalid password"
            });
        }
        const accessToken = generateAccessToken(user);
        const refreshToken = genrateRefreshToken(user);

        // res.status(200).json({
        //     message: "Login successful",
        //     accessToken,
        //     refreshToken,
        //     user: {
        //         id: user.id,
        //         name: user.name,
        //         email: user.email
        //     }
        // });

        res.cookie("refreshToken", refreshToken, {
            httpOnly: true,
            secure: false,
            sameSite: "Strict",
        });

        res.status(200).json({
            message: "Login successful",
            accessToken,
            user: {
                id: user.id,
                name: user.name,
                email: user.email
            }
        });

    } catch (error) {
        console.error("Login error:", error);
        res.status(500).json({
            message: "Server error"
        });
    }
};

const logoutUser = (req, res) => {
    res.clearCookie("refreshToken");
    res.json({ message: "Logged out" });
};


// const refreshToken = (req, res) => {
//     const token = req.cookies.refreshToken;

//     if (!token) {
//         return res.status(401).json({ message: "No token provided" });
//     }

//     jwt.verify(token, "REFRESH_SECRET_KEY", (err, user) => {
//         if (err) {
//             return res.status(403).json({ message: "Invalid refresh token" });
//         }

//         const newAccessToken = jwt.sign(
//             { id: user.id, email: user.email },
//             "ACCESS_SECRET_KEY",
//             { expiresIn: "15m" }
//         );

//         res.json({ accessToken: newAccessToken });
//     });
// };

const refreshToken = (req, res) => {
    const token = req.cookies.refreshToken;

    if (!token) {
        return res.status(401).json({ message: "No token provided" });
    }

    jwt.verify(token, process.env.REFRESH_SECRET_KEY, (err, user) => {
        if (err) {
            return res.status(403).json({ message: "Invalid refresh token" });
        }

        const newAccessToken = jwt.sign(
            { id: user.id, email: user.email },
            process.env.ACCESS_SECRET_KEY,
            { expiresIn: "15m" }
        );

        res.json({ accessToken: newAccessToken });
    });
};

const forgotPassword = async (req, res) => {
    try {

        const { email, password } = req.body;

        const user = await findUserByEmail(email);

        if (!user) {
            return res.status(404).json({
                message: "Email not found"
            });
        }

        const hashedPassword = await bcrypt.hash(password, 10);

        await updatePassword(email, hashedPassword);

        res.status(200).json({
            message: "Password updated successfully"
        });

    } catch (error) {

        console.error("Forgot password error:", error);

        res.status(500).json({
            message: "Server error"
        });
    }
};

// const createProduct = async (req, res) => {
//     console.log("Body : ", req.body);
//     const { name, category, price, quantity, description } = req.body;

//     const result = await db.query(
//         `INSERT INTO products (name, category, price, quantity, description)
//          VALUES ($1,$2,$3,$4,$5) RETURNING *`,
//         [name, category, price, quantity, description]
//     );

//     res.json(result.rows[0]);
// };


const createProduct = async (req, res) => {
    const repo = AppDataSource.getRepository("Product");

    const product = repo.create(req.body);
    const saved = await repo.save(product);

    res.json(saved);
};

// const getProducts = async (req, res) => {
//     const result = await db.query("SELECT * FROM products ORDER BY id DESC");
//     res.json(result.rows);
// };

const getProducts = async (req, res) => {
    const repo = AppDataSource.getRepository("Product");

    const products = await repo.find({
        order: { id: "DESC" }
    });

    res.json(products);
};

// const deleteProduct = async (req, res) => {
//     const { id } = req.params;
//     console.log("DELETE ID:", id);

//     await db.query("DELETE FROM products WHERE id=$1", [id]);

//     res.json({ message: "Deleted" });
// };

const deleteProduct = async (req, res) => {
    const repo = AppDataSource.getRepository("Product");

    await repo.delete(req.params.id);

    res.json({ message: "Deleted" });
};

// const updateProduct = async (req, res) => {
//     const { id } = req.params;
//     const { name, category, price, quantity, description } = req.body;

//     const result = await db.query(
//         `UPDATE products 
//          SET name=$1, category=$2, price=$3, quantity=$4, description=$5 
//          WHERE id=$6 RETURNING *`,
//         [name, category, price, quantity, description, id]
//     );

//     res.json(result.rows[0]);
// };

const updateProduct = async (req, res) => {
    const repo = AppDataSource.getRepository("Product");

    await repo.update(req.params.id, req.body);

    const updated = await repo.findOne({
        where: { id: parseInt(req.params.id) }
    });

    res.json(updated);
};

module.exports = { registerUser, loginUser, logoutUser, forgotPassword, refreshToken, createProduct, getProducts, deleteProduct, updateProduct };
