const dns = require('dns');

// Force Google DNS
dns.setServers(['8.8.8.8', '8.8.4.4']);

console.log("Resolving SRV...");
dns.resolveSrv('_mongodb._tcp.cluster0.wvvlvqz.mongodb.net', (err, addresses) => {
  if (err) {
    console.error('SRV Error:', err.message);
  } else {
    console.log('SRV Records:', addresses);
    dns.resolveTxt('cluster0.wvvlvqz.mongodb.net', (err, txt) => {
        console.log('TXT Records:', txt);
    });
  }
});
