# a simple example to show how to write a module for quackbot

import discord, sys, os
import importlib.util

def hello() -> str:  # type annotations strongly encouraged
	return "Hello!"

def goodbye() -> str:
	return "Goodbye!"

# these function definitions seem like overkill for something so simple,
# but they're meant to illustrate how quack() should act as a "metafunction"
# that parses and organizes data from other parts of the program

def wave():
	print("Hi!")


def quack(message: discord.Message, command: str) -> discord.Message:

	match command.lower():
		case "hello":
			reply_text = hello()
		case "goodbye":
			reply_text = goodbye()

	reply_message = {}
	reply_message["content"] = reply_text
	return reply_message
