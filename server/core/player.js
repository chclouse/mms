
class Player {
	id;
	state;
	gameId;
	name;
	interval;
	sock;

	update(message) {

	}
	
	encode(functionId, ...params) {
		return JSON.stringify({
			id: functionId,
			params
		});
	}
}

module.exports = {Player}
