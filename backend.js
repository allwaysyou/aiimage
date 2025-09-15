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

// Cloudinary configuration
cloudinary.config({
  cloud_name: 'dx3xysm2h',                // Aapka Cloudinary cloud name
  api_key: '966345846726722',              // Aapka API Key
  api_secret: 'UBH0aNXgotN3wuj25WRlPWFD-1g'            // Yahan apna API Secret dalen (secure rakhen)
});

// Multer storage setup using Cloudinary
const storage = new CloudinaryStorage({
  cloudinary: cloudinary,
  params: {
    folder: 'uploads',                   // Cloudinary me folder jahan images jayengi
    allowed_formats: ['jpg', 'jpeg', 'png'],
    transformation: [{ quality: 'auto' }]
  }
});

const upload = multer({ storage });

// Parse JSON body requests
app.use(cors());
app.use(bodyParser.json());
// Express static not needed for uploads now, kyunki images Cloudinary pe hain
// app.use('/uploads', express.static(path.join(__dirname, 'uploads')));

// Mongoose schema and model
const cardSchema = new mongoose.Schema({
  buttonName: { type: String, required: true },
  promptText: { type: String, required: true },
  thumbnailUrl: { type: String, required: true }
});
const Card = mongoose.model('Card', cardSchema);

// POST endpoint to add card with Cloudinary image upload
app.post('/api/cards', upload.single('image'), async (req, res) => {
  const { buttonName, promptText } = req.body;
  let thumbnailUrl = req.body.thumbnailUrl;

  // Agar image upload hui hai to Cloudinary URL use karo
  if (req.file && req.file.path) {
    thumbnailUrl = req.file.path; // Cloudinary image URL
  }

  if (!buttonName || !promptText || !thumbnailUrl) {
    return res.status(400).json({ error: 'Sabhi fields chahiye' });
  }

  try {
    const newCard = new Card({ buttonName, promptText, thumbnailUrl });
    await newCard.save();
    console.log('New card saved:', newCard);
    res.json({ message: 'Card successfully added!' });
  } catch (err) {
    console.error('Error adding card:', err);
    res.status(500).json({ error: 'Server error' });
  }
});

// GET endpoint to fetch cards
app.get('/api/cards', async (req, res) => {
  try {
    const cards = await Card.find({});
    res.json(cards);
  } catch (err) {
    console.error('Error fetching cards:', err);
    res.status(500).json({ error: 'Server error' });
  }
});

// DELETE endpoint to delete card by ID
app.delete('/api/cards/:id', async (req, res) => {
  const id = req.params.id;
  try {
    const deletedCard = await Card.findByIdAndDelete(id);
    if (!deletedCard) {
      return res.status(404).json({ error: 'Card not found!' });
    }
    res.json({ message: 'Card deleted!' });
  } catch (err) {
    console.error('Error deleting card:', err);
    res.status(500).json({ error: 'Server error' });
  }
});

// Start server
app.listen(PORT, () => {
  console.log(`Server running at http://localhost:${PORT}`);
});
