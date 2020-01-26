import "./bootstrap";
import { Client } from "./client";
import "./minesweeper";

const PORT = 8763
const SERVERS = [
	"10.82.37.181",
	"10.82.36.172",
	"127.0.0.1"
]

let c = new Client(SERVERS[2], PORT);

c.connect();
