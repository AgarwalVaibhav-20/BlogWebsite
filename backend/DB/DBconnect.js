import mongoose from 'mongoose';

async function DBConnect(url) {
    try {
        await mongoose.connect(url, {
            useNewUrlParser: true,
            useUnifiedTopology: true,
        });
        console.log("MongoDB is Connected");
    } catch (error) {
        console.error("MongoDB Connection Error:", error);
    }
}

export default DBConnect;
