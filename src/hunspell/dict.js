var
  fs      = require('fs'),
  Iconv   = require('iconv').Iconv,
  split   = require('split'),
  through = require('through'),
  _       = require('underscore'),
  XRegExp = require('xregexp').XRegExp;

/**
 * @class DictParser
 */
module.exports.DictParser = DictParser = function(options) {
  this.options = options;
  this.encoding = options.encoding;
  this.words = [];
};

DictParser.prototype.parse = function(cb) {
  var self = this,
      lineCount = 0;

  fs.createReadStream(self.options.path)
  .pipe(Iconv(self.encoding, 'UTF-8'))
  .pipe(split())
  .pipe(through(function(line) {
    if (!line.match(/^\s*$|^#/)) this.emit('data', line);
  }))
  .pipe(through(function(line) {
    if (lineCount++ === 0) return;
    var els   = line.split('/'),
        word  = els[0],
        flags = els[1] || '';
    expandWord.call(self, word, flags.split(flags.indexOf(',') >= 0 ? ',' : ''));
  }))
  .on('end', cb);
};


DictParser.prototype.illegalWords = {
  'acronym': XRegExp("\\p{Lu}{2,}"),
  'abbrev':  XRegExp("\\.$"),
  'affix':   XRegExp("^-|-$"),
  'freaky':  XRegExp("[^\\p{L}\\p{Arabic}'-]")
};

DictParser.prototype.filterWord = function(word) {
  return _(this.illegalWords).reduce(function(result, rule, ruleName) {
    var matches = rule.test(word);
    //if (matches) console.log("Word '%s' is '%s'", word, ruleName);
    return matches ? true : result;
  }, false);
};

function addWord(word) {
  if (!this.filterWord(word)) this.words.push(word);
}

function expandWord(word, affixIds) {
  var self = this,
      prefixes = [],
      suffixes = [],
      crossPrefixes = [],
      crossSuffixes = [];
  affixIds.forEach(function (affixId) {
    var affix = self.options.affixes[affixId];
    if (affix) {
      affix.entries.forEach(function(entry) {
        (affix.type == 'P' ? prefixes : suffixes).push(entry);
        if (affix.cross) {
          (affix.type == 'P' ? crossPrefixes : crossSuffixes).push(entry);
        }
      });
    }
  });

  addWord.call(self, word);

  prefixes.forEach(function (affix) {
    if (!word.match(affix.condition)) return;
    addWord.call(self, affix.append + word.substr(affix.strip));
  });

  suffixes.forEach(function (affix) {
    if (!word.match(affix.condition)) return;
    addWord.call(self, word.substr(0, word.length - affix.strip) + affix.append);
  });

  crossPrefixes.forEach(function (affix) {
    if (!word.match(affix.condition)) return;
    var prefixedWord = affix.append + word.substr(affix.strip);
    crossSuffixes.forEach(function (affix) {
      if (!word.match(affix.condition)) return;
      addWord.call(self, prefixedWord.substr(0, prefixedWord.length - affix.strip) + affix.append);
    });
  });
}
