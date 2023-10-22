require('dotenv').config(); // Load environment variables from .env file
const axios = require('axios');
const fs = require('fs');
const path = require('path');  // Add this line to import the path module

const openaiApiKey = process.env.OPENAI_API_KEY;

const prompt = "Create picture of the moment"; 

const data = {
  prompt: prompt,
  n: 1,
  size: "1024x1024"
};

const headers = {
  'Content-Type': 'application/json',
  'Authorization': `Bearer ${openaiApiKey}`
};

axios.post('https://api.openai.com/v1/images/generations', data, { headers })
  .then(response => {
    const imageUrl = response.data.data[0].url;
    const now = new Date();
    const timestamp = now.toISOString().replace(/:/g, '-');  // Replacing ':' with '-' to ensure a valid filename
    const randomNum = Math.floor(Math.random() * 10000);  // Generating a random number
    const fileName = `image_${randomNum}_${timestamp}.png`;  // Creating a filename with random number and timestamp
    const filePath = path.join(__dirname, 'img', fileName);  // Specifying the path to save the image in the '/img' folder

    // Download and save the image to a file
    axios.get(imageUrl, { responseType: 'arraybuffer' })
      .then(imgResponse => {
        const buffer = Buffer.from(imgResponse.data, 'binary');
          fs.writeFile(filePath, buffer, (err) => {  // Updated this line to use filePath
          if (err) {
            console.error(`Error writing image to file: ${err}`);
          } else {
            console.log(`Image from DALL-E saved to ${fileName}`);
          }
        });
      })
      .catch(imgError => {
        console.error(`Error downloading image:\n${imgError.message}`);
      });
  })
  .catch(error => {
    console.error(`Error from OpenAI API:\n${error.message}`);
  });
