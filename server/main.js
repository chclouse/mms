const WebServer = require('./webserver');
const WebSocketServer = require('./core/server');

function main() {
	WebServer.serve(3000);
	socketServer = new WebSocketServer.Server(8763);
	socketServer.run();
}

main();
