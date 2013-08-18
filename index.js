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
  AffixParser = require('./src/hunspell/affix').AffixParser,
  DictParser = require('./src/hunspell/dict').DictParser,
  util = require('util'),
  FreqAnal = require('./src/frequencyanalyzer').FrequencyAnalyzer;

if (argv.help) {
  optimist.showHelp();
  process.exit(0);
}

affixParser = new AffixParser({path: 'dicts/' + argv.lang + '.aff'});

affixParser.parse(function(err){
  if (err) return console.error(err);

  var dictParser = new DictParser({
    path: 'dicts/' + argv.lang + '.dic',
    encoding: affixParser.encoding,
    affixes: affixParser.affixes
  });

  dictParser.parse(function() {
    if (argv.printwords) dictParser.words.forEach(function (word) {
      process.stdout.write(word + '\n');
    });
    var anal = new FreqAnal();
    console.log(
      util.inspect(
        anal.analyze(dictParser.words, 3), { showHidden: true, depth: null }));
  });
});
