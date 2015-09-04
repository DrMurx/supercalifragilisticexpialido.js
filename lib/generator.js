"use strict";

var _ = require('underscore');

var Generator = module.exports.Generator = function(tupelList, words, options) {
  this.options = options;
  this.start = tupelList.start;
  this.mid   = tupelList.mid;
  this.end   = tupelList.end;
  this.words = words;
}


Generator.prototype.getWord = function(length, availTupelLengths) {
  return collect.call(this, length, '', availTupelLengths);
}


function collect(length, prefix, availTupelLengths) {
  var prefixLen = prefix.length,
      tupelLenKey = Math.round(Math.random() * (availTupelLengths.length - 1)),
      tupelLen = availTupelLengths[tupelLenKey],
      dist, first;

  while (true) {
    // Elect proper distribution table
    if (prefixLen < tupelLen) {
      dist  = this.start;
      first = prefix;
    } else {
      dist  = (length > 1) ? this.mid : this.end;
      first = prefix.substr(-(tupelLen - 1));
    }

    while (true) {
      // No distribution map available -> drop out for another recursion
      if (!dist[first]) return;
      if (_(dist[first]).size() == 0) {
        delete dist[first];
        return;
      }

      var last = getWeightedRandomEntry(dist[first]);

      var s = prefix + last;

      // Last letter, are we done?
      if (length == 1) {
        // Avoid true words, return null for another recursion
        if (this.words.indexOf(s.toLowerCase()) >= 0) return;
        return s;
      }

      // Recurse to next letter
      var s = collect.call(this, length - 1, s, availTupelLengths);
      if (typeof s == 'string') {
        return s;
      }

      delete dist[first][last];
    }
  }

}


function getWeightedRandomEntry(map) {
  map = _(map);

  var last = '',
      rand = Math.round(
        Math.random() * (map.reduce(function(p, n) { return p + n; }) - 1)
      );

  map.find(function(weight, letter) {
    rand -= weight;
    last = letter;
    return (rand < 0);
  });

  return last;
}

