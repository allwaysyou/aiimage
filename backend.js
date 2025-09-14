const express = require('express');
const cors = require('cors');
const bodyParser = require('body-parser');
const multer = require('multer');
const path = require('path');
const mongoose = require('mongoose');

const app = express();
const PORT = 5000;

// MongoDB Atlas connection string (replace with your actual URI)
const MONGODB_URI = 'mongodb+srv://sadilkhan653_db_user:Sadilkhan1234@@cluster0.dd0huok.mongodb.net/?retryWrites=true&w=majority&appName=Cluster0';

// Connect to MongoDB Atlas
mongoose.connect(MONGODB_URI, {
  useNewUrlParser: true,
  useUnifiedTopology: true
}).then(() => console.log('MongoDB connected'))
  .catch(err => console.error('MongoDB connection error:', err));

app.use(cors());
app.use(bodyParser.json());
app.use('/uploads', express.static(path.join(__dirname, 'uploads')));

// Multer storage setup for image uploads
const storage = multer.diskStorage({
  destination: function(req, file, cb) {
    cb(null, './uploads/');
  },
  filename: function(req, file, cb) {
    cb(null, Date.now() + '-' + file.originalname);
  }
});
const upload = multer({ storage: storage });

// Define Mongoose schema and model for Card
const cardSchema = new mongoose.Schema({
  buttonName: { type: String, required: true },
  promptText: { type: String, required: true },
  thumbnailUrl: { type: String, required: true }
});
const Card = mongoose.model('Card', cardSchema);

// POST endpoint to add a new card with image upload
app.post('/api/cards', upload.single('image'), async (req, res) => {
  const { buttonName, promptText } = req.body;
  let thumbnailUrl = req.body.thumbnailUrl;

  if (req.file) {
    thumbnailUrl = `/uploads/${req.file.filename}`;
  }

  if (!buttonName || !promptText || !thumbnailUrl) {
    return res.status(400).json({ error: 'Sabhi fields chahiye' });
  }

  try {
    const newCard = new Card({ buttonName, promptText, thumbnailUrl });
    await newCard.save();
    res.json({ message: 'Card successfully added!' });
  } catch (err) {
    console.error('Error adding card:', err);
    res.status(500).json({ error: 'Server error' });
  }
});

// GET endpoint to fetch all cards
app.get('/api/cards', async (req, res) => {
  try {
    const cards = await Card.find({});
    res.json(cards);
  } catch (err) {
    console.error('Error fetching cards:', err);
    res.status(500).json({ error: 'Server error' });
  }
});

// DELETE endpoint to delete a card by MongoDB ID
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

app.listen(PORT, () => console.log(`Server running at http://localhost:${PORT}`));
