const { drizzle } = require("drizzle-orm");

const { db } = require("../src/db/db");
const { userSchema } = require("../src/db/schema/user");
const { products } = require("../src/db/schema/products");
const { rawMaterial } = require("../src/db/schema/material");

db.transaction(async (tx) => {
  tx.insert(userSchema).values({ username: "admin", password: "123", email: "admin@mail.com" });
  tx.insert(products).values({ productName: "Sarang Burung", productPrice: 100000, productStock: 1000 });
  tx.insert(rawMaterial).values({ rawMaterialName: "Wallet Mentah", rawMaterialStock: 1000, unit: "gram" });
});
