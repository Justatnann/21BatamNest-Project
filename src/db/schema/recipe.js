const { int, timestamp, mysqlTable, varchar, bigint } = require("drizzle-orm/mysql-core");
const { products } = require("./products");
const { rawMaterial } = require("./material");

const recipe = mysqlTable("recipe", {
  productId: int("product_id")
    .references(() => products.productId)
    .notNull(),
  rawMaterialId: int("raw_material_id").references(() => rawMaterial.rawMaterialId),
  quantity: int("quantity").notNull(),
});

module.exports = { recipe };
