var fs    = require('fs'),
  Iconv   = require('iconv').Iconv;
  split   = require('split'),
  through = require('through');


/**
 * @class AffixParser
 */
module.exports.AffixParser = AffixParser = function(options) {
  this.options = options;
  this.affixes = {};
  this.encoding = 'ISO8859-1';
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

  fs.createReadStream(self.options.path, {
    encoding: 'binary'
  })
  .pipe(Iconv(self.encoding, 'UTF-8'))
  .pipe(split())
  .pipe(through(function(line) {
    if (!line.match(/^\s*$|^#/)) this.emit(line);
  }))
  .pipe(through(function(line) {
    if (_suff = line.match(/^([SP])FX\s+(\w)\s+(\w)\s+(\d+)/)) {
      var id = _suff[2];
      self.affixes[id] = {
        type:    _suff[1],
        cross:   _suff[3] == 'Y',
        entries: []
      };
      affixCnt = _suff[4];
      return;
    }
    if (_suff = line.match(/^([SP])FX\s+(\w)\s+(\w+|0)\s+(\w+)\s+([\]\[\w\.^]+)/)) {
      var id = _suff[2];
      if (typeof self.affixes[id] == 'undefined') return cb("Unexpected affix id " + _suff[2]);
      if (self.affixes[id].type != _suff[1]) return cb("Unexpected affix type " + _suff[1]);

      self.affixes[id].entries.push({
        strip: _suff[3] == '0' ? null : _suff[3],
        append: _suff[4],
        condition: _suff[5]
      });
    }
  })).on('end', function() {
    var error;
    if (self.encoding === null) error = "No encoding specified.";
    cb(error);
  });
}

function ensureEncoding(cb) {
  var self = this;
  fs.createReadStream(this.options.path, {
    encoding: 'ascii'
  })
  .pipe(split())
  .pipe(through(function(line) {
    if (!line.match(/^\s*$|^#/)) this.emit(line);
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

