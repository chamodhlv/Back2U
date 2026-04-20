const mongoose = require('mongoose');
const dotenv = require('dotenv');
const LostItem = require('./models/LostItem');

dotenv.config();

const checkData = async () => {
    try {
        await mongoose.connect(process.env.MONGO_URI);
        console.log('Connected to MongoDB');

        const items = await LostItem.find({}).select('title images').limit(10);
        console.log('Items in DB:');
        items.forEach(item => {
            console.log(`Title: ${item.title}`);
            console.log(`Images: ${JSON.stringify(item.images)}`);
        });

        process.exit(0);
    } catch (err) {
        console.error(err);
        process.exit(1);
    }
};

checkData();
