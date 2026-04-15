const { EntitySchema } = require("typeorm");

module.exports = new EntitySchema({
    name: "User",
    tableName: "users",
    columns: {
        id: {
            primary: true,
            type: "int",
            generated: true,
        },
        name: {
            type: "varchar",
        },
        email: {
            type: "varchar",
            unique: true,
        },
        password: {
            type: "text",
        },
        // role: {
        //     type: "varchar",
        // },
        gender: {
            type: "varchar",
            nullable: true,
        },
    },
});