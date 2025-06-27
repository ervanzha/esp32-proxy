const express = require('express');
const request = require('request');
const app = express();

// ✅ Route utama
app.get('/', (req, res) => {
  res.send(`
    <h1>ESP32-CAM Stream</h1>
    <img src="/video" />
  `);
});

// ✅ Route stream
const ESP32_URL = 'http://195.144.13.42/mjpg/video.mjpg'; // atau link testing MJPEG

app.get('/video', (req, res) => {
  res.setHeader('Content-Type', 'multipart/x-mixed-replace; boundary=frame');
  const stream = request.get(ESP32_URL);
  stream.on('error', err => {
    console.log('Streaming error:', err.message);
    res.status(500).send('Stream error');
  });
  req.on('close', () => stream.destroy());
  stream.pipe(res);
});

const PORT = process.env.PORT || 8080;
app.listen(PORT, () => {
  console.log(`Proxy running on port ${PORT}`);
});
