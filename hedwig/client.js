'use strict';
const IDLE_SOCKET_TIMEOUT_MILLISECONDS = 1000 * 30;
let socket 

function createTunnel(options) {
  return new Promise((resolve, reject) => {
    // require the things we need
    const net = require('net');
    const ss = require('socket.io-stream');
    socket = require('socket.io-client')(options['server']);

    socket.on('connect', () => {
      console.log(new Date() + ': connected');
      console.log(new Date() + ': requesting subdomain ' + options['subdomain'] + ' via ' + options['server']);

      socket.emit('createTunnel', options['app'], options['subdomain'], (err) => {
        if (err) {
          console.log(new Date() + ': [error] ' + err);

          reject(err);
        } else {
          console.log(new Date() + ': registered with server successfully');

          // clean and concat requested url
          let url;
          let subdomain = options['subdomain'].toString();
          let server = options['server'].toString();

          if (server.includes('https://')) {
            url = `https://${subdomain}.${server.slice(8)}`;
          } else if (server.includes('http://')) {
            url = `http://${subdomain}.${server.slice(7)}`;
          } else {
            url = `https://${subdomain}.${server}`;
          }

          // resolve promise with requested URL
          resolve({'url':url, 'socket':socket});
        }
      });
    });

    socket.on('incomingClient', (clientId) => {
      let client = net.connect(options['port'], options['hostname'], () => {
        let s = ss.createStream();
        s.pipe(client).pipe(s);

        s.on('end', () => {
          client.destroy();
          
        });

        ss(socket).emit(clientId, s);
      });

      client.setTimeout(IDLE_SOCKET_TIMEOUT_MILLISECONDS);
      client.on('timeout', () => {
        client.end();
        process.send({'title':'received'})
      });

      client.on('error', () => {
        // handle connection refusal (create a stream and immediately close it)
        let s = ss.createStream();
        ss(socket).emit(clientId, s);
        s.end();
      });
    });
  
    socket.on('disconnect', function(){
        console.log(new Date() + ': disconnect')
        process.send({'title':'disconnect'})
    });

    socket.on('reconnect', function(){
      console.log(new Date() + ': reconnect')
      process.send({'title':'reconnect'})
    });

  });
};

const optimist = require('optimist');
let argv = optimist
  .usage('Usage: $0 --server [string] --subdomain [string] --hostname [string] --port [number]')
  .options('s', {
    alias: 'server',
    describe: '(Required) Tunnel server endpoint'
  })
  .options('sub', {
    alias: 'subdomain',
    describe: '(Required) Public URL the tunnel server is forwarding to us'
  })
  .options('h', {
    alias: 'hostname',
    default: '127.0.0.1',
    describe: 'Address of local server for forwarding over socket-tunnel'
  })
  .options('p', {
    alias: 'port',
    describe: '(Required) Port of local server for forwarding over socket-tunnel'
  })
  .options('a', {
    alias: 'app',
    describe: '(Required) app '
  })
  .argv;

if (argv.help) {
  optimist.showHelp();
  process.exit();
}

if (!argv['server'] || !argv['subdomain'] || !argv['port']||!argv['app']) {
  for (var key in ['server', 'subdomain', 'port']) {
    if (argv[key]) continue;

    console.log('Error: Required option, but nothing found');

    optimist.showHelp();

    process.exit();
  }
}
createTunnel(argv).then(
  (res)=>{
    let msg = {
      'title':'tunnelCreated',
      'address':res.url,
      //'socket':res.socket
    }
    process.send(msg)
  }
).catch((error)=>{
  console.log('Failed to create tunnel: ' + error )
  process.send({'title': 'failed', 'error':error})
})
process.on('message', (msg)=>{
  if(msg.title=='close'){
    socket.close()
    //process.exit()
  }
})