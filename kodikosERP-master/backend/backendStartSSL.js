// npm run start:serverHP
// npm run start:serverMIR

const port = process.argv[2];
const dbName = process.argv[3];
const redisPort = process.argv[4];
module.exports.dbName = dbName;
// console.log(portNumber, dbName);
// const portsFirms = require('./portsFirms');
// console.log(portsFirms);
// const firm = portsFirms.filter(d => d.active === true);

// console.log('firm', firm);
// console.log(firm[0].backendPort);

try {
  process.argv[2].split(); //do obsługi błędu braku parametru
  console.log('Backend port:', port);
  console.log('Project:', dbName);
} catch (error) {
  console.error();
  console.error('ERROR');
  console.error(
    `No port or project name specified. \n Please use: \n node backendStart <portNumber> <projectName>`
  );
  console.error();
  return process.exit(2);
}

// uruchamianie npm run start:server
const debug = require('debug')('node-angular');
const https = require('https');
const app = require('./app');
const fs = require('fs');
const path = require('path');

const onError = error => {
  if (error.syscall !== 'listen') {
    throw error;
  }

  const bind = typeof addr === 'string' ? 'pipe ' + addr : 'port ' + port;
  switch (error.code) {
    case 'EACCES':
      console.error(bind + ' requires elevated privileges');
      process.exit(1);
      break;
    case 'EADDRINUSE':
      console.error(bind + ' is already in use');
      process.exit(1);
      break;
    default:
      throw error;
  }
};

const onListening = () => {
  const addr = server.address();
  const bind = typeof addr === 'string' ? 'pipe ' + addr : 'port ' + port;
  const aktData2 = new Date().toLocaleDateString('pl-PL', {
    timeZone: 'Europe/Warsaw'
  });
  // const aktData3 = new Date().toLocaleDateString('pl-PL', {timeZone: Intl.DateTimeFormat().resolvedOptions().timeZone});
  const aktData = new Date();
  const dataString = `${aktData.getDate()}.${aktData.getMonth() +
    1}.${aktData.getFullYear()} ${aktData.getHours()}:${aktData.getMinutes()}`;
  const aktDataOffset = aktData.getTimezoneOffset();
  // console.log(aktData);
  // console.log(aktData2);
  // console.log(aktDataOffset);
  console.log(dataString);
  debug('Listening on ' + bind);
};

const httpsOptions = {
  cert: fs.readFileSync(path.join(__dirname, 'ssl', 'domain_cert.key.pem')),
  key: fs.readFileSync(path.join(__dirname, 'ssl', 'my-server.key.pem'))
};

// const port = process.env.PORT || 5501;
// HPStal
// const port = portNumber;

// this is method of creating the vanilla node.js server
// const server = http.createServer((req, res) => {
//   res.end('This is my end response');
// });

// this is method of creating express serever
// I am setting the port
app.set('port', port);
// console.log('ddd', dbName);
const server = https.createServer(httpsOptions, app);
server.on('error', onError);
server.on('listening', onListening);

server.listen(port);
