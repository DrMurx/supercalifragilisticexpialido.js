var _ = require('underscore');

module.exports.Generator = Generator = function(tupelList, words, options) {
  this.options = options;
  this.words = words;
  this.start = tupelList.start;
  this.mid   = tupelList.mid;
  this.end   = tupelList.end;
}

Generator.prototype.getWord = function(length) {
  var bestTupelLength = 6;
  return collect.call(this, length, '', bestTupelLength);
}


function collect(length, prefix, tupelLen) {
  var prefixLen = prefix.length, dist, first;

  // Elect proper distribution table
  if (prefixLen < tupelLen) {
    dist  = this.start[prefixLen];
    first = prefix;
  } else {
    if (length == 1) {
      dist = this.end[tupelLen];
    } else {
      dist = this.mid[tupelLen];
    }
    first = prefix.substr(-(tupelLen - 1));
  }

  while (true) {
    // No distribution map available -> drop out for another recursion
    if (_(dist[first]).size() == 0) {
      delete dist[first];
      return;
    }

    // Get weighted random entry of the distribution map
    var rand = Math.round(Math.random() * _(dist[first]).reduce(function(p, n) { return p + n; }));
    var last = null;
//console.log(rand, _(dist[first]).reduce(function(p, n) { return p + n; }));
    _(dist[first]).find(function(weight, _last) {
//console.log('  ', weight, _last);
      rand -= weight;
      last = _last;
      return (rand < 0);
    });

    // Last letter, are we done?
    if (length == 1) {
      // Avoid true words, return null for another recursion
      if (this.words.indexOf(prefix + last) >= 0) return;
      return prefix + last;
    }

    // Recurse to next letter
// console.log('1', prefix, first, last, dist[first]);
    s = collect.call(this, length - 1, prefix + last, tupelLen);
    if (typeof s == 'string') return s;
// console.log('2', prefix, first, last, dist[first]);

    delete dist[first][last];
  }

}
