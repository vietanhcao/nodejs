import http from "http";
import router  from './router';
    

const server = http.createServer(router);

server.listen(3001);