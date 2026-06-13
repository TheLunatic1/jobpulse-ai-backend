const mongoose = require('mongoose');
const dns = require('node:dns');

// Set DNS to Google's public DNS
dns.setServers(['8.8.8.8', '8.8.4.4']);

const uri = "mongodb+srv://salmantoha11223_db_user:GHXR8g6x0k6dt8Me@cluster0.hcc73rq.mongodb.net/?appName=Cluster0";

mongoose.connect(uri, { family: 4 })
  .then(() => {
    console.log("SUCCESS");
    process.exit(0);
  })
  .catch(err => {
    console.error("ERROR:", err.message);
    process.exit(1);
  });
