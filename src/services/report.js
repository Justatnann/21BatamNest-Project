const { db } = require("../db/db");
const { sql, eq } = require("drizzle-orm");
const { purchaseInvoice, purchaseInvoiceItem } = require("../db/schema/purchase");
const { salesInvoice, salesInvoiceItem } = require("../db/schema/sales");
const { products } = require("../db/schema/products");

const dayjs = require("dayjs");
var utc = require("dayjs/plugin/utc");
var timezone = require("dayjs/plugin/timezone");
const { rawMaterial } = require("../db/schema/material");

dayjs.extend(utc);
dayjs.extend(timezone);

const generateSalesReport = async (req, res) => {
  try {
    let list = [];
    let totals = 0;
    const startDate = req.query.startDate || dayjs().subtract(1, "month").format("YYYY-MM-DD");
    const endDate = req.query.endDate || new Date().toISOString().split("T")[0];

    await db.transaction(async (tx) => {
      const report = await tx
        .select()
        .from(salesInvoice)
        .where(sql`sales_date >= ${startDate} AND sales_date <= ${dayjs(endDate).add(1, "day").format("YYYY-MM-DD")}`);
      for (const inv of report) {
        const item = await tx.select().from(salesInvoiceItem).where(eq(salesInvoiceItem.salesInvoiceId, inv.salesId));
        totals += inv.amountSold;
        for (const listItem of item) {
          const product = await tx.select().from(products).where(eq(products.productId, listItem.productId));
          list.push({
            salesDate: dayjs.tz(inv.salesDate, "Asia/Jakarta").subtract(1, "day").format("ddd, DD MMM YYYY"),
            unitPrice: listItem.unitPrice,
            salesId: listItem.salesInvoiceId,
            total: listItem.totalPrice,
            productName: product[0].productName,
            quantity: listItem.quantity,
          });
        }
      }
    });

    const result = JSON.stringify(list);
    const reportTotal = JSON.stringify(totals);
    res.render("../src/views/sales-report.ejs", { result, reportTotal });
  } catch (error) {
    return res
      .status(500)
      .render("../src/views/error.ejs", { errorHeader: error.message, errorDescription: error.stack });
  }
};
const generatePurchaseReport = async (req, res) => {
  try {
    let list = [];
    let totals = 0;
    const startDate = req.query.startDate || dayjs().subtract(1, "month").format("YYYY-MM-DD");
    const endDate = req.query.endDate || new Date().toISOString().split("T")[0];

    await db.transaction(async (tx) => {
      const report = await tx
        .select()
        .from(purchaseInvoice)
        .where(
          sql`purchase_date >= ${startDate} AND purchase_date <= ${dayjs(endDate).add(1, "day").format("YYYY-MM-DD")}`
        );
      for (const inv of report) {
        const item = await tx
          .select()
          .from(purchaseInvoiceItem)
          .where(eq(purchaseInvoiceItem.purchaseInvoiceId, inv.purchaseId));
        totals += inv.amountPurchase;
        for (const listItem of item) {
          const material = await tx
            .select()
            .from(rawMaterial)
            .where(eq(rawMaterial.rawMaterialId, listItem.rawMaterialId));
          list.push({
            purchaseDate: dayjs.tz(inv.purchaseDate, "Asia/Jakarta").subtract(1, "day").format("ddd, DD MMM YYYY"),
            unitPrice: listItem.unitPrice,
            purchaseId: listItem.purchaseInvoiceId,
            total: listItem.totalPrice,
            materialName: material[0].rawMaterialName,
            quantity: listItem.quantity,
          });
        }
      }
    });

    const result = JSON.stringify(list);
    const reportTotal = JSON.stringify(totals);
    res.render("../src/views/purchase-report.ejs", { result, reportTotal });
  } catch (error) {
    return res
      .status(500)
      .render("../src/views/error.ejs", { errorHeader: error.message, errorDescription: error.stack });
  }
};

module.exports = { generateSalesReport, generatePurchaseReport };
