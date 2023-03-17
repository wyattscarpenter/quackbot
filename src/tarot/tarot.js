"use strict";
Object.defineProperty(exports, "__esModule", { value: true });
exports.drawCard = exports.drawMinor = exports.drawMajor = void 0;
const util_1 = require("../util");
const path = require("node:path");
const cards = require(path.join(util_1.rootDir, "data", "cards.json"));
const unwrapDeck = (obj) => {
    return Object.entries(obj).map((i) => i[1]);
};
const majorDeck = unwrapDeck(cards.major);
const minorDeck = unwrapDeck(cards.minor);
const completeDeck = majorDeck.concat(minorDeck);
function drawFromDeck(deck, reversedChance = 0.3) {
    const randChoice = Math.floor(Math.random() * deck.length);
    const drawnCardData = deck[randChoice];
    const reversed = Math.random() < reversedChance;
    const [meaning, image] = reversed
        ? [drawnCardData.reversed, drawnCardData.image_reversed]
        : [drawnCardData.meaning, drawnCardData.image];
    const title = drawnCardData.title + (reversed ? " (reversed)" : "");
    const description = drawnCardData.description;
    return { title, description, meaning, image };
}
const drawMajor = () => drawFromDeck(majorDeck);
exports.drawMajor = drawMajor;
const drawMinor = () => drawFromDeck(minorDeck);
exports.drawMinor = drawMinor;
const drawCard = () => drawFromDeck(completeDeck);
exports.drawCard = drawCard;
