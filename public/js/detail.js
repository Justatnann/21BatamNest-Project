function getQueryParam(name) {
  const urlParams = new URLSearchParams(window.location.search);
  return urlParams.get(name);
}

const invoiceId = getQueryParam("id");

const selectedInvoice = data.find(
  (invoice) => invoice.id === parseInt(invoiceId)
);

if (selectedInvoice) {
  document.getElementById("detail-id").textContent = selectedInvoice.name;
  document.getElementById("detail-date").textContent = selectedInvoice.date;
  document.getElementById(
    "detail-price"
  ).textContent = `IDR ${selectedInvoice.price.toLocaleString("id-ID")}`;
  // You can add more details here based on your data structure
} else {
  const detailContainer = document.getElementById("details");
  detailContainer.innerHTML += "<p>Invoice not found.</p>";
}

function goBack() {
  window.history.back();
}
