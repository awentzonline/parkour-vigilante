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
