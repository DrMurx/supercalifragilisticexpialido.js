module.exports.FrequencyAnalyzer = FrequencyAnalyzer = function(options) {
  this.options = options;
  this.tupelList = {
    start: {},
    mid: {},
    end: {}
  };

}

FrequencyAnalyzer.prototype.analyze = function(words, tupelLen) {
  var self = this;
  words.forEach(function (el) {
    if (el.length <= tupelLen + 1) return;
    analyzeWordForTupelLen.call(self, el, tupelLen);
  })
  return this.tupelList;
}


function analyzeWordForTupelLen(word, tupelLen) {
  var end = word.length - tupelLen;
  for (var pos = 0; pos <= end; pos++) {
    if (pos == 0) {
      for (var startLen = 0; startLen < tupelLen; startLen++) {
        first = word.substr(0, startLen);
        last  = word.substr(startLen, 1);

        this.tupelList.start[startLen]               = this.tupelList.start[startLen] || {};
        this.tupelList.start[startLen][first]        = this.tupelList.start[startLen][first] || {};
        this.tupelList.start[startLen][first][last]  = (this.tupelList.start[startLen][first][last] || 0) + 1;
      }
    } else {
      first = word.substr(pos, tupelLen - 1);
      last  = word.substr(pos + tupelLen - 1, 1);
      var what = (pos == end) ? "end" : "mid";
      this.tupelList[what][tupelLen]              = this.tupelList[what][tupelLen] || {};
      this.tupelList[what][tupelLen][first]       = this.tupelList[what][tupelLen][first] || {};
      this.tupelList[what][tupelLen][first][last] = (this.tupelList[what][tupelLen][first][last] || 0) + 1;
    }
  }
}

