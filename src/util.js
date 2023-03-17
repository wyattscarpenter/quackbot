"use strict";
Object.defineProperty(exports, "__esModule", { value: true });
exports.secrets = exports.secretPath = exports.rootDir = exports.QuackClient = exports.makeQuackCommand = void 0;
const path = require("path");
const filesystem = require("fs");
const discord_js_1 = require("discord.js");
function makeQuackCommand(name, description, exec) {
    return {
        data: new discord_js_1.SlashCommandBuilder().setName(name).setDescription(description),
        execute: exec,
    };
}
exports.makeQuackCommand = makeQuackCommand;
class QuackClient extends discord_js_1.Client {
}
exports.QuackClient = QuackClient;
exports.rootDir = (() => {
    let checkDir = path.resolve('.');
    const pathsep = path.sep;
    const fullPath = path.resolve('.').split(pathsep).reverse();
    for (const _ of fullPath) {
        const dirContents = filesystem.readdirSync(checkDir);
        if (dirContents.includes('package.json')) {
            return checkDir;
        }
        checkDir = path.join(checkDir, '..');
    }
    throw new Error("Can't find the project root");
})();
exports.secretPath = path.join(exports.rootDir, './secret.json');
exports.secrets = require(exports.secretPath);
