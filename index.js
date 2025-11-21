const express = require('express');
const cors = require('cors');
const dotenv = require('dotenv');
const { GoogleGenerativeAI } = require('@google/generative-ai');

dotenv.config();

const app = express();
const port = process.env.PORT || 3000;

//middleware
app.use(cors());
app.use(express.json());
app.use(express.static('public'));

//Gemini Setup
const genAI = new GoogleGenerativeAI(process.env.GEMINI_API_KEY);
const model = genAI.getGenerativeModel({ model: "gemini-1.5-flash" });
app.post('/api/chat', async (req, res) => {
    const userMessage = req.body.message;

    if(!userMessage){
        return res.status(400).json({error: 'Pesan Belum Diisi' });
    }

    try {
        const result = await model.generateContent(userMessage);
        const response = await result.response;
        const text = response.text();
        res.json({reply: text});

    } catch (error) {
        console.error('Error:', error);
        res.status(500).json({error: 'Terjadi Kesalahan Sistem'});
    }
});
app.listen(port, () => {
  console.log(`Server berjalan pada port ${port}`);
});




//)