const { int, timestamp, mysqlTable, varchar, bigint } = require("drizzle-orm/mysql-core");
const { products } = require("./products");
const { userSchema } = require("./user");

const salesInvoice = mysqlTable("sales_invoice", {
  salesId: int("sales_id").primaryKey({ autoIncrement: true }).autoincrement(),
  salesDate: timestamp("sales_date").defaultNow().notNull(),
  amountSold: bigint("amount_sold", { mode: "number" }).notNull(),
  UserId: int("user_id").notNull(),
});

const salesInvoiceItem = mysqlTable("sales_item", {
  salesItemId: int("sales_item_id").primaryKey({ autoIncrement: true }).autoincrement(),
  salesInvoiceId: int("sales_id").notNull(),
  productId: int("product_id").notNull(),
  quantity: int("quantity").notNull(),
  unitPrice: bigint("unit_price", { mode: "number" }).notNull(),
  totalPrice: bigint("total_price", { mode: "number" }),
});

module.exports = { salesInvoice, salesInvoiceItem };
