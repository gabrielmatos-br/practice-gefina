import { createServer } from 'node:http';

createServer(function (request, response) {
    if (request.url !== '/health') {
        response.writeHeader(404, { 'content-type': 'application/json' });
        response.end(JSON.stringify({ message: 'Página não encontrada.' }));
        return;
    }
    response.writeHeader(200, { 'content-type': 'application/json' });
    response.end(JSON.stringify({ status: 'ok' }));
}).listen(3000);