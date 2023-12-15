const dataBarang = [
  { no: 1, date: "2022-22-10", nama: "Sarang", harga: 10000000, jumlah: 222 },
  { no: 2, date: "2022-22-10", nama: "Botol", harga: 150000, jumlah: 3121 },
  { no: 3, date: "2022-22-10", nama: "Gula", harga: 20000, jumlah: 522 },
  { no: 4, date: "2022-22-10", nama: "Madu", harga: 1500, jumlah: 3122 },
];

let currentPage = 1;
const itemsPerPage = 10;

function renderTable() {
  const tableBody = document.querySelector("tbody");
  tableBody.innerHTML = "";

  const startIndex = (currentPage - 1) * itemsPerPage;
  const endIndex = startIndex + itemsPerPage;

  for (let i = startIndex; i < endIndex && i < dataBarang.length; i++) {
    const barang = dataBarang[i];
    const row = document.createElement("tr");
    const formattedHarga = `IDR ${barang.harga.toLocaleString("id-ID")}`;
    const totalHargaBeli = barang.harga * barang.jumlah;

    row.innerHTML = `
      <td>${i + 1}</td>
      <td>${barang.date}</td>
      <td>${barang.nama}</td>
      <td>${formattedHarga}</td>
      <td>${barang.jumlah} Pcs</td>
      <td>IDR ${totalHargaBeli.toLocaleString("id-ID")}</td> <!-- Menampilkan total harga di sini -->
      <td>
        <button class="detail-btn" onclick="detailBarang(${barang.no})">Detail</button>
        <button class="edit-btn" onclick="editBarang(${barang.no})">Edit</button>
        <button class="delete-btn" onclick="DeleteBarang(${barang.no})">Delete</button>
      </td>
    `;
    tableBody.appendChild(row);
  }

  updatePagination();
}

function nextPage() {
  const totalPages = Math.ceil(dataBarang.length / itemsPerPage);
  if (currentPage < totalPages) {
    currentPage++;
    renderTable();
  }
}

function prevPage() {
  if (currentPage > 1) {
    currentPage--;
    renderTable();
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
    nextBtn.style.backgroundColor = "grey";
  } else {
    nextBtn.disabled = false;
    nextBtn.style.backgroundColor = "black";
  }
}

renderTable();

function detailBarang(no) {
  const selectedBarang = dataBarang.find((barang) => barang.no === no);
  if (selectedBarang) {
    const selectedBarangJSON = encodeURIComponent(JSON.stringify(selectedBarang));
    window.location.href = `detailpurchase.html?data=${selectedBarangJSON}`;
  }
}

function editBarang(no) {
  console.log(`Edit barang dengan nomor: ${no}`);
}

function DeleteBarang(no) {
  const index = dataBarang.findIndex((barang) => barang.no === no);
  if (index !== -1) {
    dataBarang.splice(index, 1);
    renderTable();
  }
}
function showForm() {
  window.location.href = "/";
}

function cancelForm() {
  const form = document.getElementById("barangForm");
  form.reset();
  const formContainer = document.getElementById("form-container");
  formContainer.style.display = "none";
}

function submitForm(event) {
  event.preventDefault();

  const nama = document.getElementById("nama").value;
  const harga = parseInt(document.getElementById("harga").value);
  const jumlah = parseInt(document.getElementById("jumlah").value);
  const date = document.getElementById("date").value;

  const newBarang = {
    no: dataBarang.length + 1,
    nama: nama,
    harga: harga,
    jumlah: jumlah,
    date: date,
  };

  dataBarang.push(newBarang);
  renderTable();
  cancelForm();
}
function editBarang(no) {
  const selectedBarang = dataBarang.find((barang) => barang.no === no);

  document.getElementById("editBarangNo").value = selectedBarang.no;
  document.getElementById("editNama").value = selectedBarang.nama;
  document.getElementById("editHarga").value = selectedBarang.harga;
  document.getElementById("editJumlah").value = selectedBarang.jumlah;
  document.getElementById("editDate").value = selectedBarang.date;

  const editFormContainer = document.getElementById("editFormContainer");
  editFormContainer.style.display = "block";
}

function submitEditForm(event) {
  event.preventDefault();

  const editNo = parseInt(document.getElementById("editBarangNo").value);
  const editNama = document.getElementById("editNama").value;
  const editHarga = parseInt(document.getElementById("editHarga").value);
  const editJumlah = parseInt(document.getElementById("editJumlah").value);
  const editDate = document.getElementById("editDate").value;

  const editedBarang = dataBarang.find((barang) => barang.no === editNo);
  editedBarang.nama = editNama;
  editedBarang.harga = editHarga;
  editedBarang.jumlah = editJumlah;
  editedBarang.date = editDate;

  renderTable();
  cancelEditForm();
}

function cancelEditForm() {
  const editForm = document.getElementById("editBarangForm");
  editForm.reset();

  const editFormContainer = document.getElementById("editFormContainer");
  editFormContainer.style.display = "none";
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
function redirectToInventoryReport() {
  window.location.href = "PurLap.html";
}

function goBack() {
  window.history.back();
}
