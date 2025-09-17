const express = require('express');
const cors = require('cors');
const bodyParser = require('body-parser');
const multer = require('multer');
const path = require('path');
const mongoose = require('mongoose');
const { CloudinaryStorage } = require('multer-storage-cloudinary');
const cloudinary = require('cloudinary').v2;
const app = express();
const PORT = 5000;

// MongoDB Atlas connection string
const MONGODB_URI = 'mongodb+srv://topfactsyt07_db_user:Sadilkhan1234@cluster0.edt13hm.mongodb.net/?retryWrites=true&w=majority&appName=Cluster0';

// Connect to MongoDB Atlas
mongoose.connect(MONGODB_URI, {
  useNewUrlParser: true,
  useUnifiedTopology: true
}).then(() => console.log('MongoDB connected'))
  .catch(err => console.error('MongoDB connection error:', err));

// Cloudinary config
cloudinary.config({
  cloud_name: 'dx3xysm2h',
  api_key: '966345846726722',
  api_secret: 'UBH0aNXgotN3wuj25WRlPWFD-1g'
});

const storage = new CloudinaryStorage({
  cloudinary: cloudinary,
  params: {
    folder: 'uploads',
    allowed_formats: ['jpg', 'jpeg', 'png'],
    transformation: [{ quality: 'auto' }]
  }
});
const upload = multer({ storage });

app.use(cors());
app.use(bodyParser.json());

// Mongoose schema and model
const cardSchema = new mongoose.Schema({
  buttonName: { type: String, required: true },
  promptText: { type: String, required: true },
  thumbnailUrl: { type: String, required: true }
});
const Card = mongoose.model('Card', cardSchema);

// POST: Add card
app.post('/api/cards', upload.single('image'), async (req, res) => {
  const { buttonName, promptText } = req.body;
  let thumbnailUrl = req.body.thumbnailUrl;
  if (req.file && req.file.path) {
    thumbnailUrl = req.file.path; // from Cloudinary
  }
  if (!buttonName || !promptText || !thumbnailUrl) {
    return res.status(400).json({ error: 'Sabhi fields chahiye' });
  }
  try {
    const newCard = new Card({ buttonName, promptText, thumbnailUrl });
    await newCard.save();
    res.json({ message: 'Card successfully added!' });
  } catch (err) {
    res.status(500).json({ error: 'Server error' });
  }
});

// GET: List all cards
app.get('/api/cards', async (req, res) => {
  try {
    const cards = await Card.find({});
    res.json(cards);
  } catch (err) {
    res.status(500).json({ error: 'Server error' });
  }
});

// GET: Get card by ID  <-- Yeh missing tha aapke code me, ab add hai
app.get('/api/cards/:id', async (req, res) => {
  try {
    const card = await Card.findById(req.params.id);
    if (!card) return res.status(404).json({ error: 'Card not found!' });
    res.json(card);
  } catch (err) {
    res.status(500).json({ error: 'Server error' });
  }
});

// DELETE: Delete card by ID
app.delete('/api/cards/:id', async (req, res) => {
  try {
    const deletedCard = await Card.findByIdAndDelete(req.params.id);
    if (!deletedCard) return res.status(404).json({ error: 'Card not found!' });
    res.json({ message: 'Card deleted!' });
  } catch (err) {
    res.status(500).json({ error: 'Server error' });
  }
});

// Start Server
app.listen(PORT, () => {
  console.log(`Server running at http://localhost:${PORT}`);
});
