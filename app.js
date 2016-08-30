'use strict';

const express = require('express');
const fs = require('fs');

const app = express();
const port = process.env.PORT || 5000;

let pngs = null;
let pngCount;

app.use('/pokemon', express.static('node_modules/pokemon-sprites/sprites/pokemon'));
app.use('/', express.static('public'));

app.get('/tiles/:num', function(req, res) {
  let keys = randomList(req.params.num, pngCount);

  let images = keys.reduce(function(all, key) {
    let png = pngs[key];

    let data = {
      id: png.split('.')[0],
      url: `/pokemon/${png}`
    };

    all.push(data);
    return all;
  }, []);

  res.send(images);
});

app.listen(port, () => console.log(`Server listening on ${port}`));

fs.readdir('node_modules/pokemon-sprites/sprites/pokemon', (err, results) => {
  pngs = results.filter(item => {
    return item.indexOf('.png') > -1 && item != '0.png' && item.indexOf('egg') == -1 && item.indexOf('substitute') == -1;
  });

  pngCount = pngs.length;
});

function randomList(count, max) {
  if(count >= max) {
    console.error('List is shorter than requested # of items');
    return;
  }

  let numbers = [];

  while(numbers.length < count) {
    let random = Math.round(Math.random() * max);

    //Store number only if we don't have an instance of it
    if(numbers.indexOf(random) == -1) {
      numbers.push(random);
    }
  }

  return numbers;
}
