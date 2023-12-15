const { db } = require("../db/db");
const { eq, desc, asc } = require("drizzle-orm");
const { salesInvoice, salesInvoiceItem } = require("../db/schema/sales.js");

const getSalesHistory = async (req, res) => {
  try {
    const salesInvoices = await db.select().from(salesInvoice).orderBy(asc(salesInvoice.salesId));
    const result = JSON.stringify(salesInvoices);
    res.render("../src/views/dashboard.ejs", { result });
  } catch (error) {
    res.status(500).render("../src/views/error.ejs", { errorHeader: error.message, errorDescription: error.stack });
  }
};

module.exports = { getSalesHistory };
