const port = process.argv[2];
const catalogFront = process.argv[3];
// const portsFirms = require('./portsFirms');
// const firm = portsFirms.filter(d => d.active === true);

try {
  process.argv[2].split(); //do obsługi błędu braku parametru
  console.log('Frontend port:', port);
  console.log('Project:', catalogFront);
} catch (error) {
  console.error();
  console.error('ERROR');
  console.error(
    `No port or project name specified. \n Please use: \n node serverDeployStatic <portNumber> <projectName>`
  );
  console.error();
  return process.exit(2);
}

const express = require('express');
const http = require('http');
const path = require('path');

const app = express();

var projectDirectory = path.join(__dirname, 'dist', catalogFront);
console.log('Project directory:', projectDirectory);
app.use(express.static(projectDirectory));
app.get('/*', (req, res) => res.sendFile(path.join(__dirname)));

const server = http.createServer(app);

server.listen(port, () =>
  console.log('Frontend server started on port ' + port + '.')
);
