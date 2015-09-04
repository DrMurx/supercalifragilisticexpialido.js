"use strict";

var 
  util         = require('util'),
  events       = require('events'),
  _            = require('underscore'),
  XRegExp      = require('xregexp').XRegExp;


var Expander = module.exports.Expander = function(hunspellReader, options) {
  events.EventEmitter.call(this);

  options = options || {};

  this.illegalWords = options.illegalWords || {
    'acronym': XRegExp("\\p{Lu}{2,}"),
    'abbrev':  XRegExp("\\.$"),
    'affix':   XRegExp("^-|-$"),
    'freaky':  XRegExp("[^\\p{L}\\p{Arabic}'-]")
  };

  this.reader = hunspellReader;
}


Expander.prototype.filterWord = function(word) {
  return _(this.illegalWords).reduce(function(result, rule, ruleName) {
    var matches = rule.test(word);
    //if (matches) console.log("Word '%s' is '%s'", word, ruleName);
    return matches ? true : result;
  }, false);
};



Expander.prototype.expand = function(wordRecord) {
  var self = this,
      word  = wordRecord.word,
      flags = wordRecord.flags,
      prefixes = [],
      suffixes = [],
      crossPrefixes = [],
      crossSuffixes = [];

  flags.forEach(function (affixId) {
    var affix = self.reader.prefixes[affixId];
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

}
