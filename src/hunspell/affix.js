var
  fs      = require('fs'),
  Iconv   = require('iconv').Iconv,
  split   = require('split'),
  through = require('through');


/**
 * @class AffixParser
 */
module.exports.AffixParser = AffixParser = function(options) {
  this.options = options;
  this.affixes = {};
  this.encoding = options.encoding || 'ISO8859-1';
};

AffixParser.prototype.parse = function(cb) {
  var self = this;
  ensureEncoding.call(this, function(err) {
    if (err) return cb(err);
    console.log("Found encoding: %s", self.encoding);
    readAffixFile.call(self, function(err) {
      cb(err);
    });
  });
};

function readAffixFile(cb) {
  var self = this;

  fs.createReadStream(self.options.path)
  .pipe(Iconv(self.encoding, 'UTF-8'))
  .pipe(split())
  .pipe(through(function(line) {
    if (!line.match(/^\s*$|^#/)) this.emit('data', line);
  }))
  .pipe(through(function(line) {
    var _suff; // never thought I'd ever name a variable "suff"

    if (_suff = line.match(/^([SP])FX\s+(\S+)\s+(\S+)\s+(\S+)$/)) {
      var type  = _suff[1],
          id    = _suff[2],
          cross = _suff[3];
      self.affixes[id] = {
        type:    type,
        cross:   cross == 'Y',
        entries: []
      };
      return;
    }

    if ((_suff = line.match(/^([SP])FX\s(\S+)\s(\S+)\s([^\s\/]+)(?:\/(\S+))?\s(\S*)(?:\s(.+))?/)) 
        ||
        (_suff = line.match(/^([SP])FX\s+(\S+)\s+(\S+)\s+([^\s\/]+)(?:\/(\S+))?\s+(\S+)(?:\s+(.+))?/))
      ) {
      var type   = _suff[1],
          id     = _suff[2],
          strip  = _suff[3],
          append = _suff[4],
          cont   = _suff[5] || [],
          match  = _suff[6],
          morph  = _suff[7] || null;
      if (typeof self.affixes[id] == 'undefined') return cb("Unexpected affix id " + id);
      var affix = self.affixes[id];
      if (affix.type != type) return cb("Unexpected affix type " + type);

      var entry = {
        strip:     strip  == '0' ? 0  : strip.length,
        append:    append == '0' ? '' : append,
        continuation: cont,
        condition: new RegExp(affix.type == 'P' ? '^' + match : match + '$')
      };

      affix.entries.push(entry);
    }
  })).on('end', function() {
    var error;
    if (self.encoding === null) error = "No encoding specified.";
    cb(error);
  });
}

function ensureEncoding(cb) {
  var self   = this,
      stream = fs.createReadStream(this.options.path);

  stream.pipe(split())
  .pipe(through(function(line) {
    if (!line.match(/^\s*$|^#/)) this.emit('data', line);
  }))
  .pipe(through(function(line) {
    if (_encoding = line.match(/^SET\s+([.\w\d\-]+)/)) {
       self.encoding = _encoding[1];
       stream.unpipe();
       this.end();
    }
  })).on('end', function() {
    var error;
    if (self.encoding === null) error = "No encoding specified.";
    cb(error);
  });
}

