const { db } = require("../db/db");
const { eq, desc, asc, and, sql, gte, lte } = require("drizzle-orm");
const { products } = require("../db/schema/products.js");
const { salesInvoice, salesInvoiceItem } = require("../db/schema/sales.js");
const { stockProduct } = require("../db/schema/stock.js");
const dayjs = require("dayjs");
var utc = require("dayjs/plugin/utc");
var timezone = require("dayjs/plugin/timezone");

dayjs.extend(utc);
dayjs.extend(timezone);
const tz = "Asia/Jakarta";

const getSales = async (req, res) => {
  try {
    let listInvoice = [];
    const date = req.query.date;
    if (date === undefined) {
      const today = new Date();
      today.setDate(today.getDate() + 7);
      const salesInvoices = await db
        .select()
        .from(salesInvoice)
        .where(sql`sales_date <= ${today}`)
        .orderBy(asc(salesInvoice.salesId));
      for (const inv of salesInvoices) {
        const dateFormat = dayjs.tz(inv.salesDate, "Asia/Jakarta").subtract(1, "day").format("ddd, DD MMM YYYY");

        listInvoice.push({ salesId: inv.salesId, salesDate: dateFormat, amountSold: inv.amountSold });
        console.log(dateFormat, inv.salesDate);
      }
      console.log(today);
    } else {
      const dateMore = new Date(date);
      const dateLess = new Date(date);
      dateMore.setDate(dateMore.getDate() + 1);
      dateLess.setDate(dateLess.getDate());
      const salesInvoices = await db
        .select()
        .from(salesInvoice)
        .where(sql`sales_date >= ${dateLess} AND sales_date <= ${dateMore}`)
        .orderBy(asc(salesInvoice.salesId));
      console.log(salesInvoices);
      for (const inv of salesInvoices) {
        const dateFormat = dayjs.tz(inv.salesDate, "Asia/Jakarta").subtract(1, "day").format("ddd, DD MMM YYYY");

        listInvoice.push({ salesId: inv.salesId, salesDate: dateFormat, amountSold: inv.amountSold });
      }
    }

    const result = JSON.stringify(listInvoice);
    res.render("../src/views/sales.ejs", { result });
  } catch (error) {
    if (error.message === "connect ECONNREFUSED ::1:3306") {
      res.render("../src/views/sales.ejs", { result: "[]" });
    }
    res.status(500).render("../src/views/error.ejs", { errorHeader: error.message, errorDescription: error.stack });
  }
};

const getSalesDetail = async (req, res) => {
  try {
    let items = [];
    const salesInvoiceId = req.query.id;

    // get sales invoice item
    const salesInvoiceItems = await db
      .select()
      .from(salesInvoiceItem)
      .where(eq(salesInvoiceItem.salesInvoiceId, salesInvoiceId));
    //get sales invoice
    const Invoice = await db.select().from(salesInvoice).where(eq(salesInvoice.salesId, salesInvoiceId));
    // get product
    const product = await db.select().from(products).where(eq(products.productId, salesInvoiceItems[0].productId));

    //looping for every item in invoice to push to an array
    for (const item of salesInvoiceItems) {
      items.push({
        productId: product[0].productId,
        productName: product[0].productName,
        salesDate: dayjs.tz(Invoice[0].salesDate, "Asia/Jakarta").subtract(1, "day").format("ddd, DD MMM YYYY"),
        unitPrice: item.unitPrice,
        quantity: item.quantity,
        totalPrice: item.totalPrice,
      });
    }

    const result = JSON.stringify(items);
    const id = JSON.stringify(Invoice);

    res.render("../src/views/detail.ejs", { result, id });
  } catch (error) {
    res.status(500).render("../src/views/error.ejs", { errorHeader: error.message, errorDescription: error.stack });
  }
};

const createSales = async (req, res) => {
  try {
    const product = await db.select().from(products);
    const result = JSON.stringify(product);
    res.render("../src/views/create-sales.ejs", { result, message: "" });
  } catch (error) {
    res.status(500).render("../src/views/error.ejs", { errorHeader: error.message, errorDescription: error.stack });
  }
};

