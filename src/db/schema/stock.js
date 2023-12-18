const { int, timestamp, mysqlTable, varchar, text } = require("drizzle-orm/mysql-core");
const { rawMaterial } = require("./material");
const { products } = require("./products");
//stock ini catat history misalnya awal 10, dan ada penjualan 5, maka stock sisa 5, maka next
//order awal jadi 5
const stockMaterial = mysqlTable("stock_material", {
  stockMaterialId: int("stock_id").primaryKey({ autoIncrement: true }).autoincrement(),
  materialId: int("material_id").notNull(),
  initialStock: int("initial_stock").notNull(),
  stockPuchase: int("stock_purchase").notNull(),
  remainingStock: int("remaining_stock").notNull(),
  dateMutated: timestamp("date_mutated").defaultNow().notNull(),
});

const stockProduct = mysqlTable("stock_product", {
  stockProductId: int("stock_id").primaryKey({ autoIncrement: true }).autoincrement(),
  productId: int("product_id").notNull(),
  initialStock: int("initial_stock").notNull(),
  stockSold: int("stock_sold").notNull(),
  remainingStock: int("remaining_stock").notNull(),
  dateMutated: timestamp("date_mutated").defaultNow().notNull(),
});

module.exports = { stockMaterial, stockProduct };
