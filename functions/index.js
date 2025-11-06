/**
 * To deploy this function:
 * 1. Install Firebase CLI: npm install -g firebase-tools
 * 2. Initialize functions: firebase init functions
 * 3. Deploy: firebase deploy --only functions
 */
const functions = require('firebase-functions');
const admin = require('firebase-admin');

// Initialize Firebase Admin SDK to interact with Firestore
admin.initializeApp();
const db = admin.firestore();

// ----------------------------------------------------
// 1. Contact Form Submission Endpoint
// ----------------------------------------------------
exports.submitContact = functions.https.onRequest(async (req, res) => {
    // Enable CORS for frontend requests (Crucial for web apps)
    res.set('Access-Control-Allow-Origin', '*');
    if (req.method === 'OPTIONS') {
        // Stop preflight requests here
        res.set('Access-Control-Allow-Methods', 'POST');
        res.set('Access-Control-Allow-Headers', 'Content-Type');
        res.status(204).send('');
        return;
    }

    // Only allow POST requests
    if (req.method !== 'POST') {
        return res.status(405).send({ message: 'Method Not Allowed' });
    }

    const { name, email, message } = req.body;

    // Basic server-side validation
    if (!name || !email || !message) {
        return res.status(400).send({ message: 'Missing required fields: name, email, or message.' });
    }

    const contactData = {
        name: name,
        email: email,
        message: message,
        timestamp: admin.firestore.FieldValue.serverTimestamp() // Firestore timestamp
    };

    try {
        // Save the data to the 'contactMessages' collection
        await db.collection('contactMessages').add(contactData);
        
        // Success response
        return res.status(200).send({ message: 'Contact message saved successfully!' });
    } catch (error) {
        console.error('Error saving contact message:', error);
        return res.status(500).send({ message: 'Failed to save message.', error: error.message });
    }
});

// ----------------------------------------------------
// 2. Newsletter Submission Endpoint
// ----------------------------------------------------
exports.subscribeNewsletter = functions.https.onRequest(async (req, res) => {
    // Enable CORS for frontend requests
    res.set('Access-Control-Allow-Origin', '*');
    if (req.method === 'OPTIONS') {
        res.set('Access-Control-Allow-Methods', 'POST');
        res.set('Access-Control-Allow-Headers', 'Content-Type');
        res.status(204).send('');
        return;
    }

    if (req.method !== 'POST') {
        return res.status(405).send({ message: 'Method Not Allowed' });
    }

    const { email } = req.body;

    if (!email) {
        return res.status(400).send({ message: 'Email is required.' });
    }

    const subscriberData = {
        email: email,
        timestamp: admin.firestore.FieldValue.serverTimestamp()
    };

    try {
        // Save the data to the 'newsletterSubscribers' collection
        await db.collection('newsletterSubscribers').add(subscriberData);
        
        // Success response
        return res.status(200).send({ message: 'Subscription successful!' });
    } catch (error) {
        console.error('Error saving subscription:', error);
        return res.status(500).send({ message: 'Failed to subscribe.', error: error.message });
    }
});