const fs = require('fs');

// Read data.js and append export
let dataJsContent = fs.readFileSync('data.js', 'utf8');
dataJsContent += '\nmodule.exports = { getUPKPQuestions, getUKOMQuestions, examData };\n';
fs.writeFileSync('temp_data.js', dataJsContent);

const { examData } = require('./temp_data.js');

function generateCSV() {
    let csv = "Jenis Ujian,Kategori,Pertanyaan,Opsi A,Opsi B,Opsi C,Opsi D,Opsi E,Kunci Jawaban (A/B/C/D/E),Pembahasan\n";
    
    function escapeCSV(str) {
        if (!str) return "";
        let s = str.toString().replace(/"/g, '""');
        if (s.includes(",") || s.includes('"') || s.includes('\n')) {
            s = `"${s}"`;
        }
        return s;
    }

    const mapAns = ["A","B","C","D","E"];

    const upkpQuestions = examData.upkp.packages[0].questions;
    const ukomQuestions = examData.ukompjl.packages[0].questions;

    // Output UPKP
    for (let q of upkpQuestions) {
        const o = q.options;
        csv += `UPKP,${escapeCSV(q.category)},${escapeCSV(q.text)},${escapeCSV(o[0])},${escapeCSV(o[1])},${escapeCSV(o[2]||'')},${escapeCSV(o[3]||'')},${escapeCSV(o[4]||'')},${mapAns[q.correctAnswer]},${escapeCSV(q.explanation)}\n`;
    }

    // Output UKOM
    for (let q of ukomQuestions) {
        const o = q.options;
        csv += `UKOM PJL,${escapeCSV(q.category)},${escapeCSV(q.text)},${escapeCSV(o[0])},${escapeCSV(o[1])},${escapeCSV(o[2]||'')},${escapeCSV(o[3]||'')},${escapeCSV(o[4]||'')},${mapAns[q.correctAnswer]},${escapeCSV(q.explanation)}\n`;
    }

    fs.writeFileSync('d:/2. Badan Pusat Statistik/1. Badan Pusat Statistik Kab. Toraja Utara/11. UJIAN PI DAN UKOM/Aplikasi Simulasi Ujian/Bank_Soal_Latihan_Full.csv', csv);
    console.log("CSV generated with " + (upkpQuestions.length + ukomQuestions.length) + " rows.");
}

generateCSV();
