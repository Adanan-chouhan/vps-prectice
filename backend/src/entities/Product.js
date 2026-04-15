const { EntitySchema } = require("typeorm");

module.exports = new EntitySchema({
    name: "Product",
    tableName: "products",
    columns: {
        id: {
            primary: true,
            type: "int",
            generated: true,
        },
        name: { type: "varchar" },
        age: {
            type: "int",
            nullable: true
        },
        category: { type: "varchar" },
        price: { type: "float" },
        quantity: { type: "int" },
        description: { type: "text" },
    },
});