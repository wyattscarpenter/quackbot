# generates maymayes by putting text on a template


# TODO implement rdj and yud

import os, random

from PIL import Image, ImageDraw
from PIL.Image import Image as Image_Type
from PIL.ImageDraw import ImageDraw as Draw_Type
from PIL.ImageFont import FreeTypeFont, truetype

from itertools import cycle

from typing import Union
import discord


def make_font(font_file: str, size: int):
    return truetype("fonts/{}".format(font_file), size)


default_fontsize = 14
default_sans_fontfile = "IBMPlexSans-Bold.ttf"

default_serif_fontfile = "IBMPlexSerif-SemiBold.ttf"
default_fontfile = default_sans_fontfile

default_font = make_font(default_fontfile, default_fontsize)


default_caption_fill = "black"

global_templates = {
    "rdj": "rdj.png",
    "clueless": "clueless.png",
    "yud": "yud.png",
    "ahsweet": "ahsweet.png",
}


default_image_x_scale, default_image_y_scale = 100, 100
default_text_location = (0, 0)


def unionlen(expr: Union[str, int]) -> int:
    return expr if isinstance(expr, int) else len(expr)


class Image_Text:
    """
    Defines the properties of the text for a given image macro
    Members:
            location: Tuple representing the (x,y) coordinates of the top left corner of the text box
            text: The actual text to be displayed
            width: Maximum line width before a line break is inserted. Defaults to 22 characters
            font: A PIL.ImageFont.FreeTypeFont instance, defaults to IBM Plex Sans Bold 14 pt
            fill: Tuple of RGB values for text color, defaults to black (0,0,0).

    Methods:
            trim_to_width(): Returns self.text with linebreaks inserted. Takes an optional int or string parameter as the cutoff length; if not given defaults to self.width
    """

    def __init__(
        self,
        location: tuple[float, float],
        text: str = "",
        width: Union[int, str] = "denounced in the senat",
        font: FreeTypeFont = default_font,
        fill: str = default_caption_fill,
    ) -> None:

        self.location = location
        self.text = text
        self.width: int = unionlen(width)
        self.trim_to_width()

        self.font = font
        self.fill = fill

    def trim_to_width(self, width: Union[int, str] = "") -> None:

        """
        Inserts linebreaks into the text so that no line is longer than [width] characters
        Width can be given as an int, or as a string (using its length)
        Will not break in the middle of a word.
        """

        if width:
            self.width = unionlen(width)

        formatted: list[str] = []
        char_count: int = 0
        words: list[str] = self.text.split(" ")

        for word in words:
            char_count += len(word) + 1

            if char_count > self.width:
                char_count = len(word) + 1
                word += "\n"

            formatted.append(word)

        self.formatted_text = " ".join(formatted)


class Maymay:

    # TODO documentation
    """
    Class representing an abstracted image macro
    """

    def __init__(
        self,
        template_name: str = "",
        image_path: str = "",
        caption_text: str | list[str] = "",
        image_captions: list[Image_Text] = [],
        default_font: FreeTypeFont = default_font,
    ) -> None:

        self.template_name = template_name
        self.templates_dir = "{}/templates".format(os.getcwd())
        self.default_font = default_font

        self.image_captions = image_captions

        self.image: Image_Type
        self.image_draw: Draw_Type

        if template_name in global_templates:
            self.image_filename = global_templates[template_name]
            self.template_filepath = "{}/{}".format(
                self.templates_dir, self.image_filename
            )

        elif image_path:
            self.template_filepath = image_path

        else:
            self.template_filepath = ""
            return

        self.saved_image_path = "generated/generated_{}".format(self.image_filename)

        self.load_image()

        if caption_text and caption_text != [""]:
            self.fill_captions(caption_text)


    def load_image(self, path: str = ""):
        """Loads an image from filepath as an Image object, and sets image and image_draw attributes to it."""
        if not path:
            path = self.template_filepath

        try:
            self.image = Image.open(path)
            self.image_draw = ImageDraw.Draw(self.image)

        except (FileNotFoundError):

            print("Unable to open image path: {}".format(path))

    def draw_caption(self, caption: Image_Text):
        """Draws a caption on the image"""
        self.image_draw.text(
            caption.location,
            caption.formatted_text,
            font=caption.font,
            fill=caption.fill,
        )

    def draw_all_captions(self) -> None:
        """Draws all non-empty captions on the image. Called at init time."""

        for caption in filter(lambda c: c.formatted_text, self.image_captions):
            self.draw_caption(caption)

    def rescale(self, x_scale: float, y_scale: float) -> None:
        """
        Rescales the image width and height by x_scale and y_scale
        For example, rescale(1.5, 1) will increase the width by 50%.
        """

        width, height = self.image.size
        self.image = self.image.resize((int(x_scale * width), int(y_scale * height)))

    def save_image(self) -> None:
        if self.image:
            self.image.save(self.saved_image_path)
            return

        raise AttributeError(
            "An image for this object instance must be defined and loaded before it can be saved"
        )

    def discord_file(self) -> discord.File:
        self.save_image()
        return discord.File(self.saved_image_path)

    def fill_captions(self, user_text: list[str] | str) -> None:
        """
        Fills any empty captions with text from the given user_text list
        If there are more captions to fill than provided strings, loops back to the start of input list.
        """

        if isinstance(user_text, str):
            user_text = [user_text]

        user_text_cycle = cycle(user_text)
        for textbox in self.image_captions:
            if not textbox.text:
                textbox.text = next(user_text_cycle)
                textbox.trim_to_width()

        self.draw_all_captions()


class Clueless(Maymay):
    def __init__(self, captions: str | list[str] = ""):
        clueless_font = make_font(default_serif_fontfile, 12)

        image_captions = [
            Image_Text(
                location=(200, 40),
                font=clueless_font,
                width="denounced in the sen",
            ),
        ]
        super().__init__(
            template_name="clueless",
            caption_text=captions,
            image_captions=image_captions,
        )


class Rdj(Maymay):
     def __init__(self, captions: str | list[str] = ""):
        self.default_font = make_font(default_serif_fontfile, 12)

        image_captions = [
            Image_Text(
                location=(200, 40),
                font=self.default_font,
                width="denounced in the sen",
            ),
        ]
        super().__init__(
            template_name="rdj",
            caption_text=captions,
            image_captions=image_captions,
        )


def quack(message: discord.Message, command: str, command_args: str):
    pass
