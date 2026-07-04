const STORAGE_KEY = "dataLayanan";

function getData() {
    const data = localStorage.getItem(STORAGE_KEY)
    return data ? JSON.parse(data) : [];
}

function saveData(data) {
    localStorage.setItem(STORAGE_KEY, JSON.stringify(data));
}

const formLayanan = document.getElementById("formLayanan");

if(formLayanan) {
    const successMsg = document.getElementById("successMsg");

    formLayanan.addEventListener("submit", function (e) {
        e.preventDefault();

        const nama = document.getElementById("nama").value.trim();
        const nim = document.getElementById("nim").value.trim();
        const jenisLayanan = document.getElementById("jenisLayanan").value;
        const keterangan = document.getElementById("keterangan").value.trim();

        ["nama", "nim", "jenisLayanan", "keterangan"].forEach((id) =>{
            document.getElementById("err-" + id).textContent ="";     
        });

        let valid = true;

        if (nama == "") {
            document.getElementById("err-nama").textContent = "Nama wajib diisi.";
            valid = false;
        }

        if (nim === "") {
        document.getElementById("err-nim").textContent = "NIM wajib diisi.";
        valid = false;
        } else if (!/^[0-9]+$/.test(nim)) {
        document.getElementById("err-nim").textContent = "NIM hanya boleh berisi angka.";
        valid = false;
        }

        if (jenisLayanan === "") {
        document.getElementById("err-jenisLayanan").textContent = "Pilih jenis layanan.";
        valid = false;
        }

        if (keterangan === "") {
        document.getElementById("err-keterangan").textContent = "Keterangan wajib diisi.";
        valid = false;
        }

        if (!valid) {
        successMsg.textContent = "";
        return;
        }

        const data = getData();
        data.push({
            id: Date.now(),
            nama,
            nim,
            jenisLayanan,
            keterangan,
        });
        saveData(data);

        successMsg.textContent = "✅ Data berhasil disimpan!";
        formLayanan.reset();

        setTimeout(() => {
            window.location.href = "table.html";
        }, 1000);

    })
}

const tableBody = document.getElementById("tableBody");

if (tableBody) {
  const searchInput = document.getElementById("searchInput");
  const emptyMsg = document.getElementById("emptyMsg");
  const btnHapusSemua = document.getElementById("btnHapusSemua");

  function renderTable(filter = "") {
    const data = getData();
    const keyword = filter.toLowerCase();

    const filtered = data.filter((item) =>
      item.nama.toLowerCase().includes(keyword) ||
      item.nim.toLowerCase().includes(keyword) ||
      item.jenisLayanan.toLowerCase().includes(keyword)
    );

    tableBody.innerHTML = "";

    if (filtered.length === 0) {
      emptyMsg.style.display = "block";
      emptyMsg.textContent = data.length === 0
        ? "Belum ada data. Silakan tambahkan data melalui halaman Form Input."
        : "Data tidak ditemukan.";
      return;
    }

    emptyMsg.style.display = "none";

    filtered.forEach((item, index) => {
      const tr = document.createElement("tr");
      tr.innerHTML = `
        <td>${index + 1}</td>
        <td>${escapeHTML(item.nama)}</td>
        <td>${escapeHTML(item.nim)}</td>
        <td>${escapeHTML(item.jenisLayanan)}</td>
        <td>${escapeHTML(item.keterangan)}</td>
        <td><button class="btn-hapus" data-id="${item.id}">Hapus</button></td>
      `;
      tableBody.appendChild(tr);
    });

    // Pasang event listener untuk setiap tombol hapus
    document.querySelectorAll(".btn-hapus").forEach((btn) => {
      btn.addEventListener("click", function () {
        const id = Number(this.getAttribute("data-id"));
        let data = getData();
        data = data.filter((item) => item.id !== id);
        saveData(data);
        renderTable(searchInput.value);
      });
    });
  }

  
  function escapeHTML(str) {
    const div = document.createElement("div");
    div.textContent = str;
    return div.innerHTML;
  }

  searchInput.addEventListener("input", function () {
    renderTable(this.value);
  });

  btnHapusSemua.addEventListener("click", function () {
    if (confirm("Yakin ingin menghapus semua data?")) {
      saveData([]);
      renderTable();
    }
  });

  renderTable();
}

