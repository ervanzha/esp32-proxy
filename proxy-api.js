const express = require('express');
const http = require('http');
const axios = require('axios');
const app = express();

const ESP32_URL = 'http://195.144.13.42/mjpg/video.mjpg'; // public MJPEG stream

// ✅ Route utama
app.get('/', (req, res) => {
  res.send(`
    <h1>ESP32-CAM Stream</h1>
    <p>If no video appears, <a href="/video" target="_blank">click here</a> to open stream directly.</p>
    <img src="/video" alt="ESP32 Stream" style="max-width: 100%; height: auto;" />
  `);
});

// ✅ Stream route via axios
app.get('/video', async (req, res) => {
  console.log('[INFO] Stream request received from', req.ip);

  try {
    const response = await axios({
      method: 'get',
      url: ESP32_URL,
      responseType: 'stream',
    });

    res.setHeader('Content-Type', 'multipart/x-mixed-replace; boundary=frame');

    // Pipe MJPEG stream ke client
    response.data.pipe(res);

    req.on('close', () => {
      console.log('[INFO] Client closed connection');
      response.data.destroy(); // Stop stream
    });

  } catch (error) {
    console.error('[ERROR] MJPEG stream failed:', error.message);
    res.status(500).send(`
      <h2>Streaming Error</h2>
      <p>${error.message}</p>
    `);
  }
});

const PORT = process.env.PORT || 8080;
app.listen(PORT, () => {
  console.log(`[READY] Proxy running on port ${PORT}`);
});
// trigger redeploy
