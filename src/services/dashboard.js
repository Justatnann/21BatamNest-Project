const { db } = require("../db/db");
const { eq, desc, asc } = require("drizzle-orm");
const { salesInvoice, salesInvoiceItem } = require("../db/schema/sales.js");
const dayjs = require("dayjs");
var utc = require("dayjs/plugin/utc");
var timezone = require("dayjs/plugin/timezone");

dayjs.extend(utc);
dayjs.extend(timezone);
const tz = "Asia/Jakarta";

const getSalesHistory = async (req, res) => {
  try {
    let list = [];
    const salesInvoices = await db.select().from(salesInvoice).orderBy(asc(salesInvoice.salesId));
    for (const inv of salesInvoices) {
      const dateFormat = dayjs.tz(inv.salesDate, "Asia/Jakarta").subtract(1, "day").format("ddd, DD MMM YYYY");

      list.push({ salesId: inv.salesId, salesDate: dateFormat, amountSold: inv.amountSold });
    }
    const result = JSON.stringify(list);
    res.render("../src/views/dashboard.ejs", { result });
  } catch (error) {
    if (error.message === "connect ECONNREFUSED ::1:3306") {
      res.render("../src/views/dashboard.ejs", { result: "[]" });
    }
    res.status(500).render("../src/views/error.ejs", { errorHeader: error.message, errorDescription: error.stack });
  }
};

module.exports = { getSalesHistory };
