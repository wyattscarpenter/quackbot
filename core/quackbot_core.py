import discord, json, os, argparse, re
import importlib
import sys


parser = argparse.ArgumentParser()
parser.add_argument(
    "-v", "--verbose", help="Enable verbose console output", action="store_true"
)

args = parser.parse_args()

verbose = args.verbose

config = {}
with open("config.json", "r") as config_file:
    config = json.load(config_file)

if args.verbose:
    print("Loaded config.json")

# initialize the root directory
os.chdir("..")
root_directory = os.getcwd()
if verbose:
    print("Initialized root directory to '{}'".format(root_directory))


def load_module_metadata() -> dict:
    # load modules
    modules_directory = "{}/modules".format(str(root_directory))
    modules_locations = os.listdir(modules_directory)

    if verbose:
        print("Checking module directory '{}'".format(modules_directory))
        print("Checking for module metadata...")

    module_configs = {}

    for m in modules_locations:
        json_filepath = "{}/{}/module.json".format(modules_directory, m)
        if not os.path.isfile(json_filepath):
            continue

        with open(json_filepath, "r") as json_file:
            json_obj = json.load(json_file)
            json_obj["directory"] = m
            module_configs[json_obj["name"]] = json_obj

            if verbose:
                print("\tLoaded metadata for '{}'".format(json_obj["name"]))
                if "description" in json_obj.keys():
                    print("\tDescription: '{}'".format(json_obj["description"]))

    return module_configs


def load_modules(module_configs: dict) -> dict:

    print(module_configs)
    for key in module_configs.keys():
        import_name = module_configs[key]["main"]
        import_dir = module_configs[key]["directory"]

        import_filepath = "{}/modules/{}/{}".format(
            root_directory, import_dir, import_name
        )

        try:

            loader = importlib.machinery.SourceFileLoader(import_name, import_filepath)  # type: ignore
            spec = importlib.util.spec_from_loader(import_name, loader)  # type: ignore
            module = importlib.util.module_from_spec(spec)  # type:ignore

            module_configs[key]["module"] = module

            os.chdir("{}/modules/{}".format(root_directory, import_dir))
            spec.loader.exec_module(module)
            sys.modules[key] = module
            os.chdir(root_directory)

            if verbose:
                print(
                    "Successfully loaded module '{}'".format(
                        module_configs[key]["name"]
                    )
                )

        except Exception as e:
            print(
                "Failed to load module '{}'- an exception occured\n\t{}".format(
                    import_name, str(e)
                )
            )
            continue

    return module_configs


# TODO refactor for readability
def gen_commands_index(module_data: dict) -> dict:
    commands = {}

    for m in module_data.keys():

        if not "commands" in module_data[m]:
            continue
        for command in module_data[m]["commands"]:
            c = command["command"]
            commands[c] = m

    if verbose:
        print("Updated the commands index:")
        for c in commands:
            print("\t{} - {}".format(c, commands[c]))

    return commands


def parse_message(
    message: discord.Message, commands_index: dict
) -> tuple[str, str, str]:

    message_content = message.content[2:]  # to remove the !q
    first_word_match = re.search(r"\w+", message_content)

    if not first_word_match or first_word_match is None:
        raise AttributeError(
            "No command could be parsed from the invocation '{}'".format(
                message.content
            )
        )

    first_word = first_word_match.group(0).lower()

    if first_word == "help":
        return ("help", "help", "")

    if not first_word in commands_index:
        raise KeyError(
            "Command '{}' was not found for any loaded module".format(first_word)
        )

    message_args = re.sub(r"\w+", "", message_content)

    module_name: str = commands_index[first_word]

    return (module_name, first_word, message_args)


def call_module(
    message: discord.Message, module_name: str, command: str, command_args: str
) -> dict:

    try:
        m = sys.modules[module_name].quack(
            message=message, command=command, command_args=command_args
        )

        if verbose:
            print(
                "Called the module '{}' with command '{} {}' and received a reply:\n\t{}".format(
                    module_name, command, command_args, str(m)
                )
            )
        return m

    except Exception as e:
        print(
            "Failed to invoke module '{}' with command '{}'- an exception occured\n\t{}".format(
                module_name, command, str(e) + " (in call_module())"
            )
        )

        # yes, I am raising an exception from inside an except block
        # is this ok? who is to say. certainly not god
        raise AssertionError


def print_help(module_data: dict) -> str:
    help_str = "Quackbot v.2.0 \nThe following commands are loaded and ready:\n"
    for module in module_data:
        help_str += "**{}:**\n".format(module_data[module]["name"])
        module_commands = module_data[module]["commands"]
        for command in module_commands:
            help_str += "\t`{}:`{}\n".format(command["command"], command["description"])

    return help_str


######################


module_data = load_module_metadata()
if verbose:
    print("\nLoading modules...\n")
modules_index = load_modules(module_data)
commands_index = gen_commands_index(modules_index)


intents = discord.Intents.default()
intents.message_content = True

testmode = False
activity_playing = "in a pond" if not testmode else "in dev only mode"

print("\n\t\t****************************\n")

client = discord.Client(intents=intents, activity=discord.Game(name=activity_playing))


@client.event
async def on_message(message):
    if message.author == client.user or not message.content.startswith("!q"):
        return

    message_args = parse_message(message, commands_index)

    if verbose:
        print("\nReading message:\n\t{}".format(message.content))

    if not message_args:
        if verbose:
            print("\tCould not parse message")
        return

    command_module, command_name, command_args = message_args
    try:

        if command_module is "help":
            help_reply = {"content": print_help(modules_index)}
            await message.channel.send(**help_reply)
            return

        module_folder = modules_index[command_module]["directory"]

        # set the working directory to the module's directory
        # this is so code within each module can use paths relative to that directory, and not absolute paths
        module_path = "{}/modules/{}".format(root_directory, module_folder)

        os.chdir(module_path)
        reply = call_module(message, command_module, command_name, command_args)

        os.chdir(root_directory)

        if not reply:
            raise Exception("Module returned NoneType")

    except Exception as e:

        print("Error sending message")
        reply = {
            "content": "Error: bad reply from a module. Please tell the module creator that this went wrong:\n\t{}".format(
                str(e)
            )
        }

    # send the message described by the return dict
    await message.channel.send(**reply)


client.run(config["token"])
