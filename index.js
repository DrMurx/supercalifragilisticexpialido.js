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
  _ = require('underscore'),
  AffixParser = require('./src/hunspell/affix').AffixParser,
  DictParser = require('./src/hunspell/dict').DictParser,
  FreqAnal = require('./src/frequencyanalyzer').FrequencyAnalyzer,
  Generator = require('./src/generator').Generator,
  Say = require('./src/speak/say');

if (argv.help) {
  optimist.showHelp();
  process.exit(0);
}

affixParser = new AffixParser({path: 'dicts/' + argv.lang + '.aff'});

affixParser.parse(function(err){
  if (err) return console.error(err);

  console.log("Loading hunspell dictionary");
  var dictParser = new DictParser({
    path: 'dicts/' + argv.lang + '.dic',
    encoding: affixParser.encoding,
    affixes: affixParser.affixes
  });

  dictParser.parse(function() {
    if (argv.printwords) dictParser.words.forEach(function (word) {
      process.stdout.write(word + '\n');
    });

    var stats = dictParser.getWordStats();

    var anal = new FreqAnal();
    _([3, 4, 5, 6]).each(function(size) {
      console.log("Building tupel list (size " + size + ")...");
      anal.analyze(dictParser.words, size);
    })

    var generator = new Generator(anal.tupelList, dictParser.words);
    while (true) {
      var word = generator.getWord(stats.avg - stats.dev + Math.floor(Math.random() * (2 * stats.dev + 1)));
      console.log(word);
      Say(word, argv.lang);
    }
  });
});
