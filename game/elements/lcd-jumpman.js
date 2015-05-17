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
