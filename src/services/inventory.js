const { db } = require("../db/db");
const { recipe } = require("../db/schema/recipe.js");
const { eq, desc, asc } = require("drizzle-orm");
const { rawMaterial } = require("../db/schema/material.js");
const { products } = require("../db/schema/products.js");

const getMaterial = async (req, res) => {
  try {
    const material = await db.select().from(rawMaterial);
    const result = JSON.stringify(material);
    res.render("../src/views/create-product.ejs", { result });
  } catch (error) {
    if (error.message === "connect ECONNREFUSED ::1:3306") {
      res.render("../src/views/inventory.ejs", { result: "[]" });
    }
    res.status(500).render("../src/views/error.ejs", { errorHeader: error.message, errorDescription: error.stack });
  }
};

const getListMaterial = async (req, res) => {
  try {
    const material = await db.select().from(rawMaterial);
    const result = JSON.stringify(material);
    res.render("../src/views/inventory-material.ejs", { result });
  } catch (error) {
    if (error.message === "connect ECONNREFUSED ::1:3306") {
      res.render("../src/views/inventory-material.ejs", { result: "[]" });
    }
    res.status(500).render("../src/views/error.ejs", { errorHeader: error.message, errorDescription: error.stack });
  }
};
const getMaterialDetail = async (req, res) => {
  try {
    const materialId = req.query.id;
    const material = await db.select().from(rawMaterial).where(eq(rawMaterial.rawMaterialId, materialId));
    const result = JSON.stringify(material);
    res.render("../src/views/detail-material.ejs", { result });
  } catch (error) {
    if (error.message === "connect ECONNREFUSED ::1:3306") {
      res.render("../src/views/inventory-material.ejs", { result: "[]" });
    }
    res.status(500).render("../src/views/error.ejs", { errorHeader: error.message, errorDescription: error.stack });
  }
};

const addProduct = async (req, res) => {
  try {
    const product = req.body.product;
    const recipes = req.body.recipe;
    console.log(recipes);
    await db.transaction(async (tx) => {
      await tx
        .insert(products)
        .values({ productName: product[0].productName, productPrice: product[0].unitPrice, productStock: 0 });
      const productId = await tx.select().from(products).orderBy(desc(products.productId)).limit(1);

      if (!recipes) {
        return;
      } else {
        for (const item of recipes) {
          await tx
            .insert(recipe)
            .values({ productId: productId[0].productId, rawMaterialId: item.materialId, quantity: item.quantity });
        }
      }
    });
    res.redirect("/inventory");
  } catch (error) {
    res.status(500).render("../src/views/error.ejs", { errorHeader: error.message, errorDescription: error.stack });
  }
};

const addMaterial = async (req, res) => {
  try {
    const material = req.body.material;
    await db.transaction(async (tx) => {
      await tx
        .insert(rawMaterial)
        .values({ rawMaterialName: material[0].name, rawMaterialStock: 0, unit: material[0].unit });
    });
    res.redirect("/inventory/material");
  } catch (error) {
    res.status(500).render("../src/views/error.ejs", { errorHeader: error.message, errorDescription: error.stack });
  }
};

module.exports = { getMaterial, addProduct, getListMaterial, getMaterialDetail, addMaterial };
