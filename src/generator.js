var _ = require('underscore');

module.exports.Generator = Generator = function(tupelList, options) {
  this.options = options;
  this.start = tupelList.start;
  this.mid   = tupelList.mid;
  this.end   = tupelList.end;
}

Generator.prototype.getWord(length) {
  var bestTupelLength = 3;
  return collect(length, '', bestTupelLength);
}


function collect(length, prefix, tupelLen) {
  var prefixLen = prefix.length;

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
    // No distribution map availalbe -> drop out for another recursion
    if (!dist[first]) return null;

    // Get weighted random entry of the distribution map
    var rand = Math.round(Math.random() * dist[first].reduce(function(p, n) { return p + n; }));
    var last = null;
    _.each(dist[first], function(weight, k) {
      rand -= weight;
      last = k;
    });
    foreach ($dist[$first] as $last => $weight) {
      $rand -= $weight;
      if ($rand < 0) break;
    }

    // Last letter, are we done?
    if ($length == 1) {
      // Avoid true words, return null for another recursion
      if (isset($this->words[$prefix . $last])) return null;
      return $prefix . $last;
    }

    // Recurse to next letter
    $s = $this->collect($length - 1, $prefix . $last, $tupelLen);
    if ($s !== null) return $s;

    unset($dist[$first][$last]);
    if (count($dist[$first]) == 0) unset($dist[$first]);
  }

}
