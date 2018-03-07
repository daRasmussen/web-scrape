const fs = require('fs');
const request = require('request');

let download = function(uri, filename, callback) {
  request.head(uri, function(err, res, body){
    console.log('content-type:', res.headers['content-type']);
    console.log('content-length:', res.headers['content-length']);
    request(uri).pipe(fs.createWriteStream(filename)).on('close', callback);
  });
};
//https://upload.wikimedia.org/wikipedia/commons/d/db/Sweden_road_sign_A1-1.svg
download('https://sv.wikipedia.org/wiki/Svenska_v%C3%A4gm%C3%A4rken', 'index.html', function(){
  console.log('done');
});
