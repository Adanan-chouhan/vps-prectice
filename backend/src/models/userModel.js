// const db = require("../config/db");

// const findUserByEmail = async (email) => {
//     const result = await db.query(
//         "SELECT * FROM users WHERE email=$1",
//         [email]
//     );
//     return result.rows[0];
// };

// const createUser = async (name, email, password) => {
//     const result = await db.query(
//         "INSERT INTO users (name, email, password) VALUES ($1, $2, $3) RETURNING *",
//         [name, email, password]
//     );
//     return result.rows[0];
// }


// const updatePassword = async (email, password) => {

//     const result = await db.query(
//         "UPDATE users SET password=$1 WHERE email=$2 RETURNING *",
//         [password, email]
//     );

//     return result.rows[0];
// };

// module.exports = {
//     createUser,
//     findUserByEmail,
//     updatePassword
// };

const AppDataSource = require("../config/data-source");

const findUserByEmail = async (email) => {
    const repo = AppDataSource.getRepository("User");
    return await repo.findOne({ where: { email } });
};

const createUser = async (name, email, password) => {
    const repo = AppDataSource.getRepository("User");

    const user = repo.create({ name, email, password });
    return await repo.save(user);
};

const updatePassword = async (email, password) => {
    const repo = AppDataSource.getRepository("User");

    await repo.update({ email }, { password });
    return await repo.findOne({ where: { email } });
};

module.exports = {
    createUser,
    findUserByEmail,
    updatePassword,
};