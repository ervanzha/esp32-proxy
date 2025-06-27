const express = require('express');
const axios = require('axios');

const app = express();

// ✅ Halaman Utama
app.get('/', (req, res) => {
  res.send(`
    <!DOCTYPE html>
    <html>
      <head>
        <title>ESP32-CAM Stream</title>
      </head>
      <body style="background-color: #121212; color: white; text-align: center;">
        <h1>Live Stream dari ESP32-CAM</h1>
        <img src="/video" style="width:640px; border:2px solid #444;" />
      </body>
    </html>
  `);
});

// ✅ URL Stream MJPEG (ganti ini ke ESP32 saat sudah pakai VPS/ngrok)
const ESP32_URL = 'http://195.144.13.42/mjpg/video.mjpg';

app.get('/video', async (req, res) => {
  try {
    const stream = await axios({
      method: 'get',
      url: ESP32_URL,
      responseType: 'stream'
    });

    res.setHeader('Content-Type', 'multipart/x-mixed-replace; boundary=frame');
    stream.data.pipe(res);

    req.on('close', () => {
      stream.data.destroy();
    });

  } catch (err) {
    console.error('Streaming error:', err.message);
    res.status(500).send('Stream error');
  }
});

const PORT = process.env.PORT || 8080;
app.listen(PORT, () => {
  console.log(`Proxy running on port ${PORT}`);
});
