"use strict";
Object.defineProperty(exports, "__esModule", { value: true });
var dotenv = require("dotenv");
dotenv.config({ path: __dirname + '/../.env' });
var StreamService = /** @class */ (function () {
    function StreamService() {
    }
    return StreamService;
}());
var streamService = new StreamService();
exports.default = streamService;
