var wtf = require('wtf_wikipedia');

//hit the api
wtf.from_api('vagmarken', 'en', function(markup) {
  var data = wtf.parse(markup);
  console.log(data.infoboxes[0].data.leader_name);
  // "John Tory"
});
