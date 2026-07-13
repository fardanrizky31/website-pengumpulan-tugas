let dataTugas = JSON.parse(localStorage.getItem('tugas')) || [];

// ========= BAGIAN 1: UNTUK SISWA =========
const form = document.getElementById('formTugas');
if (form) { // Kode berjalan jika form ditemukan
  form.addEventListener('submit', (e) => {
    e.preventDefault();
    const nama = document.getElementById('nama').value;
    const mapel = document.getElementById('mapel').value;
    const judul = document.getElementById('judul').value;
    const file = document.getElementById('file').files[0];

    if(!file) { alert('Pilih file dulu!'); return; }

    const reader = new FileReader();
    reader.onload = function(event) {
      const tugasBaru = {
        nama, mapel, judul,
        fileName: file.name,
        fileData: event.target.result,
        waktu: new Date().toLocaleString()
      };
      dataTugas.push(tugasBaru);
      localStorage.setItem('tugas', JSON.stringify(dataTugas));
      alert('Tugas berhasil dikumpulkan!');
      form.reset();
    };
    reader.readAsDataURL(file);
  });
}

// ========= BAGIAN 2: UNTUK GURU =========
const tabelBody = document.querySelector('#tabelTugas tbody');
if (tabelBody) { // Kode berjalan jika tabel ditemukan 
  const cariInput = document.getElementById('cariInput');
  const filterMapel = document.getElementById('filterMapel');

  if(cariInput && filterMapel) {
    cariInput.addEventListener('keyup', tampilkanTugas);
    filterMapel.addEventListener('change', tampilkanTugas);
  }

  tampilkanTugas(); // jalankan saat pertama kali dibuka
}

function tampilkanTugas() {
  if(!tabelBody) return;
  
  const kataCari = document.getElementById('cariInput')?.value.toLowerCase() || "";
  const mapelPilih = document.getElementById('filterMapel')?.value || "semua";

  const dataFilter = dataTugas.filter(t => {
    const cocokCari = t.nama.toLowerCase().includes(kataCari) || t.judul.toLowerCase().includes(kataCari);
    const cocokMapel = mapelPilih === "semua" || t.mapel === mapelPilih;
    return cocokCari && cocokMapel;
  });

  tabelBody.innerHTML = "";
  if(dataFilter.length === 0) {
    tabelBody.innerHTML = '<tr><td colspan="6" style="text-align:center;">Belum ada tugas masuk</td></tr>';
    return;
  }

  dataFilter.forEach((t) => {
    const indexBenar = dataTugas.indexOf(t); 
tabelBody.innerHTML += `
<tr>
  <td data-label="Nama">${t.nama}</td>
  <td data-label="Mapel">${t.mapel}</td>
  <td data-label="Judul">${t.judul}</td>
  <td data-label="File"><a href="${t.fileData}" download="${t.fileName}">Download</a></td>
  <td data-label="Waktu">${t.waktu}</td>
  <td data-label="Aksi"><button class="btn-hapus" onclick="hapusTugas(${indexBenar})">Hapus</button></td>
</tr>`;
  });
}

function hapusTugas(index) {
  if(confirm('Yakin mau hapus tugas ini?')) {
    dataTugas.splice(index, 1);
    localStorage.setItem('tugas', JSON.stringify(dataTugas));
    tampilkanTugas();
  }
}

function hapusSemua() {
  if(confirm('Yakin mau hapus SEMUA data tugas?')) {
    localStorage.removeItem('tugas');
    dataTugas = [];
    tampilkanTugas();
  }
}

function logout() {
  localStorage.removeItem('loginGuru');
  window.location.href = "index.html";
}
