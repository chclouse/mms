import "./bootstrap";
import { Client } from "./client";
import "./minesweeper";

const PORT = 8765
const SERVERS = [
	"10.82.37.181",
	"10.82.36.172"
]

let c = new Client(SERVERS[1], PORT);

// c.connect();
