const express = require('express');
const http = require('http');
const request = require('request');
const path = require('path');
const fs = require('fs');

const app = express();

const ESP32_URL = 'http://192.168.127.26:81/stream'; // Ganti sesuai IP ESP32

// Serve HTML dari root
app.get('/', (req, res) => {
  const html = `
    <!DOCTYPE html>
    <html>
    <head><title>ESP32-CAM Streaming</title></head>
    <body>
      <h1>Live Stream dari ESP32-CAM</h1>
      <img src="/video" style="border:2px solid #000; width:640px;" />
    </body>
    </html>
  `;
  res.send(html);
});

// Proxy stream dari ESP32-CAM
app.get('/video', (req, res) => {
  res.setHeader('Content-Type', 'multipart/x-mixed-replace; boundary=frame');

  const stream = request.get(ESP32_URL);

  stream.on('error', (err) => {
    console.log('Stream error:', err.message);
    res.status(500).send('Stream error');
  });

  req.on('close', () => {
    stream.destroy();
  });

  stream.pipe(res);
});

const PORT = 3000;
http.createServer(app).listen(PORT, () => {
  console.log(`✅ Server running at http://localhost:${PORT}`);
});
