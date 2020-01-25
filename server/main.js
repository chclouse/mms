const WebServer = require('./core/server.js')

function main() {
	myServe = new WebServer.Server(8763);
	myServe.run();
}

main()
