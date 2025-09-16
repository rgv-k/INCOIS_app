// 1. IMPORT DEPENDENCIES
require('dotenv').config();
const express = require('express');
const mongoose = require('mongoose');
const cors = require('cors');
const bcrypt = require('bcryptjs');
const jwt = require('jsonwebtoken');

// 2. INITIALIZE EXPRESS APP
const app = express();
const PORT = 3000;
const JWT_SECRET = 'your-super-secret-key-that-should-be-in-an-env-file'; // Use a strong, random secret

// 3. MIDDLEWARE
app.use(cors()); // Allows your frontend at a different origin to make requests
app.use(express.json()); // Parses incoming JSON request bodies
const twilio = require('twilio');

// Initialize Twilio Client
const accountSid = process.env.TWILIO_ACCOUNT_SID;
const authToken = process.env.TWILIO_AUTH_TOKEN;
const twilioClient = twilio(accountSid, authToken);

// --- AUTHENTICATION MIDDLEWARE ---
// This function checks if a user is logged in before allowing access to a route
const protect = (req, res, next) => {
    const authHeader = req.headers.authorization;
    if (authHeader && authHeader.startsWith('Bearer ')) {
        try {
            const token = authHeader.split(' ')[1];
            const decoded = jwt.verify(token, process.env.JWT_SECRET || 'your-super-secret-key-that-should-be-in-an-env-file');
            req.user = decoded; // Attach user info (e.g., userId) to the request
            next();
        } catch (error) {
            res.status(401).json({ message: 'Not authorized, token failed' });
        }
    } else {
        res.status(401).json({ message: 'Not authorized, no token' });
    }
};


// 4. CONNECT TO MONGODB
const mongoURI = 'mongodb://localhost:27017/ocean_hazard_db'; // Replace with your actual MongoDB connection string
mongoose.connect(mongoURI)
  .then(() => console.log('MongoDB connected successfully! 🎉'))
  .catch(err => console.error('MongoDB connection error:', err));

// 5. DEFINE MONGOOSE SCHEMAS AND MODELS

const User = require('./models/user.model');
const Report = require('./models/report.model');

const { clusterReports } = require('./utils/hotspotUtils.js');
// 6. DEFINE API ROUTES

// --- User Authentication Routes ---

// POST /api/users/register
app.post('/api/users/register', async (req, res) => {
  try {
    const { name, email, password } = req.body;
    const hashedPassword = await bcrypt.hash(password, 10);
    const newUser = new User({ name, email, password: hashedPassword });
    await newUser.save();
    res.status(201).json({ message: 'User registered successfully!' });
  } catch (error) {
    res.status(500).json({ message: 'Error registering user', error: error.message });
  }
});

// POST /api/users/login
app.post('/api/users/login', async (req, res) => {
  try {
    const { email, password } = req.body;
    const user = await User.findOne({ email });
    if (!user) {
      return res.status(400).json({ message: 'Invalid credentials' });
    }
    const isMatch = await bcrypt.compare(password, user.password);
    if (!isMatch) {
      return res.status(400).json({ message: 'Invalid credentials' });
    }
    const token = jwt.sign({ userId: user._id }, JWT_SECRET, { expiresIn: '1h' });
    res.json({ message: 'Login successful!', token, user: { name: user.name, email: user.email } });
  } catch (error) {
    res.status(500).json({ message: 'Error logging in', error: error.message });
  }
});


// --- Hazard Report Routes ---

// GET /api/reports (Fetch all reports)
app.get('/api/reports', async (req, res) => {
    try {
        const reports = await Report.find().sort({ reportedAt: -1 }); // Get newest reports first
        res.json(reports);
    } catch (error) {
        res.status(500).json({ message: 'Error fetching reports', error: error.message });
    }
});

// POST /api/reports (Submit a new report)
app.post('/api/reports', async (req, res) => {
    try {
        const { title, hazardType, description, latitude, longitude } = req.body;
        
        const newReport = new Report({
            title,
            hazardType,
            description,
            location: {
                type: 'Point',
                coordinates: [longitude, latitude] // GeoJSON format is [longitude, latitude]
            }
        });
        
        await newReport.save();
        res.status(201).json({ message: 'Report submitted successfully!', report: newReport });

    } catch (error) {
        res.status(500).json({ message: 'Error submitting report', error: error.message });
    }
});

// GET /api/hotspots (Generate and return hotspots)
app.get('/api/hotspots', async (req, res) => {
    try {
        const allReports = await Report.find({});
        
        // This now calls the imported function
        const hotspots = clusterReports(allReports);

        res.json({ hotspots: hotspots });

    } catch (error) {
        res.status(500).json({ message: 'Error generating hotspots', error: error.message });
    }
});

// --- NEW SOS ROUTE ---
app.post('/api/sos', protect, async (req, res) => {
    try {
        // Find the user to get their name/email for the message
        const user = await User.findById(req.user.userId).select('-password');
        if (!user) {
            return res.status(404).json({ message: 'User not found' });
        }

        const messageBody = `SOS ALERT! User ${user.name} (${user.email}) has triggered an emergency request. Immediate assistance may be required.`;

        // Send the SMS using Twilio
        await twilioClient.messages.create({
            body: messageBody,
            from: process.env.TWILIO_PHONE_NUMBER,
            to: process.env.EMERGENCY_PHONE_NUMBER
        });

        res.json({ message: 'SOS message sent successfully!' });

    } catch (error) {
        console.error('Error sending SOS:', error);
        res.status(500).json({ message: 'Failed to send SOS message' });
    }
});


// 7. START THE SERVER
app.listen(PORT, () => {
  console.log(`Server is running on http://localhost:${PORT}`);
});

