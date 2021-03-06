"use strict";
var __importDefault = (this && this.__importDefault) || function (mod) {
    return (mod && mod.__esModule) ? mod : { "default": mod };
};
Object.defineProperty(exports, "__esModule", { value: true });
const fs_1 = __importDefault(require("fs"));
exports.deleteFile = (filePath) => {
    console.log("TCL: deleteFile -> filePath", filePath);
    fs_1.default.unlink(filePath, (err) => {
        if (err) {
            throw err;
        }
    });
};
//# sourceMappingURL=file.js.map