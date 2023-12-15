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

module.exports = { getMaterial, addProduct };
