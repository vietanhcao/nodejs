"use strict";
var __importDefault = (this && this.__importDefault) || function (mod) {
    return (mod && mod.__esModule) ? mod : { "default": mod };
};
Object.defineProperty(exports, "__esModule", { value: true });
const http_1 = __importDefault(require("http"));
function rqListener(req, res) {
    console.log(req);
}
const server = http_1.default.createServer(rqListener);
server.listen(3000);
