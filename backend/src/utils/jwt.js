const jwt = require("jsonwebtoken");

const generateAccessToken = (user) => {
    return jwt.sign(
        { id: user.id, email: user.email },
        process.env.ACCESS_SECRET_KEY,
        { expiresIn: "15m" }
    );
};

const genrateRefreshToken = (user) => {
    return jwt.sign(
        { id: user.id, email: user.email },
        process.env.REFRESH_SECRET_KEY,
        { expiresIn: "7d" }
    );
};

module.exports = { generateAccessToken, genrateRefreshToken };

