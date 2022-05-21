const gHTMLElements = {
    "main": document.querySelector('main'),    
    "score": document.getElementById('scoretext'),
    "time": document.getElementById('timetext'),
    "textcontainer": document.querySelector('.text-container'),
    "restartbtn": document.querySelector('.btn'),
    "recordspan": document.getElementById('record'),
};


const BLOCKSIZE = 45;
const BALLRADIUS = 12;

const GRAVITY = 0.45; 
const FRICTION = .6;

const TARGETCOLOR = "#E7C823";
const SUBTARGETCOLOR = "#3498DB";
const BALLCOLOR = "orange";
let BGCOLOR = 'rgba(40,40,40,0.2)';

const TOTALTIME = 30;

const WALLCOLOR = 'rgba(32, 30, 119)';
const PORTALCOLOR = 'black'

//Do not change
const HORIZONTAL = 1;
const VERTICAL = 2;