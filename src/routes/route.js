const express = require("express");
const router = express.Router();

const {
  createSales,
  addSales,
  getSales,
  getSalesDetail,
  deleteSalesInvoice,
  getSalesFilter,
} = require("../services/sales");
const {
  createPurchase,
  getPurchase,
  addPurchase,
  getPurchaseDetail,
  deletePurchaseInvoice,
} = require("../services/purchase");
const { loginService, registerService, logoutService } = require("../services/auth");
const {
  getMaterial,
  addProduct,
  getListMaterial,
  getMaterialDetail,
  addMaterial,
  updateMaterial,
  getProduct,
  getProductDetail,
  updateProduct,
  deleteMaterial,
  deleteProduct,
} = require("../services/inventory");
const { getSalesHistory } = require("../services/dashboard");
const { getWIP, createWIP, addWIP, cancelWIP, doneWIP } = require("../services/wip");
const { generateSalesReport, generatePurchaseReport } = require("../services/report");

//
//Auth
router
  .get("/login", (req, res) => {
    res.render("../src/views/login.ejs");
  })
  .post("/login", loginService);
router
  .get("/register", (req, res) => {
    res.render("../src/views/register.ejs");
  })
  .post("/register", registerService);
router.get("/logout", logoutService);

router.get("/", getSalesHistory);

//
//
//sales
router.get("/sales", getSales);

router.get("/sales/delete", deleteSalesInvoice);

router.get("/sales/detail", getSalesDetail);

router.get("/sales/report", generateSalesReport);

router.get("/sales/create", createSales).post("/sales/add", addSales);

//
//
//purchase
router.get("/purchase", getPurchase);

router.get("/purchase/delete", deletePurchaseInvoice);

router.get("/purchase/detail", getPurchaseDetail);

router.get("/purchase/report", generatePurchaseReport);

router.get("/purchase/create", createPurchase).post("/purchase/add", addPurchase);

//
//
//inventory
router.get("/inventory/product", getProduct).get("/inventory/product/delete", deleteProduct);
router.get("/inventory/product/detail", getProductDetail).post("/inventory/product/detail/update", updateProduct);
router.get("/inventory/create-product", getMaterial).post("/inventory/create-product/add", addProduct);

router.get("/inventory/material", getListMaterial).get("/inventory/material/delete", deleteMaterial);
router.get("/inventory/material/detail", getMaterialDetail).post("/inventory/material/detail/update", updateMaterial);
router
  .get("/inventory/create-material", (req, res) => {
    res.render("../src/views/create-material.ejs");
  })
  .post("/inventory/create-material/add", addMaterial);

router.get("/inventory/wip", getWIP);
router.get("/inventory/wip/done", doneWIP);
router.get("/inventory/wip/delete", cancelWIP);
router.get("/inventory/wip/create", createWIP).post("/inventory/wip/create/add", addWIP);

module.exports = router;
