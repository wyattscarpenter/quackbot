# Quackbot

**Quackbot** is a Discord bot designed to be easily extensible. It is in a sense an "API for an API." I created it as a common framework on which to hang my assorted utility and joke scripts and allow them to easily be accessed by others inside a Discord server. 

Currently Quackbot includes these features:

  - **Todo**: A wrapper for my other project, [Della](https://github.com/keagud/Della) (which in turn is largely a wrapper for my *other* other project [dateparse.py](https://github.com/keagud/dateparse.py) -- it's a real Matryoshka situation.) See that repo for details, but in a nutshell this allows creating and managing todo items using a syntax that's very close to natural language. 

  - **Memes**: Sometimes you need a specific reaction image and can't spare the time to make one bespoke in GIMP. The Memes module exposes a collection of commands to quickly and automatically place captions on a blank image macro so you never have to stop posting.

  - **Tarot:** Simulates drawing from a Tarot deck, and provides explanitory text on the purported divinatory meaning of your card, drawn from [The Pictoral Key to the Tarot](https://en.wikipedia.org/wiki/The_Pictorial_Key_to_the_Tarot). 


Currently, all these features are things I personally have a use for and/or things I found interesting to make on a pure creative level; the beauty of the modular structure, however, means that adding a new feature is very simple and does not require any direct contact with the "core" bot code whatsoever. See [How To Extend Quackbot](placeholder) in the modules directory for details on how to do this. 
