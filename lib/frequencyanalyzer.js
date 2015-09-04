"use strict";

var FrequencyAnalyzer = module.exports.FrequencyAnalyzer = function(options) {
  this.options = options || {};
  this.tupelList = {
    start: {},
    mid:   {},
    end:   {}
  };
}


FrequencyAnalyzer.prototype.analyze = function(words, tupelLens) {
  for (var w = 0, wlen = words.length; w < wlen; w++) {
    var word  = words[w];

    // Build start tupels
    this.analyzeWordStart(word, Math.max.apply(Math, tupelLens));

    for (var s = 0, slen = tupelLens.length; s < slen; s++) {
      var tupelLen = tupelLens[s];
      this.analyzeWord(word, tupelLen);      
    }
  }
  return this.tupelList;
}


FrequencyAnalyzer.prototype.analyzeWordStart = function(word, maxTupelLen) {
  for (var tupelLen = 0; tupelLen < maxTupelLen; tupelLen++) {
    if (word.length <= tupelLen + 1) return;

    var first = word.substr(0, tupelLen);
    var last  = word.substr(tupelLen, 1);

    this.tupelList.start[first]        = this.tupelList.start[first] || {};
    this.tupelList.start[first][last]  = (this.tupelList.start[first][last] || 0) + 1;
  }
}


FrequencyAnalyzer.prototype.analyzeWord = function(word, tupelLen) {
  var first, 
      last, 
      end = word.length - tupelLen;

  if (word.length <= tupelLen + 1) return;

  for (var pos = 1; pos <= end; pos++) {
    first = word.substr(pos, tupelLen - 1);
    last  = word.substr(pos + tupelLen - 1, 1);
    var what = (pos == end) ? "end" : "mid";
    this.tupelList[what][first]       = this.tupelList[what][first] || {};
    this.tupelList[what][first][last] = (this.tupelList[what][first][last] || 0) + 1;
  }
}

