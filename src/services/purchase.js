const { db } = require("../db/db");
const { eq, desc, asc } = require("drizzle-orm");
const { purchaseInvoice, purchaseInvoiceItem } = require("../db/schema/purchase.js");
const { stockMaterial } = require("../db/schema/stock.js");
const { rawMaterial } = require("../db/schema/material.js");

const getPurchase = async (req, res) => {
  try {
    const purchaseInvoices = await db.select().from(purchaseInvoice).orderBy(asc(purchaseInvoice.purchaseId));
    const result = JSON.stringify(purchaseInvoices);

    res.render("../src/views/purchase.ejs", { result });
  } catch (error) {
    if (error.message === "connect ECONNREFUSED ::1:3306") {
      res.render("../src/views/purchase.ejs", { result: "[]" });
    }
    res.status(500).render("../src/views/error.ejs", { errorHeader: error.message, errorDescription: error.stack });
  }
};

const getPurchaseDetail = async (req, res) => {
  try {
    let items = [];
    const purchaseInvoiceId = req.query.id;

    // get purchase invoice item
    const purchaseInvoiceItems = await db
      .select()
      .from(purchaseInvoiceItem)
      .where(eq(purchaseInvoiceItem.purchaseInvoiceId, purchaseInvoiceId));
    //get purchase invoice
    const Invoice = await db.select().from(purchaseInvoice).where(eq(purchaseInvoice.purchaseId, purchaseInvoiceId));

    // get material
    const material = await db
      .select()
      .from(rawMaterial)
      .where(eq(rawMaterial.rawMaterialId, purchaseInvoiceItems[0].rawMaterialId));

    //looping for every item in invoice to push to an array
    for (const item of purchaseInvoiceItems) {
      items.push({
        materialName: material[0].rawMaterialName,
        purchaseDate: Invoice[0].purchaseDate,
        unitPrice: item.unitPrice,
        quantity: item.quantity,
        totalPrice: item.totalPrice,
      });
    }

    const result = JSON.stringify(items);
    const id = JSON.stringify(Invoice);

    res.render("../src/views/detailpurchase.ejs", { result, id });
  } catch (error) {
    res.status(500).render("../src/views/error.ejs", { errorHeader: error.message, errorDescription: error.stack });
  }
};

const createPurchase = async (req, res) => {
  try {
    const material = await db.select().from(rawMaterial);
    const result = JSON.stringify(material);
    res.render("../src/views/create-purchase.ejs", { result });
  } catch (error) {
    res.status(500).render("../src/views/error.ejs", { errorHeader: error.message, errorDescription: error.stack });
  }
};

const addPurchase = async (req, res) => {
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
      await db.insert(purchaseInvoice).values({ amountPurchase: total, UserId: 1 });
      const invoiceId = await db.select().from(purchaseInvoice).orderBy(desc(purchaseInvoice.purchaseId)).limit(1);

      for (const item of items) {
        const raw = await tx.select().from(rawMaterial).where(eq(rawMaterial.rawMaterialId, item.rawMaterialId));

        const materialId = raw[0].rawMaterialId;
        const unitPrice = parseInt(item.unitPrice);
        const materialStock = raw[0].rawMaterialStock;
        const totalPrice = unitPrice * parseInt(item.quantity);

        await tx.insert(purchaseInvoiceItem).values({
          purchaseInvoiceId: invoiceId[0].purchaseId,
          rawMaterialId: materialId,
          quantity: item.quantity,
          unitPrice: unitPrice,
          totalPrice: totalPrice,
        });

        await tx.insert(stockMaterial).values({
          initialStock: materialStock,
          stockPuchase: item.quantity,
          remainingStock: materialStock - item.quantity,
          materialId: materialId,
        });

        await tx
          .update(rawMaterial)
          .set({ rawMaterialStock: materialStock + item.quantity })
          .where(eq(rawMaterial.rawMaterialId, item.rawMaterialId));
      }
    });
    res.redirect("/purchase");
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

module.exports = { createPurchase, addPurchase, getPurchase, getPurchaseDetail };
