// const express = require('express');
// const cors = require('cors');
// const cookieParser = require("cookie-parser");
// const authRoutes = require('./routes/authRoutes');
// const app = express();


// app.use(cors());
// app.use(express.json());

// app.use(cookieParser());


// app.use('/api/auth', authRoutes);

// app.listen(5000, () => {
//     console.log('Server is running on port 5000');
// });

require("dotenv").config();
const express = require('express');
const cors = require('cors');
const cookieParser = require("cookie-parser");
const authRoutes = require('./routes/authRoutes');

const AppDataSource = require('./config/data-source'); // 🔥 NEW

const app = express();

// app.use(cors());
app.use(cors({
    origin: "*", // frontend URL
    // credentials: true
}));
app.use(express.json());
app.use(cookieParser());

app.use('/api/auth', authRoutes);

// 🔥 DB connect + server start
AppDataSource.initialize()
    .then(() => {
        console.log("DB Connected ✅");

        app.listen(9001, () => {
            console.log('Server is running on port 9001 🚀');
        });
    })
    .catch((err) => {
        console.error("DB Connection Error ❌", err);
    });


/// arbaaz chouhan
// helloo