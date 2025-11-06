// functions/index.js

const functions = require('firebase-functions');
const admin = require('firebase-admin');
const cors = require('cors')({ origin: true }); 

// Initialize Firebase Admin SDK to access Firestore
admin.initializeApp();
const db = admin.firestore();

// ------------------------------------------------------------------
// CONTACT FORM FUNCTION (Saves to 'contacts' collection)
// ------------------------------------------------------------------
exports.submitContact = functions.https.onRequest((request, response) => {
    cors(request, response, async () => {
        if (request.method !== 'POST') {
            return response.status(405).send({ message: 'Method Not Allowed' });
        }

        const data = request.body;
        const timestamp = admin.firestore.FieldValue.serverTimestamp();

        try {
            await db.collection('contacts').add({
                name: data.name,
                email: data.email,
                message: data.message,
                timestamp: timestamp
            });

            // Success response
            return response.status(200).json({ message: 'Message sent successfully! We will get back to you soon.' });
        } catch (error) {
            console.error("Error saving contact message: ", error);
            // Failure response (This is what triggers your current alert)
            return response.status(500).json({ message: 'Error: Failed to save message' });
        }
    });
});

// ------------------------------------------------------------------
// NEWSLETTER FUNCTION (Saves to 'subscribers' collection)
// ------------------------------------------------------------------
exports.subscribeNewsletter = functions.https.onRequest((request, response) => {
    cors(request, response, async () => {
        if (request.method !== 'POST') {
            return response.status(405).send({ message: 'Method Not Allowed' });
        }

        const data = request.body;
        const timestamp = admin.firestore.FieldValue.serverTimestamp();

        try {
            await db.collection('subscribers').add({
                email: data.email,
                timestamp: timestamp
            });

            // Success response
            return response.status(200).json({ message: 'Subscription successful! Welcome aboard.' });
        } catch (error) {
            console.error("Error saving subscriber: ", error);
            // Failure response
            return response.status(500).json({ message: 'Error: Failed to subscribe' });
        }
    });
});