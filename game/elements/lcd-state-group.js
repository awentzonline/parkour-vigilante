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