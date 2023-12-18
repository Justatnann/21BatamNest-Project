const { int, bigint, mysqlTable, timestamp, text } = require("drizzle-orm/mysql-core");
const { products } = require("./products");
const { rawMaterial } = require("./material");
const { sql } = require("drizzle-orm");

const workInProgress = mysqlTable("work_in_progress", {
  wipId: int("wip_id").primaryKey({ autoIncrement: true }).autoincrement(),
  productId: int("product_id").notNull(),
  quantity: int("quantity_used").notNull(),
  startDate: timestamp("start_date").defaultNow().notNull(),
  endDate: timestamp("end_date"),
});

module.exports = { workInProgress };
