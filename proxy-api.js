const express = require('express');
const request = require('request');
const app = express();

// ✅ Gunakan webcam publik (St-Malo) sebagai dummy stream
const ESP32_URL = 'http://webcam.st-malo.com/axis-cgi/mjpg/video.cgi';

app.get('/', (req, res) => {
  res.send(`
    <h1>ESP32-CAM Stream (Testing)</h1>
    <img src="/video" style="width: 640px; border: 2px solid #000;" />
  `);
});

app.get('/video', (req, res) => {
  console.log('Opening MJPEG stream...');
  res.setHeader('Content-Type', 'multipart/x-mixed-replace; boundary=frame');

  const stream = request.get(ESP32_URL);

  stream.on('error', err => {
    console.log('Streaming error:', err.message);
    res.status(500).send('Stream error');
  });

  req.on('close', () => stream.destroy());

  console.log('Streaming MJPEG to client...');
  stream.pipe(res);
});

const PORT = process.env.PORT || 8080;
app.listen(PORT, () => {
  console.log(`Proxy running on port ${PORT}`);
});
