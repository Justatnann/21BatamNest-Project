const { int, timestamp, mysqlTable, varchar, bigint } = require("drizzle-orm/mysql-core");
const { products } = require("./products");
const { userSchema } = require("./user");
const { rawMaterial } = require("./material");

const purchaseInvoice = mysqlTable("purchase_invoice", {
  purchaseId: int("purchase_id").primaryKey({ autoIncrement: true }).autoincrement(),
  purchaseDate: timestamp("purchase_date").defaultNow().notNull(),
  amountPurchase: bigint("amount_purchase", { mode: "number" }).notNull(),
  UserId: int("user_id").notNull(),
});

const purchaseInvoiceItem = mysqlTable("purchase_item", {
  purchaseItemId: int("puchase_item_id").primaryKey({ autoIncrement: true }).autoincrement(),
  purchaseInvoiceId: int("purchase_id").notNull(),
  rawMaterialId: int("raw_material_id").notNull(),
  quantity: int("quantity").notNull(),
  unitPrice: bigint("unit_price", { mode: "number" }).notNull(),
  totalPrice: bigint("total_price", { mode: "number" }).notNull(),
});

module.exports = { purchaseInvoice, purchaseInvoiceItem };
