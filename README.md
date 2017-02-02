# supercalifragilisticexpialido.js

A multi-language fantasy word generator

## Usage

1. `npm install`
2. Download a hunspell dictionary (both the `.dic` and `.aff` file) to the `dicts/` folder. 
3. `node index.js -l <locale>`, whereas `locale` is the language version you've downloaded (defaults to `en_US`).
4. Wait for the dictionary being loaded and analyzed.
5. Have tons of funny words generated.

```
npm install
wget -P dicts https://cgit.freedesktop.org/libreoffice/dictionaries/plain/en/en_US.dic https://cgit.freedesktop.org/libreoffice/dictionaries/plain/en/en_US.aff
node index.js -l en_US
```

On a MacOS device, turn on speakers. If you have the proper voices installed, you'll hear an attempt to pronounce what you see.

## Examples

```
irrelectic
dishtown
hollagram
ghostling
breastinator
amnesiastic
paralyticity
discrimity
gradualize
microhydrate
bullshittery
abdomidity
Leningrator
dumbskin
peninsurance
dullaby
soltuperey
viscountable
decidify
eternation
snappearean
earpine
mistancher
beefinald
spreadshrine
dogtrotter
fragmentator
```

Admittedly, I find the German words usually more funny.

## How it works

Based on the dictionary, supercalifragilisticexpialido.js creates a statistic on the frequency of letter sequences (3-6 letters) and generates new words based in this information. See [Marcov chain](https://en.wikipedia.org/wiki/Markov_chain) for more information about the maths.



## Why the name?

''Supercalifragilisticexpialidocious'' is a song from the 1960th Disney movie [Mary Poppins](https://en.wikipedia.org/wiki/Mary_Poppins_(film)). According to the Wikipedia entry for [Supercalifragilisticexpialidocious](https://en.wikipedia.org/wiki/Supercalifragilisticexpialidocious), the word itself might even be older. In the movie, its meaning is explained as "something to say when you have nothing to say".

On [JSConf EU 2012](http://2012.jsconf.eu), [Mandy Lauderdale](https://en.wikipedia.org/wiki/Mandy_Lauderdale) and [Jed Schmidt](http://jed.is) performed an incredibly funny medley of popular songs with rewritten JS themed lyrics. Enjoy this [JavaScript Medley on Youtube](https://www.youtube.com/watch?v=o7OE1uas2yg), it's 8 minutes of great exercise your laugh muscles.

This medley featured ''supercalifragilisticexpialido.js'', and that's where I shamelessly took the name for this project.

## Copyright & License

AGPLv3. See [LICENSE](LICENSE).

(c) 2013-2017 Jan Kunzmann <jan-github@phobia.de> & Contributors
