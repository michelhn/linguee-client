const Extractor = require("./Extractor");

class AudioExtractor extends Extractor {
  constructor(extractors = {}) {
    super(extractors);
  }
  _setStorageDefaults() {
    this.storage.audio = [];
    this.domain = "https://www.linguee.com";
  }
  _extract() {
    const regExp = /^playSound\(this,(".*")\);/;
    const onClick = this.content.attr("onclick");

    if (!onClick) return false;

    const regExpResult = onClick.match(regExp);

    if (!regExpResult) return false;

    const parts = regExpResult[1].replace(/"/g, "").split(",");

    for (let i = 0; i < parts.length / 2; i++) {
      let b = 2 * i;

      this.storage.audio.push({
        url: `${this.domain}/mp3/${parts[b]}.mp3`,
        version: parts[b + 1]
      });
    }
  }
}

module.exports = AudioExtractor;