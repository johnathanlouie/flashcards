function main(header) {
    var wholeValid = true;
    for (let i of header) {
        let oneValid = false;
        if (/^term\[\d\]\.form\[\d\]$/.test(i)) {
            oneValid = true;
        } else if (/^term\[\d\]\.pronunciation\[\d\]$/.test(i)) {
            oneValid = true;
        } else if (/^definition\[\d\]\.partOfSpeech\[\d\]$/.test(i)) {
            oneValid = true;
        } else if (/^definition\[\d\]\.meaning\[\d\]$/.test(i)) {
            oneValid = true;
        } else if (/^index\[\d\]\.chapter$/.test(i)) {
            oneValid = true;
        } else if (/^index\[\d\]\.termNumber$/.test(i)) {
            oneValid = true;
        }
        wholeValid = wholeValid && oneValid;
    }
    return wholeValid;
}

module.exports = main;