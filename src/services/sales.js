const { db } = require("../db/db");
const { eq, desc, asc } = require("drizzle-orm");
const { products } = require("../db/schema/products.js");
const { salesInvoice, salesInvoiceItem } = require("../db/schema/sales.js");
const { stockProduct } = require("../db/schema/stock.js");

const getSales = async (req, res) => {
  try {
    const salesInvoices = await db.select().from(salesInvoice).orderBy(asc(salesInvoice.salesId));
    const result = JSON.stringify(salesInvoices);
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
    console.log(salesInvoiceId);

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
        productName: product[0].productName,
        salesDate: Invoice[0].salesDate,
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
      await db.insert(salesInvoice).values({ amountSold: total, UserId: 1 });
      const invoiceId = await db.select().from(salesInvoice).orderBy(desc(salesInvoice.salesId)).limit(1);

      for (const item of items) {
        const product = await tx.select().from(products).where(eq(products.productId, item.productId));

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
    } else {
      return res
        .status(500)
        .render("../src/views/error.ejs", { errorHeader: error.message, errorDescription: error.stack });
    }
  }
};

module.exports = { createSales, addSales, getSales, getSalesDetail };
