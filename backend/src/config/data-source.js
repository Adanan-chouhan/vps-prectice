require("dotenv").config();
require("reflect-metadata");
const { DataSource } = require("typeorm");
const User = require("../entities/User");
const Product = require("../entities/Product");

// ✅ data-source.js
const AppDataSource = new DataSource({
    type: "postgres",
    host: process.env.DB_HOST,
    port: parseInt(process.env.DB_PORT),
    username: process.env.DB_USERNAME,
    password: process.env.DB_PASSWORD,
    database: process.env.DB_NAME,
    synchronize: false,
    entities: [User, Product],
    // migrations: ["src/migration/**/*.js"],
    // migrations: ["src/migration/*.js"],

    // entities: [__dirname + "/entity/*.js"],
    migrations: [process.cwd() + "/src/migration/*.js"],

    // synchronize: true,
});

module.exports = AppDataSource;