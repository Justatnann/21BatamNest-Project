const { drizzle } = require("drizzle-orm/mysql2");
const { rawMaterial } = require("./schema/material");
const { products } = require("./schema/material");
const { purchaseInvoice, purchaseInvoiceItem } = require("./schema/material");
const { salesInvoice, salesInvoiceItem } = require("./schema/material");
const { stockMaterial, stockProduct } = require("./schema/material");
const { userSchema } = require("./schema/material");
const { workInProgress } = require("./schema/material");
const mysql = require("mysql2/promise");

const poolConnection = mysql.createPool({
  host: "localhost",
  user: "root",
  database: "batamnest",
  password: "",
});

const db = drizzle(poolConnection, {
  rawMaterial,
  products,
  purchaseInvoice,
  purchaseInvoiceItem,
  salesInvoice,
  salesInvoiceItem,
  stockMaterial,
  stockProduct,
  userSchema,
  workInProgress,
  mode: "default",
});

module.exports = { db };
