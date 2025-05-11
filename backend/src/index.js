import express from 'express';
import bodyParser from 'body-parser';
import { fileTypeFromBuffer } from 'file-type'; // updated method for ESM
import cors from 'cors';

const app = express();
const PORT = process.env.PORT || 5000;
// const cors = require('cors');mport cors from 'cors';
// app.use(cors());
const corsOptions = {
    origin: 'https://project-2-frontend-9686.vercel.app', 
    methods: 'GET,POST',
    allowedHeaders: 'Content-Type',
};


app.use(bodyParser.json({ limit: '10mb' }));

const USER_ID = "john_doe_17091999";
const EMAIL = "john@xyz.com";
const ROLL_NUMBER = "ABCD123";

function isPrime(n) {
  n = parseInt(n);
  if (n <= 1) return false;
  for (let i = 2; i <= Math.sqrt(n); i++) {
    if (n % i === 0) return false;
  }
  return true;
}

function extractBase64Data(base64String) {
  const match = base64String.match(/^data:(.*);base64,(.*)$/);
  if (match) {
    return Buffer.from(match[2], 'base64');
  }
  return Buffer.from(base64String, 'base64');
}

app.get('/bfhl', (req, res) => {
  res.status(200).json({ operation_code: 1 });
});

app.post('/bfhl', async (req, res) => {
  try {
    const { data = [], file_b64 } = req.body;

    const numbers = data.filter(el => !isNaN(el));
    const alphabets = data.filter(el => /^[A-Za-z]$/.test(el));
    const lowercaseAlphabets = alphabets.filter(c => c === c.toLowerCase());
    const highestLower = lowercaseAlphabets.length
      ? [lowercaseAlphabets.sort().slice(-1)[0]]
      : [];

    const isPrimeFound = numbers.some(n => isPrime(n));

    let file_valid = false;
    let file_mime_type = null;
    let file_size_kb = null;

    if (file_b64) {
      try {
        const buffer = extractBase64Data(file_b64);
        const type = await fileTypeFromBuffer(buffer);
        if (type) {
          file_valid = true;
          file_mime_type = type.mime;
          file_size_kb = Math.round(buffer.length / 1024);
        }
      } catch (err) {
        file_valid = false;
      }
    }

    const response = {
      is_success: true,
      user_id: USER_ID,
      email: EMAIL,
      roll_number: ROLL_NUMBER,
      numbers,
      alphabets,
      highest_lowercase_alphabet: highestLower,
      is_prime_found: isPrimeFound,
      file_valid,
      file_mime_type,
      file_size_kb,
    };

    res.json(response);
  } catch (err) {
    res.status(500).json({ is_success: false, error: err.message });
  }
});

app.listen(PORT, () => {
  console.log(`Server running on port ${PORT}`);
});
