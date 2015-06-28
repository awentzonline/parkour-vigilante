(function e(t,n,r){function s(o,u){if(!n[o]){if(!t[o]){var a=typeof require=="function"&&require;if(!u&&a)return a(o,!0);if(i)return i(o,!0);var f=new Error("Cannot find module '"+o+"'");throw f.code="MODULE_NOT_FOUND",f}var l=n[o]={exports:{}};t[o][0].call(l.exports,function(e){var n=t[o][1][e];return s(n?n:e)},l,l.exports,e,t,n,r)}return n[o].exports}var i=typeof require=="function"&&require;for(var o=0;o<r.length;o++)s(r[o]);return s})({1:[function(require,module,exports){
'use strict';

module.exports = LCDBullets;

var LCDStateGroup = require('./lcd-state-group');

function LCDBullets(game, img, options) {
  this.numBulletFrames = options.numBulletFrames;
  this.moveDelay = options.moveDelay;
  this.lastMoveTime = -this.moveDelay;
  this.bulletPosition = 0; // zero means no bullets
  this.isShooting = false;
  this.onScore = options.onScore;
  var conf = {}
  for (var i = 1; i <= this.numBulletFrames; i++) {
    var key = 'shoot' + i;
    conf[key] = {
      img: 'bullet',
      position: [options.startX + options.dx * i / this.numBulletFrames, options.startY]
    }
  }
  LCDStateGroup.call(this, game, conf);
  this.updateStateByPosition();
}

LCDBullets.prototype = Object.create(LCDStateGroup.prototype);
LCDBullets.prototype.constructor = LCDBullets;

LCDBullets.prototype.updateStateByPosition = function () {
  this.stateName = 'shoot' + this.bulletPosition;
  this.setActiveState(this.stateName);
};

LCDBullets.prototype.update = function () {
  LCDStateGroup.prototype.update.call(this);
  if (this.isShooting) {
    var now = this.game.time.now;
    if (this.game.time.now - this.lastMoveTime >= this.moveDelay) {
      if (this.bulletPosition == 0) {
        this.game.sound.play('shoot');
      }
      this.bulletPosition += 1;
      if (this.bulletPosition > this.numBulletFrames) {
        this.bulletPosition = 0;
        if (this.onScore) {
          this.onScore(1);
        }
      }
      this.updateStateByPosition();
      this.lastMoveTime = now;
    }
  }
};

},{"./lcd-state-group":3}],2:[function(require,module,exports){
'use strict';

module.exports = LCDJumpMan;

var LCDStateGroup = require('./lcd-state-group');

function LCDJumpMan(game, stateConf, options) {
  options = options || {};
  this.jumpDelay = options.jumpDelay || 100;
  this.lastJumpTime = -this.jumpDelay;
  this.jumpHangTime = options.jumpHangTime || 500;
  this.canMove = true;
  this.stateName = 'stand';
  LCDStateGroup.call(this, game, stateConf);
  this.setActiveState(this.stateName);
}

LCDJumpMan.prototype = Object.create(LCDStateGroup.prototype);
LCDJumpMan.prototype.constructor = LCDJumpMan;

LCDJumpMan.prototype.update = function () {
  LCDStateGroup.prototype.update.call(this);
  if (this.canMove) {
    if (this.game.input.activePointer.isDown) {
      if (this.stateName != 'jump' && this.game.time.now - this.lastJumpTime >= this.jumpDelay) {
        this.game.sound.play('jump');
        this.stateName = 'jump';
        this.setActiveState(this.stateName);
        this.game.time.events.add(this.jumpHangTime, function () {
          this.stateName = 'stand';
          this.setActiveState(this.stateName);
          this.lastJumpTime = this.game.time.now;
        }, this);
      }
    }
  }
};

},{"./lcd-state-group":3}],3:[function(require,module,exports){
'use strict';

module.exports = LCDStateGroup;

function LCDStateGroup(game, stateConfs) {
  Phaser.Group.call(this, game);
  this.inactiveOpacity = 0.15;
  this.activeOpacity = 0.5;
  this.spriteTint = 0;

  this.states = {};
  for (var key in stateConfs) {
    if (!stateConfs.hasOwnProperty(key))
      continue;
    var conf = stateConfs[key];
    var sprite = this.states[key] = this.game.add.sprite(
      conf.position[0], conf.position[1], conf.img, conf.frame);
    this.add(sprite);
    sprite.tint = this.spriteTint;
  }
};

LCDStateGroup.prototype = Object.create(Phaser.Group.prototype);
LCDStateGroup.prototype.constructor = LCDStateGroup;

LCDStateGroup.prototype.setActiveState = function setActiveState(newState) {
  for (var key in this.states) {
    if (!this.states.hasOwnProperty(key))
      continue;
    var sprite = this.states[key];
    var opacity = key == newState ? this.activeOpacity : this.inactiveOpacity;
    sprite.alpha = opacity;
  }
}
},{}],4:[function(require,module,exports){
'use strict';

//global variables
window.onload = function () {
  var game = new Phaser.Game(640, 542, Phaser.AUTO, 'tyger');

  // Game States
  game.state.add('boot', require('./states/boot'));
  game.state.add('gameover', require('./states/gameover'));
  game.state.add('menu', require('./states/menu'));
  game.state.add('play', require('./states/play'));
  game.state.add('preload', require('./states/preload'));
  

  game.state.start('boot');
};
},{"./states/boot":5,"./states/gameover":6,"./states/menu":7,"./states/play":8,"./states/preload":9}],5:[function(require,module,exports){

'use strict';

function Boot() {
}

Boot.prototype = {
  preload: function() {
    this.load.image('preloader', 'assets/preloader.gif');
  },
  create: function() {
    this.game.input.maxPointers = 1;
    if (this.game.device.desktop) {
      this.scale.scaleMode = Phaser.ScaleManager.SHOW_ALL;
      this.scale.setMinMax(320, 271, 640, 542);
      this.scale.pageAlignHorizontally = true;
      this.scale.pageAlignVertically = true;
    } else {
      this.scale.scaleMode = Phaser.ScaleManager.SHOW_ALL;
      this.scale.setMinMax(640, 542, 640, 542);
      this.scale.pageAlignHorizontally = true;
      this.scale.pageAlignVertically = true;
    }
    this.game.state.start('preload');
  }
};

module.exports = Boot;

},{}],6:[function(require,module,exports){

'use strict';
function GameOver() {}

GameOver.prototype = {
  preload: function () {

  },
  create: function () {
    var style = { font: '65px Arial', fill: '#ffffff', align: 'center'};
    this.titleText = this.game.add.text(this.game.world.centerX,100, 'Game Over!', style);
    this.titleText.anchor.setTo(0.5, 0.5);

    this.congratsText = this.game.add.text(this.game.world.centerX, 200, 'You Lose!', { font: '32px Arial', fill: '#ffffff', align: 'center'});
    this.congratsText.anchor.setTo(0.5, 0.5);

    this.instructionText = this.game.add.text(this.game.world.centerX, 300, 'Click To Play Again', { font: '16px Arial', fill: '#ffffff', align: 'center'});
    this.instructionText.anchor.setTo(0.5, 0.5);
  },
  update: function () {
    if(this.game.input.activePointer.justPressed()) {
      this.game.state.start('play');
    }
  }
};
module.exports = GameOver;

},{}],7:[function(require,module,exports){

'use strict';
function Menu() {}

Menu.prototype = {
  preload: function() {

  },
  create: function() {
    var style = { font: '65px Arial', fill: '#ffffff', align: 'center'};
    this.sprite = this.game.add.sprite(this.game.world.centerX, 138, 'yeoman');
    this.sprite.anchor.setTo(0.5, 0.5);

    this.titleText = this.game.add.text(this.game.world.centerX, 300, '\'Allo, \'Allo!', style);
    this.titleText.anchor.setTo(0.5, 0.5);

    this.instructionsText = this.game.add.text(this.game.world.centerX, 400, 'Click anywhere to play "Click The Yeoman Logo"', { font: '16px Arial', fill: '#ffffff', align: 'center'});
    this.instructionsText.anchor.setTo(0.5, 0.5);

    this.sprite.angle = -20;
    this.game.add.tween(this.sprite).to({angle: 20}, 1000, Phaser.Easing.Linear.NONE, true, 0, 1000, true);
  },
  update: function() {
    if(this.game.input.activePointer.justPressed()) {
      this.game.state.start('play');
    }
  }
};

module.exports = Menu;

},{}],8:[function(require,module,exports){
'use strict';

var LCDStateGroup = require('../elements/lcd-state-group');
var LCDBullets = require('../elements/lcd-bullets');
var LCDJumpMan = require('../elements/lcd-jumpman');

function Play() {}

Play.prototype = {
  create: function() {
    this.backgroundImage = this.game.add.image(0, 0, 'background');
    this.lcdBounds = new Phaser.Rectangle(205, 117, 240, 173);
    
    this.score = 0;
    this.scoreText = this.game.add.bitmapText(
      this.lcdBounds.x + this.lcdBounds.width * 0.7, this.lcdBounds.y + this.lcdBounds.height * 0.15, 'font', '0000', 32
    );
    this.scoreText.alpha = 0.5;
    this.gameOver = false;
    this.canRestart = false;

    this.player = new LCDJumpMan(this.game, {
      'stand': {
        position: [50 + this.lcdBounds.x, 100 + this.lcdBounds.y],
        img: 'simple_guy',
        frame: 1
      },
      'jump': {
        position: [50 + this.lcdBounds.x, 50 + this.lcdBounds.y],
        img: 'simple_guy',
        frame: 0
      }
    });
    this.game.add.existing(this.player);

    this.pow = new LCDStateGroup(this.game, {
      'pow': {
        position: [95 + this.lcdBounds.x, 105 + this.lcdBounds.y],
        img: 'pow'
      }
    });
    this.pow.setActiveState('notpow');
    this.game.add.existing(this.pow);

    this.bullets = new LCDBullets(this.game, 'bullet', {
      numBulletFrames: 6,
      startX: this.lcdBounds.right,
      startY: this.lcdBounds.y + 125,
      dx: -this.lcdBounds.width,
      moveDelay: 250,
      onScore: this.onScore.bind(this)
    });
    this.game.add.existing(this.bullets);

    // dont start shooting immediately
    this.game.time.events.add(1000, function () {
      this.bullets.isShooting = true;
    }, this);

    this.game.sound.play('bink'); // here it goes!
  },
  update: function() {
    if (!this.gameOver) {
      if (this.bullets.stateName == ('shoot' + 4) && this.player.stateName == 'stand') {
        //this.game.state.start('gameover');
        this.gameOver = true;
        this.game.sound.play('boom');
        this.pow.setActiveState('pow');
        this.bullets.isShooting = false;
        this.player.canMove = false;
        // prevent them from immediately restarting accidentally
        this.game.time.events.add(1000, function () {
          this.canRestart = true;
        }, this);
      }
    }
    if (this.gameOver) {
      if (this.canRestart && this.game.input.activePointer.isDown) {
        this.game.state.start('play');
      }
    }
  },
  onScore: function (points) {
    this.score += points;
    this.game.sound.play('ching');
    this.updateScoreText();
  },
  updateScoreText: function () {
    var text = ('0000' + this.score).slice(-4);
    this.scoreText.text = text;
  }
};

module.exports = Play;

},{"../elements/lcd-bullets":1,"../elements/lcd-jumpman":2,"../elements/lcd-state-group":3}],9:[function(require,module,exports){
'use strict';
function Preload() {
  this.asset = null;
  this.ready = false;
}

Preload.prototype = {
  preload: function() {
    this.asset = this.add.sprite(this.game.width/2,this.game.height/2, 'preloader');
    this.asset.anchor.setTo(0.5, 0.5);

    this.load.onLoadComplete.addOnce(this.onLoadComplete, this);
    this.load.setPreloadSprite(this.asset);
    this.load.spritesheet('simple_guy', 'assets/simple_guy_small.png', 75, 74, 2);
    this.load.image('bullet', 'assets/small_bullet.png');
    this.load.image('pow', 'assets/pow.png');
    this.load.image('background', 'assets/background.jpg');
    this.load.bitmapFont('font', 'assets/fonts/lcd.png', 'assets/fonts/lcd.fnt');
    this.load.audio('boom', 'assets/boom.wav');
    this.load.audio('shoot', 'assets/shoot.wav');
    this.load.audio('jump', 'assets/jump.wav');
    this.load.audio('bink', 'assets/bink.wav');
    this.load.audio('ching', 'assets/ching.wav');
  },
  create: function() {
    this.asset.cropEnabled = false;
  },
  update: function() {
    if(!!this.ready) {
      this.game.state.start('play');
    }
  },
  onLoadComplete: function() {
    this.ready = true;
  }
};

module.exports = Preload;

},{}]},{},[4]);
