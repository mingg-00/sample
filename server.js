const express = require('express');
const path = require('path');
const bodyParser = require('body-parser');
const cors = require('cors');
const fetch = require('node-fetch');

const app = express();
const PORT = process.env.PORT || 3001;

app.use(bodyParser.json({ limit: '10mb' }));
app.use(cors());
app.use(express.static(__dirname)); // HTML, JS 등 정적 파일 제공

// 기본 경로에서 HTML 제공
app.get('/', (req, res) => {
  res.sendFile(path.join(__dirname, 'java.html'));
});

// 나이 측정 API
app.post('/detect-age', async (req, res) => {
  try {
    const { imageBase64 } = req.body;
    console.log("서버 요청 도착, 이미지 길이:", imageBase64.length);

    const formData = new URLSearchParams();
    formData.append('api_key', 'HQgLEqAYNg3XwAuQpNsTyURI1IpDIrFF');
    formData.append('api_secret', 'OalyEyxRci--MXV2mjAKM5hLrcKb3GwS');
    formData.append('image_base64', imageBase64.split(',')[1]);
    formData.append('return_attributes', 'age');

    const response = await fetch('https://api-us.faceplusplus.com/facepp/v3/detect', {
      method: 'POST',
      body: formData
    });

    const data = await response.json();
    console.log("Face++ 응답:", data);

    if (data.error_message) {
      console.error("Face++ 오류:", data.error_message);
      return res.status(500).json({ error: data.error_message });
    }

    res.json(data);

  } catch (err) {
    console.error("서버 처리 중 오류:", err);
    res.status(500).json({ error: '서버 처리 중 오류' });
  }
});

// 서버 시작
app.listen(PORT, () => {
  console.log(`Server running on http://localhost:${PORT}`);
});
