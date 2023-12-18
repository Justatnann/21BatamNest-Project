const { db } = require("../db/db");
const { recipe } = require("../db/schema/recipe.js");
const { eq, desc, asc } = require("drizzle-orm");
const { rawMaterial } = require("../db/schema/material.js");
const { products } = require("../db/schema/products.js");

//product controller

const getProduct = async (req, res) => {
  try {
    const product = await db.select().from(products);
    const result = JSON.stringify(product);
    res.render("../src/views/inventory.ejs", { result });
  } catch (error) {
    if (error.message === "connect ECONNREFUSED ::1:3306") {
      res.render("../src/views/inventory.ejs", { result: "[]" });
    }
    res.status(500).render("../src/views/error.ejs", { errorHeader: error.message, errorDescription: error.stack });
  }
};

const addProduct = async (req, res) => {
  try {
    const product = req.body.product;
    const recipes = req.body.recipe;

    await db.transaction(async (tx) => {
      await tx
        .insert(products)
        .values({ productName: product[0].productName, productPrice: product[0].unitPrice, productStock: 0 });
      const productId = await tx.select().from(products).orderBy(desc(products.productId)).limit(1);

      if (recipes) {
        for (const item of recipes) {
          await tx
            .insert(recipe)
            .values({ productId: productId[0].productId, rawMaterialId: item.rawMaterialId, quantity: item.quantity });
        }
      } else {
        return;
      }
    });
    res.redirect("/inventory/product");
  } catch (error) {
    res.status(500).render("../src/views/error.ejs", { errorHeader: error.message, errorDescription: error.stack });
  }
};

const updateProduct = async (req, res) => {
  try {
    const product = req.body.product;
    const recipes = req.body.recipe;
    await db.transaction(async (tx) => {
      await tx
        .update(products)
        .set({
          productName: product[0].productName,
          productStock: product[0].productStock,
          productPrice: product[0].productPrice,
        })
        .where(eq(products.productId, product[0].productId));
    });
    res.redirect("/inventory/product");
  } catch (error) {
    res.status(500).render("../src/views/error.ejs", { errorHeader: error.message, errorDescription: error.stack });
  }
};

const getProductDetail = async (req, res) => {
  try {
    const productId = req.query.id;
    const product = await db.select().from(products).where(eq(products.productId, productId));
    const result = JSON.stringify(product);
    res.render("../src/views/edit-product.ejs", { result });
  } catch (error) {
    if (error.message === "connect ECONNREFUSED ::1:3306") {
      res.render("../src/views/inventory.ejs", { result: "[]" });
    }
    res.status(500).render("../src/views/error.ejs", { errorHeader: error.message, errorDescription: error.stack });
  }
};

const deleteProduct = async (req, res) => {
  try {
    const productId = req.query.id;
    await db.transaction(async (tx) => {
      await tx.delete(products).where(eq(products.productId, productId));
    });
    res.redirect("/inventory/product");
  } catch (error) {
    res.status(500).render("../src/views/error.ejs", { errorHeader: error.message, errorDescription: error.stack });
  }
};

//
//material controller

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

const updateMaterial = async (req, res) => {
  try {
    const material = req.body.material;

    await db.transaction(async (tx) => {
      await tx
        .update(rawMaterial)
        .set({
          rawMaterialName: material[0].materialName,
          rawMaterialStock: material[0].materialStock,
          unit: material[0].materialUnit,
        })
        .where(eq(rawMaterial.rawMaterialId, material[0].materialId));
    });
    res.redirect("/inventory/material");
  } catch (error) {
    res.status(500).render("../src/views/error.ejs", { errorHeader: error.message, errorDescription: error.stack });
  }
};

const deleteMaterial = async (req, res) => {
  try {
    const materialId = req.query.id;
    await db.transaction(async (tx) => {
      await tx.delete(rawMaterial).where(eq(rawMaterial.rawMaterialId, materialId));
    });
    res.redirect("/inventory/material");
  } catch (error) {
    res.status(500).render("../src/views/error.ejs", {
      errorHeader: "Couldn't Delete",
      errorDescription: "The Item you are deleting is used by other recipe",
    });
  }
};
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
    res.render("../src/views/edit-material.ejs", { result });
  } catch (error) {
    if (error.message === "connect ECONNREFUSED ::1:3306") {
      res.render("../src/views/inventory-material.ejs", { result: "[]" });
    }
    res.status(500).render("../src/views/error.ejs", { errorHeader: error.message, errorDescription: error.stack });
  }
};

module.exports = {
  addProduct,
  getProduct,
  getProductDetail,
  updateProduct,
  deleteProduct,
  getMaterial,
  getListMaterial,
  getMaterialDetail,
  addMaterial,
  updateMaterial,
  deleteMaterial,
};
