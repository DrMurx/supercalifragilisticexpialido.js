var optimist = require('optimist'),
 argv = optimist
 .usage('Usage: $0 --aff [affixFile.aff]')
 .demand(['a'])
 .alias('a', 'aff')
 .describe('a', '.aff (Hunspell affix) file to load')
 .argv,
 AffixParser = require('./src/hunspell/affix').AffixParser;

affixParser = new AffixParser({path: argv.aff});

affixParser.parse(function(err){
  if (err) return console.error(err);
  console.log(affixParser.affixes);
});
