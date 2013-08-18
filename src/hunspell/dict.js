var
  fs      = require('fs'),
  Iconv   = require('iconv').Iconv,
  split   = require('split'),
  through = require('through');

/**
 * @class DictParser
 */
module.exports.DictParser = DictParser = function(options) {
  this.options = options;
  this.words = [];
}



DictParser.prototype.parse = function(cb) {
  var self = this,
      lineCount = 0;

  fs.createReadStream(self.options.path, {
    encoding: 'binary'
  })
  .pipe(Iconv(self.encoding, 'UTF-8'))
  .pipe(split())
  .pipe(through(function(line) {
    if (!line.match(/^\s*$|^#/)) this.emit(line);
  }))
  .pipe(through(function(line) {
    if (lineCount === 0) return;
    var els = line.split('/');
    expandWord.call(self, els[0], (els[1] || '').split(''));
  });
}


function expandWord(word, affixIds) {
  var self = this,
      prefixes = {},
      suffixes = {};
  affixIds.forEach(function (affixId) {
    var affix;
    if (affix = self.options.affixes[affixId]) {
      (affix.type == 'P' ?  prefixes : suffixes)[affixId] = affix;
    }
  });
  
}
