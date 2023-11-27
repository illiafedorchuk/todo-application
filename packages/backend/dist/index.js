"use strict";
var __importDefault = (this && this.__importDefault) || function (mod) {
    return (mod && mod.__esModule) ? mod : { "default": mod };
};
Object.defineProperty(exports, "__esModule", { value: true });
const express_1 = __importDefault(require("express"));
// Instantiate express
const app = (0, express_1.default)();
// Define server port
const port = 3200;
// Create a route for the root
app.get("/", (req, res) => {
    res.send("Hello world!");
});
// Start listening to the requests
app.listen(port);
