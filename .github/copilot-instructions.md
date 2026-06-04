# Pocket platformer

## Engine
Html5 with canvas. Vanilla javasript

## Functionality
Pocket platformer has 2 modes. A build mode and a play mode. During play mode, users
can draw tiles, objects, deco and enemies on the screen. During play-time the levels can be tested. 
A full game with multiple levels can be created with this tool.
The games are exported and imported as full html files (playable games, containing all the game logic).

## Code overview
The game has 2 modes. Build-mode and Play-mode. both run in a loop, but build mode doesn't execute the objects movement/update logic.
The sprites are contained in SpritePixelArrays. The values in the objects, represent the colors of the sprite, which are rendered on an outside canvas.
WorldDataHandler contains the permament data, which is loaded when a level is loaded.
TileMapHandler is more for run-time logic.
ImportExportHandler is responsible for exporting and importing the levels as html files. It also contains the logic for converting the world data into a playable game (which is also an html file).
The UI is built with vanilla javascript and html elements. It is not a framework, dynamic elements are created with javascript and added to the DOM. 