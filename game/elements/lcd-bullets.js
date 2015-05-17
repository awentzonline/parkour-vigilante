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
