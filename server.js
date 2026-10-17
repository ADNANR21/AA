const express = require('express');
const bodyParser = require('body-parser');
const cors = require('cors');
const fs = require('fs');
const path = require('path');

const app = express();
app.use(cors());
app.use(bodyParser.json());

const FILE_PATH = path.join(__dirname, 'database.json');

// 🌟 إرجاع الأسماء الحقيقية لعائلتك الكريمة
const initialFamilyData = [
    { id: 1, name: "منيع بن سعود", pid: null },
    { id: 2, name: "مزيد", pid: 1 },
    { id: 3, name: "علي", pid: 2 },
    { id: 4, name: "سعود", pid: 2 },
    { id: 5, name: "سعد", pid: 2 }
];

function readDataFromFile() {
    try {
        if (!fs.existsSync(FILE_PATH)) {
            fs.writeFileSync(FILE_PATH, JSON.stringify(initialFamilyData, null, 2), 'utf8');
            return initialFamilyData;
        }
        const fileContent = fs.readFileSync(FILE_PATH, 'utf8');
        return JSON.parse(fileContent);
    } catch (error) {
        return initialFamilyData;
    }
}

function writeDataToFile(data) {
    try {
        fs.writeFileSync(FILE_PATH, JSON.stringify(data, null, 2), 'utf8');
    } catch (error) {
        console.error("خطأ في الحفظ:", error);
    }
}

app.get('/', (req, res) => {
    res.sendFile(path.join(__dirname, 'index.html'));
});

app.get('/api/tree', (req, res) => { res.json(readDataFromFile()); });

app.post('/api/tree', (req, res) => {
    const { name, pid } = req.body;
    if (!name || pid === undefined || pid === null) return res.status(400).json({ error: "بيانات ناقصة" });
    
    let familyData = readDataFromFile();
    const maxId = familyData.reduce((max, item) => item.id > max ? item.id : max, 0);
    const newId = maxId + 1;
    
    familyData.push({ id: newId, pid: Number(pid), name: name.trim() });
    writeDataToFile(familyData);
    res.json({ success: true, data: familyData });
});

const PORT = process.env.PORT || 3000;
app.listen(PORT, () => { console.log(`🚀 السيرفر يعمل على http://localhost:${PORT}`); });