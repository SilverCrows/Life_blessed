const blessed = require('blessed');

let a = [];
let b = [];
let height = 42;
let width  = 42;

function init() {
  for (let i=0; i<height; i++){
    for (let j=0; j<width; j++){
      a[i*width + j] = 0;
      b[i*width + j] = " ";
    }
  }  
}

function pprint() {
  for (let i=0; i<height; i++){
    var ln = "";
    for (let j=0; j<width; j++){
      ln += a[i*width + j] ? "*" : " ";
      ln += " ";
    }
     //console.log(ln);
  }
}

let toCheck = [-1*(width+1), -1*width, -1*(width-1), -1, 1, width -1, width, width+1];

function step() {
  for (let i=0; i<height; i++){
    for (let j=0; j<width; j++){
      let curCell = i*width + j;
      let isAlive = a[curCell];
      let liveCount = 0;
      for (let x=0; x<toCheck.length; x++) {
        if (curCell+toCheck[x] >= 0) {
          liveCount += a[curCell+toCheck[x]] ? 1 : 0;
        }        
      }
      if (isAlive && liveCount < 2) {
        a[i*width + j] = 0;
        b[i*width + j] = " ";
      } else if (isAlive && (liveCount == 2 || liveCount == 3)) {
        a[i*width + j] = 1;
        b[i*width + j] = "*";
      } else if (isAlive && liveCount > 3) {
        a[i*width + j] = 0;
        b[i*width + j] = " ";
      } else if (!isAlive && liveCount == 3) {
        a[i*width + j] = 1;
        b[i*width + j] = "*";
      } 
      pprint();
    }
  } 
}

init();

// a[height+4] = 1;
// a[height+5] = 1;
// a[(2*height)+5] = 1;
// a[(3*height)+5] = 1;
// a[(4*height)+5] = 1;
// a[(6*height)+4] = 1;
// a[(6*height)+5] = 1;
// a[(7*height)+3] = 1;
// a[(7*height)+4] = 1;
// a[(8*height)+6] = 1;
// a[(9*height)+5] = 1;

for (let i =0; i < 256; i++) { 
  let rand = 1 + Math.random() * (42 - 1);
   rand = Math.round(rand);
   a[rand*width + i] = 1;
   a[(rand*height)+i] = 1;
}




var screen = blessed.screen({
  smartCSR: true
});


screen.title = 'Life';

var text = blessed.text({
  top: 'center',
  left: 'center',
  width: width+2,
  height: height+2,
  content: 'Hello {bold}world{/bold}!',
  tags: true,
  border: {
    type: 'line'
  },
  style: {
    fg: 'green',
    bg: 'black',
    border: {
      fg: '#f0f0f0'
    },
    hover: {
      bg: 'green'
    }
  }
});

text.setText(b.join(''));

setInterval(() => {
  step();
  text.setText(b.join(''));
  screen.render();
}, 200);

screen.key(['escape', 'q', 'C-c'], function(ch, key) {
  return process.exit(0);
});

screen.append(text);
text.focus();
screen.render();
