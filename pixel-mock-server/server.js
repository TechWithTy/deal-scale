const http = require("node:http");
const fs = require("node:fs");
const path = require("node:path");

const PORT = 3030;

// Store events in a log file for later inspection
const logFile = path.join(__dirname, "logs.json");

function saveEvent(data) {
	const logs = fs.existsSync(logFile)
		? JSON.parse(fs.readFileSync(logFile, "utf-8"))
		: [];
	logs.push({ timestamp: Date.now(), ...data });
	fs.writeFileSync(logFile, JSON.stringify(logs, null, 2));
	console.log("📩 Pixel Event Captured:", data.event_name);
}

const server = http.createServer((req, res) => {
	// Handle CORS for local development
	const headers = {
		"Content-Type": "application/json",
		"Access-Control-Allow-Origin": "*",
		"Access-Control-Allow-Methods": "POST, OPTIONS",
		"Access-Control-Allow-Headers": "Content-Type",
	};

	if (req.method === "OPTIONS") {
		res.writeHead(200, headers);
		return res.end();
	}

	if (req.method === "POST" && req.url.includes("/pixel")) {
		let body = "";

		req.on("data", (chunk) => {
			body += chunk.toString();
		});

		req.on("end", () => {
			try {
				const parsed = JSON.parse(body || "{}");
				saveEvent(parsed);
				res.writeHead(200, headers);
				return res.end(JSON.stringify({ status: "mock_received" }));
			} catch (error) {
				console.error("Error parsing pixel event:", error);
				res.writeHead(400, headers);
				return res.end(JSON.stringify({ error: "Invalid JSON" }));
			}
		});
	} else {
		res.writeHead(404, headers);
		res.end("not found");
	}
});

server.listen(PORT, () => {
	console.log(
		`🔥 Mock FB Pixel server running → http://localhost:${PORT}/pixel`,
	);
});
