  function getQueryParam(name) {
    const urlParams = new URLSearchParams(window.location.search);
    return urlParams.get(name);
  }

  const encodedData = getQueryParam('data');
  if (encodedData) {
    const decodedData = decodeURIComponent(encodedData);
    const selectedBarang = JSON.parse(decodedData);

    // Mengisi data ke dalam tabel
    document.getElementById('detail-id').textContent = selectedBarang.no;
    document.getElementById('detail-date').textContent = selectedBarang.date;
    document.getElementById('detail-nama').textContent = selectedBarang.nama;
    document.getElementById('detail-harga').textContent = `IDR ${selectedBarang.harga.toLocaleString('id-ID')}`;
    document.getElementById('detail-jumlah').textContent = `${selectedBarang.jumlah} Pcs`;
    const totalHargaBeli = selectedBarang.harga * selectedBarang.jumlah;
    document.getElementById('detail-harga-total').textContent = `IDR ${totalHargaBeli.toLocaleString('id-ID')}`;
  } else {
    const detailContainer = document.getElementById('detail-container');
    detailContainer.innerHTML += '<p>Data not available.</p>';
  }
function goBack() {
  window.history.back();
}
