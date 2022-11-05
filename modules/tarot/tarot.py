import json, random, os, re
import discord
from thefuzz import process


##TODO
#calling with args like major/minor not working

# when cards invert 50% of the time, it *feels* like they invert too often
# so we can set the chance for a given drawn card to be inverted here
INV_CHANCE = 0.4
MAJOR_CHANCE = (
    22 / 76
)  # chance of drawing a major arcana, if drawing from the whole deck.
# 22/76 simulates an actual deck, but this can be any value 0-1


random.seed()

with open("cards.json", "r") as cards_file:
    cards = json.load(cards_file)


# get a list of just card names
# this is needed since major and minor arcana are stored in different json sub-objects
# and accessing all card names quickly is a pain

card_names = list([m.keys() for m in cards.values()])
card_names = list(card_names[0]) + list(card_names[1])


def draw_card(deck: str = "all") -> dict:
    deck = deck.lower()
    # if a deck was not specified, pick one randomly
    # odds of picking from the major arcana is defined by MAJOR_CHANCE
    if not deck in cards.keys():
        deck = "major" if random.random() < MAJOR_CHANCE else "minor"

    selected_deck = cards[deck]

    selected_card_key = random.choice(list(selected_deck))

    selected_card = selected_deck[selected_card_key]
    inverted = random.random() < INV_CHANCE

    selected_card_title = selected_card["title"]

    if inverted:
        selected_card_title += " (Inverted)"

    selected_card_meaning = (
        selected_card["reversed"] if inverted else selected_card["meaning"]
    )

    image_path = get_card_image_path(selected_card, inverted=inverted)

    image_file_obj = discord.File(image_path)

    message_text = "**{}**\n*{}*".format(
        selected_card_title.title(), selected_card_meaning
    )

    print(message_text)

    return {"content": message_text, "file": image_file_obj}


def get_card_image_path(card: dict, inverted: bool = False) -> str:
    filename = card["image"] if not inverted else card["image_reversed"]
    return os.path.abspath("./card-art/{}".format(filename))


# formats info on the card with the given name as a discord message
# calls parse_cardname to get the nearest fuzzy match
# if the given string does not match any names closely enough, returns None


def print_card(cardname: str) -> dict:  # discord message

    matched_cardname = parse_cardname(cardname)

    if not matched_cardname:
        return {"content": "No matches for '{}'".format(cardname)}

    if matched_cardname in cards["major"]:
        card = cards["major"][matched_cardname]
    else:
        card = cards["minor"][matched_cardname]

    card_image = discord.File(get_card_image_path(card))

    title = card["title"]
    description = card["description"]
    meaning = card["meaning"]
    meaning_reversed = card["reversed"]

    message_content = """
	**{}**

	**Description:** *{}*

	**Divinatory Meaning:** {}

	**Reversed Meaning:** {}
	""".format(
        title.title(), description, meaning, meaning_reversed
    )

    return {"content": message_content, "file": card_image}


# uses fuzzy string matching to get the best valid card option from the user search
def parse_cardname(search_str: str, threshold: int = 70) -> str:
    chosen, rank = process.extractOne(search_str, card_names)  # type: ignore
    return chosen if rank > threshold else ""


# the wrapper to integrate with the main quackbot file
def quack(
    message: discord.Message,
    command: str = "tarot",
    str_message: str = "",
    command_args: str = "",
) -> dict:

    # remove the first word of the message to get the args
    args = command_args.split(" ")

    # split the input into the command and any other text
    lead_arg = args[1].lower()
    tail_args = " ".join(args[1:])

    # when no command argument is matched, just draw a random card
    if not lead_arg or lead_arg not in ("major", "minor", "search"):
        return draw_card()

    # if the arg specifies a deck to draw from
    if lead_arg in ("major", "minor"):
        return draw_card(lead_arg)

    elif lead_arg == "search":
        if tail_args:
            return print_card(tail_args)
    else:
        return {"content": "Use '!q tarot search <cardname>' to search for a card"}

    assert False
    return draw_card()
