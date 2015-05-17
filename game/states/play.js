'use strict';

var LCDStateGroup = require('../elements/lcd-state-group');
var LCDBullets = require('../elements/lcd-bullets');
var LCDJumpMan = require('../elements/lcd-jumpman');

function Play() {}

Play.prototype = {
  create: function() {
    this.backgroundImage = this.game.add.image(0, 0, 'background');
    this.lcdBounds = new Phaser.Rectangle(208, 125, 236, 178);
    
    this.score = 0;
    this.scoreText = this.game.add.bitmapText(
      this.lcdBounds.x + this.lcdBounds.width * 0.7, this.lcdBounds.y + this.lcdBounds.height * 0.1, 'font', '0000', 32
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
