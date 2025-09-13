const express = require('express');
const cors = require('cors');
const bodyParser = require('body-parser');
const fs = require('fs');
const multer = require('multer');
const path = require('path');

const app = express();
const PORT = 5000;

app.use(cors());
app.use(bodyParser.json());
app.use('/uploads', express.static(path.join(__dirname, 'uploads')));

const DATA_FILE = './cardsData.json';

function loadCards() {
    try {
        const data = fs.readFileSync(DATA_FILE, 'utf8');
        return JSON.parse(data);
    } catch {
        return [];
    }
}
function saveCards(cards) {
    fs.writeFileSync(DATA_FILE, JSON.stringify(cards, null, 2));
}

// Multer storage setup
const storage = multer.diskStorage({
    destination: function(req, file, cb) {
        cb(null, './uploads/');
    },
    filename: function(req, file, cb) {
        cb(null, Date.now() + '-' + file.originalname);
    }
});
const upload = multer({ storage: storage });

// POST endpoint for image/card upload
app.post('/api/cards', upload.single('image'), (req, res) => {
    const { buttonName, promptText } = req.body;
    let thumbnailUrl = req.body.thumbnailUrl;

    if (req.file) {
        thumbnailUrl = `/uploads/${req.file.filename}`;
    }

    if (!buttonName || !promptText || !thumbnailUrl) {
        return res.status(400).json({ error: 'Sabhi fields chahiye' });
    }

    const cards = loadCards();
    cards.push({ buttonName, promptText, thumbnailUrl });
    saveCards(cards);

    res.json({ message: 'Card successfully added!' });
});

// GET endpoint
app.get('/api/cards', (req, res) => {
    const cards = loadCards();
    res.json(cards);
});

// DELETE endpoint (admin only use, index.html doesn't expose)
app.delete('/api/cards/:idx', (req, res) => {
    const idx = parseInt(req.params.idx);
    let cards = loadCards();

    if (idx >= 0 && idx < cards.length) {
        cards.splice(idx, 1);
        saveCards(cards);
        res.json({ message: 'Card deleted!' });
    } else {
        res.status(404).json({ error: 'Card not found!' });
    }
});

app.listen(PORT, () => console.log('Server running at http://localhost:5000'));
