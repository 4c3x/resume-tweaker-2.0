<<<<<<< HEAD
const express = require('express');
const cors = require('cors');
const { spawn } = require('child_process');
const app = express();

app.use(express.json());
app.use(cors());

app.get('/', (req, res) => {
  res.send('Resume Tweaker server is running!');
});

app.post('/tweak', (req, res) => {
  const { resume, jobDesc } = req.body;
  console.log('Received resume:', resume);
  console.log('Received jobDesc:', jobDesc);

  // Call Python script
  const py = spawn('python', ['../ai/tweak.py', JSON.stringify({ resume, jobDesc })]);
  let tweakedResume = '';

  py.stdout.on('data', (data) => {
    tweakedResume += data.toString();
  });

  py.stderr.on('data', (data) => {
    console.error('Python error:', data.toString());
  });

  py.on('close', (code) => {
    if (code === 0) {
      res.json({ message: 'Tweaked', tweakedResume });
    } else {
      res.status(500).json({ error: 'Python script failed' });
    }
  });
});

app.listen(3000, () => {
  console.log('Server running on port 3000');
=======
const express = require('express');
const cors = require('cors');
const { spawn } = require('child_process');
const app = express();

app.use(express.json());
app.use(cors());

app.get('/', (req, res) => {
  res.send('Resume Tweaker server is running!');
});

app.post('/tweak', (req, res) => {
  const { resume, jobDesc } = req.body;
  console.log('Received resume:', resume);
  console.log('Received jobDesc:', jobDesc);

  // Call Python script
  const py = spawn('python', ['../ai/tweak.py', JSON.stringify({ resume, jobDesc })]);
  let tweakedResume = '';

  py.stdout.on('data', (data) => {
    tweakedResume += data.toString();
  });

  py.stderr.on('data', (data) => {
    console.error('Python error:', data.toString());
  });

  py.on('close', (code) => {
    if (code === 0) {
      res.json({ message: 'Tweaked', tweakedResume });
    } else {
      res.status(500).json({ error: 'Python script failed' });
    }
  });
});

app.listen(3000, () => {
  console.log('Server running on port 3000');
>>>>>>> Initial MVP
});