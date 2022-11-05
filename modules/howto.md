# Making Your Own Quackbot Functionality

Adding your own functionality is intended to be as simple as possible. Here's how to do it in a nutshell:
	
-  Make a new directory here (quackbot/modules); this is where all of your module files will live. For this example, pretend your new module is called "greet".
	
- The `greet` directory can contain whatever your program needs (within reasonable limits- see below) but it *must* contain at least these three files:
		
	- A file called `module.json` containing metadata about your program
		
	- A .py file that will act as the entry point for the main quackbot code to interface with your program. 
		
	- A python requirements file (`requirements.txt`) for your program (*technically optional if your program doesn't use anything outside the python standard library, but a good idea anyway just in case that changes in the future*)

If these components are present, and named and formatted according to the requirements below, everything should Just Work, and quackbot will auto-detect and load your module on its next startup, without requiring you to look at anything outside your module's own directory.

Here's a more in-depth description of each of these components:

## module.json

 `module.json` will look like this:

```
{
  "name": "greet",
  "main": "greet.py",
  "commands": [
    {
      "command": "hello",
      "description": "have quackbot say hi to you"
    },
    {
      "command": "goodbye",
      "description": "have quackbot say goodbye to you"
    }
  ]
}
```

The three required fields are:
- `"name"`: How this program should be referred to. This is how it will appear when a user invokes the `!q list` command to show all loaded modules, for example.
	
- `"main"`: The file that the main quackbot program should import on startup. This should *just* be the file name, not the full path; quackbot is smart enough to look for the main file in the same directory as this `module.json`.
	
- `"commands"`: An array of objects each containing two fields, `"command"` and `"description"`. `"command"` is what the user will type to invoke the command, and `"description"` is how that command will be described in any help text.


## The Main .py File
There's only two strict requirements that the main source file needs to adhere to:
- It should have the same filename as what's specified in the `"main"` field of `module.json`. In this example case, this means it must be named `greet.py`.
	
- It should contain a method called `quack()`, with this prototype:

```
quack(message: discord.Message, command: str)-> dict

```

This is how quackbot will pass message data to your program, and get back the result to display. The `discord.Message` class is described in the [discord.py docs](https://discordpy.readthedocs.io/en/stable/api.html#message). `command` is just a string corresponding to which of the commands in `module.json` prompted this function call. 

`quack()` should return a dictionary with keys representing the parameters of the [`discord.abc.Messageable.send()` method](https://discordpy.readthedocs.io/en/stable/api.html#discord.abc.Messageable.send).  Here's how this would look for the example `greet.py`:


```

# a simple example to show how to write a module for quackbot

import discord, sys
def hello() -> str:  # type annotations strongly encouraged
	return "Hello!"

def goodbye() -> str:
	return "Goodbye!"

# these function definitions seem like overkill for something so simple,
# but they're meant to illustrate how quack() should act as a "metafunction"
# that parses and organizes data from other parts of the program

def quack(message: discord.Message, command: str) -> discord.Message:

	match command.lower():
		case "hello":
			reply_text = hello()
		case "goodbye":
			reply_text = goodbye()

	reply_message = {'content': reply_text}
	return reply_message

```

## requirements.txt
This is a [general Python ecosystem thing](https://docs.python.org/3/tutorial/venv.html#managing-packages-with-pip) and not specifically related to quackbot, so I won't dwell on it. 

One thing to note, though, is you don't need to include `discord` in your requirements, since every module must have it to work anyway. Including `discord` won't hurt anything, though.


## Other Files
If your module directory has those three files, and those files conform to the requirements described above, you're golden! You're free to add whatever other stuff your program needs to function, *however...*

- GitHub's limit for single files is 50MB. Please try to stay below this. If for some reason you absolutely need to generate a larger file at runtime, add it to a local `.gitignore` within your module directory.
	
- Relatedly, be sure to include in `.gitignore` any files containing user-specific data. You can take advantage of quackbot's persistant memory to allow users to, for example, maintain a personal to-do list, but this data should be guarded against being accidentally pushed to the upstream repository.
	
- Be considerate of bandwidth. Quackbot is designed primarily for simple text and image based interactions. If you add a feature that means it's frequently sending and receiving large files, hosting costs on my end will go up and I may have to remove your module. 
	
- While the main file (containing the `quack()` method) must be in Python, you're free to use other languages in other files. However, if those files require external library modules, keep in mind that this is supported *only* for Python. (i.e. you can use Javascript if you really want, but only if it interfaces cleanly with the main .py file, and external `npm` stuff is off the table)
	
- Try to keep your directory somewhat organized. You're free to make subdirectories as you see fit to store related files (but the three required files must be in the top level module directory) 


## Other Stuff to Keep in Mind

Quackbot is licensed under [the GNU General Public License v3 (GPL3)](https://www.gnu.org/licenses/gpl-3.0.en.html), and so by extension is any code you contribute to it (unless you include a `LICENSE.md` in your module folder with another compatible license, like the [Apache License](https://www.apache.org/licenses/LICENSE-2.0.html)).

I shouldn't have to say this, but I will anyway to cover my bases: **for the love of Christ, do not add a function that breaks discord TOS.**  


