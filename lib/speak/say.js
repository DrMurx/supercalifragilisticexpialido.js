var exec = require('execSync').exec,
    _    = require('underscore');

var allVoices = {
  'ar': ['Maged'],
  'cs': ['Zuzana'],
  'de': ['Yannick'], // 'Anna', 'Steffi'
  'da': ['Ida'],
  'el': ['Melina'], // 'Alexandros'
  'en': ['Tom'], // 'Jill', 'Samantha'
  'es': ['Monica'], // 'Diego'
  'fr': ['Thomas'], // 'Sebastien', 'Audrey', 'Virginie'
  'fi': ['Mikko'],
  'hu': ['Eszter'],
  'it': ['Alice'], // 'Silvia', 'Paolo'
  'ko': ['Narae'],
  'la': ['Yannick'],
  'ms': ['Damayanti'],
  'nl': ['Clair'], // 'Xander', 'Clair'
  'no': ['Stine'],
  'pl': ['Agata'],
  'pt': ['Raquel'],
  'ro': ['Simona'],
  'ru': ['Milena'],
  'sk': ['Laura'],
  'sv': ['Alva'], // 'Alva', 'Oskar'
  'th': ['Narisa'],
  'tr': ['Aylin']
};

var allSpeeds = {
  'ar': 170,
  'cs': 140,
  'fi': 190,
  'fr': 150,
  'hu': 140,
  'it': 140,
  'pl': 140,
  'pt': 140,
  'ro': 150,
  'sv': 140,
  'th': 160,
  'tr': 150,
  'Alva': 150,
  'Xander': 120,
  'Yannick': 170,
  '*': 130
};


module.exports = function(word, lang) {
  var voices = allVoices[_([lang, lang.split('_')[0], 'en']).find(function(el) { return typeof allVoices[el] != 'undefined' })],
      voice  = voices[Math.floor(Math.random() * voices.length)],
      speed  = allSpeeds[_([voice, lang, '*']).find(function(el) { return typeof allSpeeds[el] != 'undefined' })];

  exec("/usr/bin/say --voice=" + voice + " --rate=" + speed + " \"" + word + "\" 2>/dev/null");
}
