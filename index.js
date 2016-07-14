var optimist = require('optimist')
    .usage('Usage: $0 --lang [en_US]')
    .demand(['l'])
    .alias('l', 'lang')
    .describe('l', 'Language to load')
    .default('l', 'en_US')
    .describe('help', 'Show this help')
    .alias('c', 'config')
    .describe('c', 'Config YML file'),
  argv = optimist.argv,
  util = require('util'),
  _    = require('underscore'),
  XRegExp   = require('xregexp').XRegExp,
  Hunspell  = require('node-hunspell').Reader,
  Analyzer  = require('./lib/frequencyanalyzer').FrequencyAnalyzer,
  Generator = require('./lib/generator').Generator,
  Say       = require('./lib/speak/say');

if (argv.help) {
  optimist.showHelp();
  process.exit(0);
}


var hunspell = new Hunspell('dicts/' + argv.lang + '.dic');
var anal     = new Analyzer();


var words = [];

var cnt = 0,
    sum = 0,
    min = 9999,
    max = 0,
    avg = 0,
    dev = 0;

hunspell.on('data', function(word) {
  word = word.word;

  anal.analyze([word], [3, 4, 5, 6]);
  words.push(word.toLowerCase());

  var len = word.length;
  if (len < 3) return;
  cnt++;
  sum += len;
  min =  Math.min(min, len);
  max =  Math.max(max, len);
  avg =  Math.round(sum / cnt); // rolling avg
  dev += Math.pow(len - avg, 2); // rolling deviation
});




hunspell.load(function() {
  if (argv.printwords) dictParser.words.forEach(function (word) {
    process.stdout.write(word + '\n');
  });

  var stats =  {
    'min': min,
    'max': max,
    'avg': avg,
    'dev': Math.ceil(Math.sqrt(dev / cnt))
  };

  var generator = new Generator(anal.tupelList, words);

  var generateAndSay = function () {
    var word = generator.getWord(stats.avg - stats.dev + Math.floor(Math.random() * (2 * stats.dev + 1)), [3, 4, 5, 6]);
    console.log(word);
    Say(word, argv.lang, generateAndSay);
  }

  generateAndSay();
});
