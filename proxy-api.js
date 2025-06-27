const express = require('express');
const request = require('request');
const app = express();

const ESP32_URL = 'http://195.144.13.42/mjpg/video.mjpg'; // Public MJPEG stream for testing

// ✅ Log saat server start
console.log('Starting ESP32 Proxy Server...');
console.log('Target MJPEG stream:', ESP32_URL);

// ✅ Route utama (homepage)
app.get('/', (req, res) => {
  res.send(`
    <h1>ESP32-CAM Stream</h1>
    <p>If no video appears, try accessing <a href="/video" target="_blank">/video</a> directly.</p>
    <img src="/video" alt="ESP32 Stream" style="max-width: 100%; height: auto;" />
  `);
});

// ✅ Route stream video
app.get('/video', (req, res) => {
  console.log('[INFO] Incoming stream request from', req.ip);

  res.setHeader('Content-Type', 'multipart/x-mixed-replace; boundary=frame');

  const stream = request.get(ESP32_URL);

  stream.on('error', err => {
    console.error('[ERROR] Failed to stream from ESP32_URL:', err.message);
    res.status(500).send(`
      <h2>Stream Error</h2>
      <p>${err.message}</p>
      <p>Ensure the MJPEG stream is live and accessible.</p>
    `);
  });

  // ✅ Bersihkan koneksi saat user menutup halaman
  req.on('close', () => {
    console.log('[INFO] Client closed the connection');
    stream.destroy();
  });

  stream.pipe(res);
});

// ✅ Jalankan server
const PORT = process.env.PORT || 8080;
app.listen(PORT, () => {
  console.log(`[READY] Proxy server running on port ${PORT}`);
});
