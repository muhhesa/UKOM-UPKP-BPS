const fs = require('fs');
const content = fs.readFileSync('Bank_Soal_Latihan_Full.csv', 'utf8');
const lines = content.split('\n').filter(l => l.trim() !== '');

console.log('Total Lines (including header):', lines.length);

const questions = new Set();
let dupes = 0;

for (let i = 1; i < lines.length; i++) {
    // Basic CSV split, ignores quoted commas for simplicity but enough to extract the question which is the 3rd column
    const cols = lines[i].split(',');
    if (cols.length >= 3) {
        let q = cols[2];
        if (q.startsWith('"')) {
           const match = lines[i].match(/^(?:.*?,){2}"([^"]+)"/);
           if (match) q = match[1];
        }
        
        if (questions.has(q)) {
            console.log('Duplicate found line ' + (i+1) + ': ' + q);
            dupes++;
        }
        questions.add(q);
    }
}

console.log('Duplicate Questions Found:', dupes);
