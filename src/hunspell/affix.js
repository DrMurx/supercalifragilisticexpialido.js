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
    if (_suff = line.match(/^([SP])FX\s+([\w\d]+)\s+(\w)\s+(\d+)/)) {
      var id = _suff[2];
      self.affixes[id] = {
        type:    _suff[1],
        cross:   _suff[3] == 'Y',
        entries: []
      };
      affixCnt = _suff[4];
      return;
    }
    if (_suff = line.match(/^([SP])FX\s+([\w\d]+)\s+(\pL+|0)\s+(\pL+)\s+([\]\[\pL\.^]+)/)) {
      var id = _suff[2];
      if (typeof self.affixes[id] == 'undefined') return cb("Unexpected affix id " + _suff[2]);
      var affix = self.affixes[id];
      if (affix.type != _suff[1]) return cb("Unexpected affix type " + _suff[1]);

      affix.entries.push({
        strip: _suff[3] == '0' ? 0 : _suff[3].length,
        append: _suff[4],
        condition: new RegExp(affix.type == 'P' ? '^' + _suff[5] : _suff[5] + '$')
      });
    }
  })).on('end', function() {
    var error;
    if (self.encoding === null) error = "No encoding specified.";
    cb(error);
  });
};

function ensureEncoding(cb) {
  var self = this;
  fs.createReadStream(this.options.path)
  .pipe(split())
  .pipe(through(function(line) {
    if (!line.match(/^\s*$|^#/)) this.emit('data', line);
  }))
  .pipe(through(function(line) {
    if (_encoding = line.match(/^SET\s+([.\w\d\-]+)/)) {
       self.encoding = _encoding[1];
    }
  })).on('end', function() {
    var error;
    if (self.encoding === null) error = "No encoding specified.";
    cb(error);
  });
}

