const data = [
  { id: 1, name: "INV00001", date: "2023-10-14", price: 5000000 },
  { id: 2, name: "INV00002", date: "2023-10-14", price: 5000 },
  { id: 3, name: "INV00003", date: "2023-10-14", price: 5000 },
  { id: 4, name: "INV00004", date: "2023-10-14", price: 355867 },
  { id: 5, name: "INV00005", date: "2023-10-14", price: 5000000 },
  { id: 6, name: "INV00006", date: "2023-10-14", price: 5000 },
  { id: 7, name: "INV00007", date: "2023-10-14", price: 5000 },
  { id: 8, name: "INV00008", date: "2023-10-14", price: 355867 },
  { id: 9, name: "INV00009", date: "2023-10-14", price: 5000000 },
  { id: 10, name: "INV00010", date: "2023-10-14", price: 5000 },
  { id: 11, name: "INV00011", date: "2023-10-14", price: 5000 },
  { id: 4, name: "INV00004", date: "2023-10-14", price: 355867 },
  { id: 5, name: "INV00005", date: "2023-10-14", price: 5000000 },
  { id: 6, name: "INV00006", date: "2023-10-14", price: 5000 },
  { id: 7, name: "INV00007", date: "2023-10-14", price: 5000 },
  { id: 8, name: "INV00008", date: "2023-10-14", price: 355867 },
  { id: 9, name: "INV00009", date: "2023-10-14", price: 5000000 },
  { id: 10, name: "INV00010", date: "2023-10-14", price: 5000 },
  { id: 11, name: "INV00011", date: "2023-10-14", price: 5000 },
];

let currentPage = 1;
const itemsPerPage = 10;

function renderTableData() {
  const tableBody = document.querySelector("#data-table tbody");
  tableBody.innerHTML = "";
  const startIndex = (currentPage - 1) * itemsPerPage;
  const endIndex = startIndex + itemsPerPage;

  for (let i = startIndex; i < endIndex && i < data.length; i++) {
    const row = document.createElement("tr");
    const formattedPrice = `IDR ${data[i].price.toLocaleString("id-ID")}`;

    row.innerHTML = `
      <td>${i + 1}</td>
      <td>${data[i].name}</td>
      <td>${data[i].date}</td>
      <td>${formattedPrice}</td>
      <td>
        <button class="button" onclick="viewDetail(${data[i].id})" style="background-color:#31D2FF;">Detail</button>
      </td>
    `;

    tableBody.appendChild(row);
  }
}

function viewDetail(id) {
  const item = data.find((item) => item.id === id);
  if (item) {
    window.location.href = `sales/detail`;
  } else {
    alert("Detail not found.");
  }
}

function viewDetail(id) {
  window.location.href = `sales/detail`;
}

function deleteRow(id) {
  const index = data.findIndex((item) => item.id === id);

  if (index !== -1) {
    data.splice(index, 1);
    renderTableData();
  } else {
    alert("Data not found.");
  }
}

renderTableData();

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

// paggi
function nextPage() {
  const totalPages = Math.ceil(data.length / itemsPerPage);
  if (currentPage < totalPages) {
    currentPage++;
    renderTableData();
  }
}

function prevPage() {
  if (currentPage > 1) {
    currentPage--;
    renderTableData();
  }
}

function updatePagination() {
  const prevBtn = document.getElementById("prev");
  const nextBtn = document.getElementById("next");

  if (currentPage === 1) {
    prevBtn.disabled = true;
    prevBtn.style.backgroundColor = "grey";
  } else {
    prevBtn.disabled = false;
    prevBtn.style.backgroundColor = "black";
  }

  const totalPages = Math.ceil(dataBarang.length / itemsPerPage);
  if (currentPage === totalPages) {
    nextBtn.disabled = true;
    nextBtn.style.backgroundColor = "red";
  } else {
    nextBtn.disabled = false;
    nextBtn.style.backgroundColor = "black";
  }
}
