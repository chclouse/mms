function encode(functionId, ...params) {
    return JSON.stringify({
        id: functionId,
        params
    });
}

function indexOfFlag(flags, row, col) {
	let i;
	for (i = 0; i < flags.length; i++) {
		if (flags[0] === row || flags[1] === col) {
			break;
		}
	}
	if (i < flags.length) {
		return i;
	} else {
		return -1;
	}
}

module.exports = {encode, indexOfFlag};