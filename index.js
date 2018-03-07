const rp = require('request-promise');
const cheerio = require('cheerio');
const options = {
  uri: `http://localhost/wiki/`,
  transform: function (body) {
    return cheerio.load(body);
  }
};
let names = [];
let hrefs = [];
let objs = [];
let ids = [];
rp(options)
  .then(($) => {
    $('li[class=gallerybox]').each(function(i, elem) {
        // FIXA SÅ ATT åäö försvinner och space byts ut mot _
        let name = $(this).text();
        name = name.toString().replace(/(\r\n|\n|\r)/gm,"");
        name = name.toString().replace(/(\r\t|\t|\r)/gm,"");
        names.push(name);
    });
    $('a[class=image]').each(function(i, elem) {
        let href = $(this).attr('href');
        href = href.toString().replace(/(\r\n|\n|\r)/gm,"");
        href = href.toString().replace(/(\r\t|\t|\r)/gm,"");
        hrefs.push(href);
    });
    $('img').each(function(i, elem) {
        let src = $(this).attr('src');
        let last = src.split('thumb')[1];
        let id;
        if(last !== undefined){
          id = last.split('Sweden_')[0];
          ids.push(id);
        }
    });
    for(var i in names){
      let obj = {};
      obj.name = names[i];
      obj.href = hrefs[i];
      obj.id = ids[i];
      objs.push(obj);
    }
    for(var o in objs){
      let name = objs[o].name;
      let href = objs[o].href;
      let id = objs[o].id;
      href = href.replace('Fil:', 'File:');
      href = href.replace('/wiki/File:', '');
      let downUrl = `https://upload.wikimedia.org/wikipedia/commons`;
      downUrl = `${downUrl}${id}${href}`;
      //console.log(downUrl);
      download(downUrl, `./images/${name}.svg`, function(){
        console.log('download done! of: '+name);
        console.log(downUrl);
      });
    }
  })
  .catch((err) => {
    console.log(err);
  });

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
  //download('https://sv.wikipedia.org/wiki/Svenska_v%C3%A4gm%C3%A4rken', 'index.html', function(){
  //  console.log('download done!');
  //});
