const { int, timestamp, mysqlTable, varchar, bigint } = require("drizzle-orm/mysql-core");

const products = mysqlTable("products", {
  productId: int("product_id").primaryKey({ autoIncrement: true }).autoincrement(),
  productName: varchar("product_name", { length: 255 }).notNull(),
  productStock: int("product_stock").notNull(),
  productPrice: bigint("product_price", { mode: "number" }).notNull(),
});

module.exports = { products };
