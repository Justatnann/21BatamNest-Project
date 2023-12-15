const { parse } = require("dotenv");

function removeCommas(value) {
  return value.replace(",", "") || 0;
}
function addCommas(value) {
  return value.toLocaleString();
}

Alpine.data("quantity", "");
Alpine.data("price", "");
Alpine.data("removeCommas", removeCommas);
Alphine.data("addCommas", addCommas);
