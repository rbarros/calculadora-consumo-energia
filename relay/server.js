const http = require("http");
const Gun = require("gun");

const port = process.env.PORT || 8765;
const server = http.createServer(Gun.serve(__dirname));

Gun({ web: server.listen(port) });

console.log(`Relay Gun ouvindo na porta ${port} — endpoint em /gun`);
