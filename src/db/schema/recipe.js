const { int, timestamp, mysqlTable, varchar, bigint } = require("drizzle-orm/mysql-core");
const { products } = require("./products");
const { rawMaterial } = require("./material");

const recipe = mysqlTable("recipe", {
  productId: int("product_id").notNull(),
  rawMaterialId: int("raw_material_id").notNull(),
  quantity: int("quantity").notNull(),
});

module.exports = { recipe };
