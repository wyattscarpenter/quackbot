import { rootDir } from "../util";
import path = require("node:path");

interface CardData {
  title: string;
  description: string;
  meaning: string;
  reversed: string;
  image: string;
  image_reversed: string;
}

interface Card {
  title: string;
  description: string;
  meaning: string;
  image: string;
}

const cards = require(path.join(rootDir, "data", "cards.json"));

const unwrapDeck = (obj: object) => {
  return Object.entries(obj).map((i) => i[1]);
};

const majorDeck: Array<CardData> = unwrapDeck(cards.major);
const minorDeck: Array<CardData> = unwrapDeck(cards.minor);
const completeDeck = majorDeck.concat(minorDeck);

function drawFromDeck(deck: Array<CardData>, reversedChance = 0.3): Card {
  const randChoice = Math.floor(Math.random() * deck.length);

  const drawnCardData = deck[randChoice];

  const reversed: boolean = Math.random() < reversedChance;

  const [meaning, image] = reversed
    ? [drawnCardData.reversed, drawnCardData.image_reversed]
    : [drawnCardData.meaning, drawnCardData.image];

  const title = drawnCardData.title + (reversed ? " (reversed)" : "");
  const description: string = drawnCardData.description;

  return { title, description, meaning, image };
}

export const drawMajor = () => drawFromDeck(majorDeck);
export const drawMinor = () => drawFromDeck(minorDeck);
export const drawCard = () => drawFromDeck(completeDeck);
