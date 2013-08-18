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
  this.encoding = options.encoding;
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
    if (!line.match(/^\s*$|^#/)) this.emit('data', line);
  }))
  .pipe(through(function(line) {
    if (lineCount++ === 0) return;
    var els = line.split('/');
    expandWord.call(self, els[0], (els[1] || '').split(''));
  }))
  .on('end', cb);
}


function expandWord(word, affixIds) {
  var self = this,
      prefixes = [],
      suffixes = [],
      crossPrefixes = [],
      crossSuffixes = [];
  affixIds.forEach(function (affixId) {
    var affix;
    if (affix = self.options.affixes[affixId]) {
      affix.entries.forEach(function(entry) {
        (affix.type == 'P' ? prefixes : suffixes).push(entry);
        if (affix.cross) {
          (affix.type == 'P' ? crossPrefixes : crossSuffixes).push(entry);
        }
      });
    }
  });

  self.words.push(word);

  prefixes.forEach(function (affix) {
    if (!word.match(affix.condition)) return;
    self.words.push(affix.append + word.substr(affix.strip));
  });

  suffixes.forEach(function (affix) {
    if (!word.match(affix.condition)) return;
    self.words.push(word.substr(0, word.length - affix.strip) + affix.append);
  });

  crossPrefixes.forEach(function (affix) {
    if (!word.match(affix.condition)) return;
    var prefixedWord = affix.append + word.substr(affix.strip);
    crossSuffixes.forEach(function (affix) {
      if (!word.match(affix.condition)) return;
      self.words.push(prefixedWord.substr(0, prefixedWord.length - affix.strip) + affix.append);
    });
  });
}
