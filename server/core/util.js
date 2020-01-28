function encode(functionId, ...params) {
    return JSON.stringify({
        id: functionId,
        params
    });
}

module.exports = {encode};