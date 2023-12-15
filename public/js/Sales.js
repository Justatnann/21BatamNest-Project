const dataBarang = [
  { id: 1, nama: "Wallet kering A",  Quantity:10, harga: 1000000},
  { id: 2, nama: "Wallet kering B",  Quantity:10, harga: 1000000},
  { id: 3, nama: "Wallet kering C",  Quantity:10, harga: 1000000},
  { id: 4, nama: "Wallet kering D",  Quantity:10, harga: 1000000},
  { id: 5, nama: "Wallet kering E",  Quantity:10, harga: 1000000},
  { id: 6, nama: "Wallet kering F",  Quantity:10, harga: 1000000},
  { id: 7, nama: "Wallet kering G",  Quantity:10, harga: 1000000},
  { id: 8, nama: "Wallet kering H",  Quantity:10, harga: 1000000},
  { id: 9, nama: "Wallet kering I",  Quantity:10, harga: 1000000},
  { id: 10, nama: "Wallet kering J", Quantity:10, harga: 1000000 },
  { id: 11, nama: "Wallet kering K", Quantity:10, harga: 1000000 },
  { id: 12, nama: "Wallet kering L", Quantity:10, harga: 1000000 },
  { id: 13, nama: "Wallet kering M", Quantity:10, harga: 1000000 },
  { id: 14, nama: "Wallet kering N", Quantity:10, harga: 1000000 },

];

function renderTable() {
  const tableBody = document.querySelector("#data-table tbody");
  tableBody.innerHTML = "";
  for (let i = 0; i < dataBarang.length; i++) {
    const row = document.createElement("tr");
    const formattedPrice = `IDR ${dataBarang[i].harga.toLocaleString("id-ID")}`;
    row.innerHTML = `
        <td>${i + 1}</td> <!-- Menggunakan nomor yang sesuai dengan indeks -->
        <td>${dataBarang[i].id}</td>
        <td>${dataBarang[i].nama}</td>
        <td>${dataBarang[i].Quantity} PCS </td> <!-- Menampilkan Quantity -->
        <td>${formattedPrice}</td> <!-- Harga dengan "IDR" -->
        <td>
          <button class="button" onclick="viewDetail(${
            dataBarang[i].id
          })" style="background-color:#31D2FF;">Detail</button>
          <button class="button" onclick="deleteRow(${
            dataBarang[i].id
          })" style="background-color:#FF322C;">Delete</button>
        </td>
      `;
    tableBody.appendChild(row);
  }
}


function updateItemDetails() {
  const itemNameSelect = document.getElementById("itemName");
  const itemCodeDisplay = document.getElementById("itemCodeDisplay");
  const priceInput = document.getElementById("price");

  // Dapatkan data terkait dengan item yang dipilih
  const selectedItemId = parseInt(itemNameSelect.options[itemNameSelect.selectedIndex].getAttribute("data-id"));
  const selectedItem = dataBarang.find((item) => item.id === selectedItemId);

  if (selectedItem) {
    itemCodeDisplay.textContent = selectedItemId;
    priceInput.value = selectedItem.harga;
  } else {
    itemCodeDisplay.textContent = "";
    priceInput.value = "";
  }
}

function addRow() {
  const tableBody = document.getElementById("invoiceTableBody");
  const itemCode = document.getElementById("itemCodeDisplay").textContent;
  const selectedItem = dataBarang.find((item) => item.id === parseInt(itemCode));
  const qty = parseFloat(document.getElementById("qty").value);

  const newRow = tableBody.insertRow();
  const cells = Array.from({ length: 6 }, () => newRow.insertCell());

  cells[0].innerHTML = document.getElementById("date").value;
  cells[1].innerHTML = itemCode;
  cells[2].innerHTML = selectedItem ? selectedItem.nama : "";
  cells[3].innerHTML = qty;

  const total = selectedItem ? qty * selectedItem.harga : 0;
  cells[4].innerHTML = `IDR ${total.toLocaleString("id-ID", { minimumFractionDigits: 2 })}`;

  const deleteButton = document.createElement("button");
  deleteButton.textContent = "Delete";
  deleteButton.addEventListener("click", function () {
    const row = this.parentNode.parentNode;
    row.parentNode.removeChild(row);
  });

  cells[5].appendChild(deleteButton);
}

function cancelEntry() {
  const form = document.getElementById("entryForm");
  form.reset();
  form.style.display = "none";
}

function calculateTotal() {
  const qty = parseFloat(document.getElementById("qty").value);
  const price = parseFloat(document.getElementById("price").value);
  const total = qty * price;

  if (!isNaN(total)) {
    document.getElementById("total").value = `IDR ${total.toLocaleString("id-ID", { minimumFractionDigits: 2 })}`;
  }
}
renderTable();
document.getElementById("itemName").addEventListener("change", updateItemDetails);

function showForm() {
  const form = document.getElementById("entryForm");
  form.style.display = "block";
}

// TS
const allSideMenu = document.querySelectorAll("#sidebar .side-menu.top li a");

allSideMenu.forEach((item) => {
  const li = item.parentElement;

  item.addEventListener("click", function () {
    allSideMenu.forEach((i) => {
      i.parentElement.classList.remove("active");
    });
    li.classList.add("active");
  });
});

// TOGGLE SIDEBAR
const menuBar = document.querySelector("#content nav .bx.bx-menu");
const sidebar = document.getElementById("sidebar");

menuBar.addEventListener("click", function () {
  sidebar.classList.toggle("hide");
});

const searchButton = document.querySelector("#content nav form .form-input button");
const searchButtonIcon = document.querySelector("#content nav form .form-input button .bx");
const searchForm = document.querySelector("#content nav form");

searchButton.addEventListener("click", function (e) {
  if (window.innerWidth < 576) {
    e.preventDefault();
    searchForm.classList.toggle("show");
    if (searchForm.classList.contains("show")) {
      searchButtonIcon.classList.replace("bx-search", "bx-x");
    } else {
      searchButtonIcon.classList.replace("bx-x", "bx-search");
    }
  }
});

if (window.innerWidth < 768) {
  sidebar.classList.add("hide");
} else if (window.innerWidth > 576) {
  searchButtonIcon.classList.replace("bx-x", "bx-search");
  searchForm.classList.remove("show");
}

window.addEventListener("resize", function () {
  if (this.innerWidth > 576) {
    searchButtonIcon.classList.replace("bx-x", "bx-search");
    searchForm.classList.remove("show");
  }
});

const switchMode = document.getElementById("switch-mode");

switchMode.addEventListener("change", function () {
  if (this.checked) {
    document.body.classList.add("dark");
  } else {
    document.body.classList.remove("dark");
  }
});



// ST
function generateReport() {
  const reportContainer = document.getElementById("reportContainer");

  const table = document.createElement("table");
  table.classList.add("report-table");

  const headerRow = table.insertRow();
  const headerCells = ["ID", "Name", "Price"];
  headerCells.forEach((cellText) => {
    const headerCell = document.createElement("th");
    headerCell.textContent = cellText;
    headerRow.appendChild(headerCell);
  });

  dataBarang.forEach((item) => {
    const dataRow = table.insertRow();
    const dataCells = [item.id, item.nama, `IDR ${item.harga.toLocaleString("id-ID")}`];
    dataCells.forEach((cellText) => {
      const dataCell = dataRow.insertCell();
      dataCell.textContent = cellText;
    });
  });

  reportContainer.innerHTML = "";
  reportContainer.appendChild(table);
}

const generateReportButton = document.getElementById("generateReportButton");
generateReportButton.addEventListener("click", generateReport);
