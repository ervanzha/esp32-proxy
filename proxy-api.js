const express = require('express');
const http = require('http');
const request = require('request');
const path = require('path');

const app = express();

// ✅ Tambahkan ini
app.get('/', (req, res) => {
  res.send(`
    <!DOCTYPE html>
    <html>
      <head>
        <title>ESP32-CAM Stream</title>
      </head>
      <body>
        <h1>Live Stream dari ESP32-CAM</h1>
        <img src="/video" style="width:640px; border:2px solid #333;" />
      </body>
    </html>
  `);
});

// 🔁 Streaming dari ESP32-CAM
const ESP32_URL = 'http://192.168.127.26:81/stream';

app.get('/video', (req, res) => {
  res.setHeader('Content-Type', 'multipart/x-mixed-replace; boundary=frame');

  const stream = request.get(ESP32_URL);

  stream.on('error', (err) => {
    console.log('Error streaming from ESP32:', err.message);
    res.status(500).send('Stream error');
  });

  req.on('close', () => {
    stream.destroy();
  });

  stream.pipe(res);
});

const PORT = process.env.PORT || 3000;
app.listen(PORT, () => {
  console.log(`Proxy running on port ${PORT}`);
});

