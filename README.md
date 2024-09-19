#### To Start

Run npm i && npm run dev

#### TODO:

--- Definitely need to scale down level files/modularise them

- Implement combinational player movement logic
    - Implement different types of movement
- Implement Block Palette to replace tiles within map
    - Implement start and finish tile logic
- Implement Timer
    - Implement Minute conversion
- Implement level completion screen/scene
    - Maybe more design?
- Implement level selector screen/scene
    - Maybe more design?

#### Extra Info
- Tiles are 16x16
- Font for logo is Bad Mofo
- Font for buttons is Courier size 16px

#### Current Bugs
- When a player hits a left/right key, and then up, the player does not jump
    - Doing some type of combo causes the player to float
- Player still moves to the right on its own without setVelocityX(-10)
