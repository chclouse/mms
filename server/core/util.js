function encode(functionId, ...params) {
    return JSON.stringify({
        id: functionId,
        params
    });
}

function indexOfFlag(flags, row, col) {
	for (let i = 0; i < flags.length; i++) {
		let flag = flags[i]
		if (flag[0] === row && flag[1] === col) {
			return i;
		}
	}
	return -1;
}

module.exports = {encode, indexOfFlag};