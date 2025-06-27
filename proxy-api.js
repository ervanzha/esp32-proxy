const express = require('express');
const axios = require('axios');
const app = express();

// ✅ Route utama
app.get('/', (req, res) => {
  res.send(`
    <h1>ESP32-CAM Stream</h1>
    <img src="/video" style="width:640px; border:2px solid #333;" />
  `);
});

// ✅ MJPEG stream publik untuk test
const ESP32_URL = 'http://91.191.213.122:8080/mjpg/video.mjpg'; // MJPEG online

// ✅ Route stream
app.get('/video', async (req, res) => {
  res.setHeader('Content-Type', 'multipart/x-mixed-replace; boundary=frame');

  try {
    console.log('Opening MJPEG stream...');

    const stream = await axios({
      method: 'get',
      url: ESP32_URL,
      responseType: 'stream',
      timeout: 10000,
      headers: {
        'User-Agent': 'Mozilla/5.0'
      }
    });

    console.log('Streaming MJPEG to client...');
    req.on('close', () => {
      stream.data.destroy();
      console.log('Client disconnected');
    });

    stream.data.pipe(res);
  } catch (err) {
    console.error('Streaming error:', err.message);
    res.status(500).send('Stream error');
  }
});

const PORT = process.env.PORT || 8080;
app.listen(PORT, () => {
  console.log(`Proxy running on port ${PORT}`);
});