const addSales = async (req, res) => {
  try {
    if (!req.body.items) {
      throw new Error("Items is empty");
    }

    const items = req.body.items;

    const sumTotal = () => {
      let total = 0;
      for (const item of items) {
        total += parseInt(item.amount);
      }
      return total;
    };
    const total = sumTotal();
    await db.transaction(async (tx) => {
      await tx.insert(salesInvoice).values({ amountSold: total, UserId: req.session.user });
      const invoiceId = await tx.select().from(salesInvoice).orderBy(desc(salesInvoice.salesId)).limit(1);

      for (const item of items) {
        const product = await tx.select().from(products).where(eq(products.productId, item.productId));

        if (product[0].productStock <= 0) {
          throw new Error("Not Enough item");
        }

        const productId = product[0].productId;
        const unitPrice = product[0].productPrice;
        const productStock = product[0].productStock;
        const totalPrice = unitPrice * parseInt(item.quantity);

        await tx.insert(salesInvoiceItem).values({
          salesInvoiceId: invoiceId[0].salesId,
          productId: productId,
          quantity: item.quantity,
          unitPrice: unitPrice,
          totalPrice: totalPrice,
        });

        await tx.insert(stockProduct).values({
          initialStock: productStock,
          stockSold: item.quantity,
          remainingStock: productStock - item.quantity,
          productId: productId,
        });

        await tx
          .update(products)
          .set({ productStock: productStock - item.quantity })
          .where(eq(products.productId, item.productId));
      }
    });
    res.redirect("/sales");
  } catch (error) {
    if (error.message === "Items is empty") {
      return res.status(500).render("../src/views/error.ejs", {
        errorHeader: error.message,
        errorDescription: "Please Add Items to the invoice",
      });
    } else if (error.message === "Not Enough item") {
      return res.status(500).render("../src/views/error.ejs", {
        errorHeader: error.message,
        errorDescription: "Not Enough item",
      });
    } else {
      return res
        .status(500)
        .render("../src/views/error.ejs", { errorHeader: error.message, errorDescription: error.stack });
    }
  }
};

const deleteSalesInvoice = async (req, res) => {
  try {
    const salesId = req.query.id;
    const salesInvItem = await db
      .select()
      .from(salesInvoiceItem)
      .where(eq(salesInvoiceItem.salesInvoiceId, salesId[0]));
    const product = await db.select().from(products).where(eq(products.productId, salesInvItem[0].productId));
    const productStock = product[0].productStock;

    await db.transaction(async (tx) => {
      for (const item of salesInvItem) {
        await tx
          .update(products)
          .set({ productStock: productStock + item.quantity })
          .where(eq(products.productId, item.productId));
      }
      await tx.delete(salesInvoice).where(eq(salesInvoice.salesId, salesId[0]));
      await tx.delete(salesInvoiceItem).where(eq(salesInvoiceItem.salesInvoiceId, salesId[0]));
    });
    res.redirect("/sales");
  } catch (error) {
    res.status(500).render("../src/views/error.ejs", { errorHeader: error.message, errorDescription: error.stack });
  }
};

// const updateSales = async (req, res) => {
//   try {
//     const salesId = req.body.salesId;
//     const oldItem = req.body.oldItem;
//     const items = req.body.items;

//     const salesInv = await db.select().from(salesInvoice).where(eq(salesInvoice.salesId, salesId[0]));

//     for (const item of items) {
//       await db.transaction(async (tx) => {
//         const product = await tx.select().from(products).where(eq(products.productId, item.productId));
//         const oldProduct = await tx.select().from(products).where(eq(products.productId, oldItem.productId));
//         const productId = product[0].productId;
//         const productStock = product[0].productStock;
//         const unitPrice = product[0].productPrice;
//         const totalPrice = unitPrice * parseInt(item.quantity);

//         const initialStock = await tx
//           .select()
//           .from(stockProduct)
//           .where(eq(stockProduct.dateMutated, salesInv[0].salesDate));

//         await tx
//           .update(salesInvoiceItem)
//           .set({ productId: productId, quantity: item.quantity, unitPrice: unitPrice, totalPrice: totalPrice })
//           .where(
//             and(
//               eq(salesInvoiceItem.salesInvoiceId, salesInv[0].salesId),
//               eq(salesInvoiceItem.productId, oldProduct.productId)
//             )
//           );
//         await tx
//           .update(stockProduct)
//           .set({
//             productId: productId,
//             stockSold: item.quantity,
//             remainingStock: initialStock.initialStock - item.quantity,
//           })
//           .where(
//             and(eq(stockProduct.productId, oldProduct.productId), eq(stockProduct.dateMutated, salesInv[0].salesDate))
//           );

//         await tx
//           .update(product)
//           .values({ productStock: productStock + oldItem.quantity })
//           .where(eq(products.productId, item.productId));
//         await tx
//           .update(products)
//           .set({ productStock: productStock - item.quantity })
//           .where(eq(products.productId, item.productId));
//       });
//     }
//     res.redirect("/sales");
//   } catch (error) {
//     res.status(500).render("../src/views/error.ejs", { errorHeader: error.message, errorDescription: error.stack });
//   }
// };

module.exports = { createSales, addSales, getSales, getSalesDetail, deleteSalesInvoice };
