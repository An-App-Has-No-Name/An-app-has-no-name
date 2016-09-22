'use strict';

const fs = require('fs'),
      request = require('request'),
      path = require('path'),
      {OPEN_TRIVIA_SESSION_TOKEN} = require('./config');
//Commenting the following out because 'html2json' module will run an error and it's not something we need again. So it hasn't been put in pacakge.json.

// const html2json = require('html2json').html2json;
// const string = '<option value="9">General Knowledge</option><option value="10">Entertainment: Books</option><option value="11">Entertainment: Film</option><option value="12">Entertainment: Music</option><option value="13">Entertainment: Musicals &amp; Theatres</option><option value="14">Entertainment: Television</option><option value="15">Entertainment: Video Games</option><option value="16">Entertainment: Board Games</option><option value="17">Science &amp; Nature</option><option value="18">Science: Computers</option><option value="19">Science: Mathematics</option><option value="20">Mythology</option><option value="21">Sports</option><option value="22">Geography</option><option value="23">History</option><option value="24">Politics</option><option value="25">Art</option><option value="26">Celebrities</option><option value="27">Animals</option><option value="28">Vehicles</option><option value="29">Entertainment: Comics</option><option value="30">Science: Gadgets</option><option value="31">Entertainment: Japanese Anime &amp; Manga</option><option value="32">Entertainment: Cartoon &amp; Animations</option>';

// const dataJSON = html2json(string).child;
// const categories = {};
// dataJSON.forEach((item, i)=> {
//   const key = dataJSON[i].attr.value;
//   const value = dataJSON[i].child[0].text;
//   categories[key] = value
// });

const categories = {
  '9': 'General Knowledge',
  '10': 'Entertainment: Books',
  '11': 'Entertainment: Film',
  '12': 'Entertainment: Music',
  '13': 'Entertainment: Musicals &amp; Theatres',
  '14': 'Entertainment: Television',
  '15': 'Entertainment: Video Games',
  '16': 'Entertainment: Board Games',
  '17': 'Science &amp; Nature',
  '18': 'Science: Computers',
  '19': 'Science: Mathematics',
  '20': 'Mythology',
  '21': 'Sports',
  '22': 'Geography',
  '23': 'History',
  '24': 'Politics',
  '25': 'Art',
  '26': 'Celebrities',
  '27': 'Animals',
  '28': 'Vehicles',
  '29': 'Entertainment: Comics',
  '30': 'Science: Gadgets',
  '31': 'Entertainment: Japanese Anime &amp; Manga',
  '32': 'Entertainment: Cartoon &amp; Animations'
}
const urlPath = `http://www.opentdb.com/api.php?amount=10&type=multiple&token=${OPEN_TRIVIA_SESSION_TOKEN}&category=`;
const category_num = Object.keys(categories);
const filePath = path.join(__dirname, '/data.txt');

category_num.forEach((item, i) => {
  const newUrlPath = urlPath + category_num[i]
  request(newUrlPath, function (error, response, body) {
    if (!error && response.statusCode == 200) {
      body = JSON.parse(body);
      const response_code = body['response_code'];
        if (response_code === 0) {
          body = JSON.stringify(body['results']);
          body = body.slice(1,body.length-1) + ',';
          console.log(body);
          fs.appendFile(filePath, body, function() {
          });
        } else {
          console.log(body['results'].length);
        }
    }
  });

});
