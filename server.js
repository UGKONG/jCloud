// Web Server
const express = require('express');
const app = express();
const ip = require('ip');
const multer = require('multer');
const upload = multer({dest: './build/files'});
const buildPath = __dirname + '/build';
const webPort = 80;
// const upload = multer({storage: storage});

app.use(express.static(buildPath));
app.use(express.static(__dirname + './build/files'));

app.get('/', (req, res) => res.sendFile('index.html'));
app.get('*', (req, res) => res.send('404'));

app.post('/upload', upload.single('uploadFile'), (req, res) => {
  console.log(req.file);
  console.log(req.body.uploadFileName);
  res.send(req.file.filename);
});


app.listen(webPort, () => {
  console.log('Node Server Init .. Ok');
  console.log('Node Server Check Server .. Ok');
  console.log('Server Starting...');
  console.log('Node Server Start!!');
  console.log('============ Web Server Start ============');
  console.log(`외부 IP : 211.58.31.31:${webPort}`);
  console.log(`내부 IP : ${ip.address()}:${webPort}`);
});