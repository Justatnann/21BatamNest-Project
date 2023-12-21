const { db } = require("../db/db");
const { recipe } = require("../db/schema/recipe.js");
const { eq, desc, asc, isNotNull } = require("drizzle-orm");
const { rawMaterial } = require("../db/schema/material.js");
const { products } = require("../db/schema/products.js");
const { workInProgress } = require("../db/schema/wip.js");
const { raw } = require("express");

const dayjs = require("dayjs");
var utc = require("dayjs/plugin/utc");
var timezone = require("dayjs/plugin/timezone");

dayjs.extend(utc);
dayjs.extend(timezone);
const tz = "Asia/Jakarta";

const getWIP = async (req, res) => {
  try {
    const wip = await db.select().from(workInProgress);

    let listWip = [];

    for (const item of wip) {
      if (item.endDate === null) {
        const product = await db.select().from(products).where(eq(products.productId, item.productId));

        listWip.push({
          startDate: dayjs.tz(item.startDate, "Asia/Jakarta").subtract(1, "day").format("ddd, DD MMM YYYY"),
          productName: product[0].productName,
          quantity: item.quantity,
          id: item.wipId,
        });
      }
    }

    const result = JSON.stringify(listWip);
    res.render("../src/views/wip.ejs", { result });
  } catch (error) {
    if (error.message === "connect ECONNREFUSED ::1:3306") {
      res.render("../src/views/wip.ejs", { result: "[]" });
    }
    res.status(500).render("../src/views/error.ejs", { errorHeader: error.message, errorDescription: error.stack });
  }
};

const createWIP = async (req, res) => {
  try {
    const product = await db.select().from(products);

    const result = JSON.stringify({ product });
    res.render("../src/views/create-wip.ejs", { result });
  } catch (error) {
    if (error.message === "connect ECONNREFUSED ::1:3306") {
      res.render("../src/views/create-wip.ejs", { result: "[]" });
    }
    res.status(500).render("../src/views/error.ejs", { errorHeader: error.message, errorDescription: error.stack });
  }
};

const addWIP = async (req, res) => {
  try {
    const product = req.body.product;

    const recipes = await db.select().from(recipe).where(eq(recipe.productId, product[0].productId));

    if (!recipes) {
      throw new Error("This Item Does Not Need To Be Processed");
    }

    await db.transaction(async (tx) => {
      for (const item of recipes) {
        let rawStock = await tx.select().from(rawMaterial).where(eq(rawMaterial.rawMaterialId, item.rawMaterialId));

        if (rawStock[0].rawMaterialStock < item.quantity * product[0].quantity) {
          throw new Error("Not Enough Stock");
        }
        await tx
          .update(rawMaterial)
          .set({ rawMaterialStock: rawStock[0].rawMaterialStock - item.quantity * product[0].quantity })
          .where(eq(rawMaterial.rawMaterialId, item.rawMaterialId));
      }
      await tx.insert(workInProgress).values({ productId: product[0].productId, quantity: product[0].quantity });
    });
    res.redirect("/inventory/wip");
  } catch (error) {
    if (error.message === "Not Enough Stock") {
      res.status(500).render("../src/views/error.ejs", {
        errorHeader: error.message,
        errorDescription: "Please Prepare The Needed Material For this Product",
      });
    }
    res.status(500).render("../src/views/error.ejs", { errorHeader: error.message, errorDescription: error.stack });
  }
};

const cancelWIP = async (req, res) => {
  try {
    const wipId = req.query.id;
    const wip = await db.select().from(workInProgress).where(eq(workInProgress.wipId, wipId));

    const recipes = await db.select().from(recipe).where(eq(recipe.productId, wip[0].productId));

    await db.transaction(async (tx) => {
      for (const item of recipes) {
        const rawStock = await tx.select().from(rawMaterial).where(eq(rawMaterial.rawMaterialId, item.rawMaterialId));
        await tx
          .update(rawMaterial)
          .set({ rawMaterialStock: rawStock[0].rawMaterialStock + item.quantity * wip[0].quantity })
          .where(eq(rawStock[0].rawMaterialId, item.rawMaterialId));
      }
      await tx.delete(workInProgress).where(eq(workInProgress.wipId, wipId));
    });
    res.redirect("/inventory/wip");
  } catch (error) {
    res.status(500).render("../src/views/error.ejs", { errorHeader: error.message, errorDescription: error.stack });
  }
};

const doneWIP = async (req, res) => {
  try {
    const wipId = req.query.id;
    const wip = await db.select().from(workInProgress).where(eq(workInProgress.wipId, wipId));
    const productStock = await db.select().from(products).where(eq(products.productId, wip[0].productId));
    await db.transaction(async (tx) => {
      await tx
        .update(products)
        .set({ productStock: productStock[0].productStock + wip[0].quantity })
        .where(eq(products.productId, wip[0].productId));
      await tx.update(workInProgress).set({ endDate: new Date() }).where(eq(workInProgress.wipId, wipId));
    });
    res.redirect("/inventory/wip");
  } catch (error) {
    res.status(500).render("../src/views/error.ejs", { errorHeader: error.message, errorDescription: error.stack });
  }
};

module.exports = { getWIP, createWIP, addWIP, cancelWIP, doneWIP };
