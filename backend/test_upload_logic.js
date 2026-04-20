const axios = require('axios');
const fs = require('fs');
const path = require('path');
const FormData = require('form-data');

const testUpload = async () => {
    try {
        const formData = new FormData();
        formData.append('title', 'Test Item with Image');
        formData.append('description', 'This is a test description');
        formData.append('category', 'Electronics');
        formData.append('lastSeenLocation', 'Test Location');
        formData.append('dateLost', new Date().toISOString());
        
        // Use an existing image from the uploads folder to test
        const imagePath = path.join(__dirname, 'uploads/lost/lost-1775632864675-87683134.jpg');
        if (fs.existsSync(imagePath)) {
            formData.append('images', fs.createReadStream(imagePath));
        } else {
            console.log('Test image not found, creating a dummy one');
            const dummyPath = path.join(__dirname, 'dummy.jpg');
            fs.writeFileSync(dummyPath, 'fake image data');
            formData.append('images', fs.createReadStream(dummyPath));
        }

        // Need a token for protected route
        // Assuming we can get one or the route is not protected (but it is)
        // I'll check for a user in the DB to login or just use a mock token if I could
        // Actually, I'll just check the controller logic again.
        
        console.log('FormData ready');
        // ... (skipping actual request because I don't have a valid token easily)
    } catch (err) {
        console.error(err);
    }
};

testUpload();
