'use strict';

window.onload = initialize;

function initialize() {
  const body = document.getElementsByClassName('loading')[0];

  body.className = body.className.replace('loading', '');
}

function buildDeck(data) {
  let cardTemplate = document.getElementsByClassName('card-wrapper')[0];

  let deck = data.reduce((deck, item) => {
    let newCard = cardTemplate.cloneNode(true);
    newCard.getElementsByTagName('img')[0].src = item.url;
    newCard.setAttribute('data-id', item.id);
    let dupeCard = newCard.cloneNode(true);
    deck.push(newCard, dupeCard);
    return deck;
  }, []);

  let shuffled = shuffleDeck(deck);

  cardTemplate.remove();

  shuffled.forEach(item => document.body.appendChild(item));

  const cards = document.getElementsByClassName('card-wrapper');
  Array.prototype.forEach.call(cards, item => item.onclick = cardClickHandler);
}

function shuffleDeck(deck, secondPass) {
  let shuffled = deck.slice(0);
  let length = shuffled.length;

  shuffled.forEach(function(item, key) {
    let newKey = Math.round(Math.random() * length);
    let card = shuffled.splice(key, 1);
    shuffled.splice(newKey, 0, card[0]);
  });

  //Do a second pass just for fun
  if(!secondPass) {
    shuffled = shuffleDeck(shuffled, true);
  }

  return shuffled;
}

function cardClickHandler(event) {
  if(document.getElementsByClassName('selected').length >= 2) {
    return false;
  }

  if(this.className.indexOf('selected') > -1) {
    this.className = this.className.replace(' selected', '');
  } else {
    this.className += ' selected';
  }
  let selected = document.getElementsByClassName('selected');

  if(selected.length >= 2) {
    setTimeout(function() {
      const matchClass = (selected[0].getAttribute('data-id') == selected[1].getAttribute('data-id')) ? ' matched' : '';
      for(let i = selected.length - 1; i >= 0; i--) {
        selected[i].className = selected[i].className.replace(' selected', matchClass);
      }
    }, 1500);
  }

}

makeRequest('/tiles/10', function(data) {
  buildDeck(data);
});

function makeRequest(url, cb) {
  let httpRequest;

  buildRequest(url);

  function buildRequest(url) {
    httpRequest = new XMLHttpRequest();

    //TODO - error handling?
    httpRequest.onreadystatechange = returnResults;
    httpRequest.open('GET', url);
    httpRequest.send();
  }

  function returnResults() {
    if(httpRequest.readyState == XMLHttpRequest.DONE && httpRequest.status == 200) {
      let data = JSON.parse(httpRequest.responseText);
      cb(data);
    }
  }
}
