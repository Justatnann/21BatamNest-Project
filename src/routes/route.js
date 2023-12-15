const express = require("express");
const router = express.Router();
const path = require("path");
const { createSales, addSales, getSales, getSalesDetail } = require("../services/sales");
const { createPurchase, getPurchase, addPurchase } = require("../services/purchase");
const { loginService, registerService, logoutService } = require("../services/auth");
const { getMaterial, addProduct } = require("../services/inventory");
const { getSalesHistory } = require("../services/dashboard");

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

router.get("/sales/detail", getSalesDetail);

router.get("/sales/create", createSales).post("/sales/add", addSales);

//
//
//purchase
router.get("/purchase", getPurchase);

router.get("/purchase/detail", (req, res) => {
  res.render("../src/views/detailpurchase.ejs");
});

router.get("/purchase/create", createPurchase).post("/purchase/add", addPurchase);

//
//
//inventory
router.get("/inventory/product", (req, res) => {
  res.render("../src/views/inventory.ejs");
});

router.get("/inventory/material", (req, res) => {
  res.render("../src/views/inventory-material.ejs");
});

router.get("/inventory/create-product", getMaterial).post("/inventory/create-product/add", addProduct);

router.get("/inventory/create-material", (req, res) => {
  res.render("../src/views/create-material.ejs");
});

router.get("/inventory/detail", (req, res) => {
  res.render("../src/views/detailInventory.ejs");
});

router.get("/inventory/edit", (req, res) => {
  res.render("../src/views/editInventory.ejs");
});

router.get("/inventory/delete", (req, res) => {
  res.render("../src/views/Inventory.ejs");
});

router.get("/inventory/wip", (req, res) => {
  res.render("../src/views/wip.ejs");
});

module.exports = router;
