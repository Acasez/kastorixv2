# Kastorix 
Kastorix is a TTRPG and worldbuilding project I have been working on for a bit over a year now. It's a high fantasy world with science fiction elements, set on a moon orbiting a gas giant. It has over 35 different nations, 9 playable sapient species (plus things like dragons, coatl, giant spiders and hippo centaurs which aren’t playable), many types of magical creatures and a developed magic system. Technology wise the world roughly mirrors our 18th/19th century, but it relies heavily on magitech which changes many aspects of society. 

It started as I wanted to do a worldbuilding project that didn't need to connect to DND/Pathfinder lore. Previous worlds I’ve built have been for DMing DND/Pathfinder and therefore they had follow those systems' game mechanics and tropes. In Kastorix I was able to do things like making humans a minority species compared to the other sapients, making airships one of the main methods of traveling around and having magic be commonplace. I could also build a world where I didn’t need to provide gods and divine forces, for clerics or demons for warlocks.

I started by just worldbuilding in an obsidian vault, but later began thinking about how I could use a setting TTRPG setting. The TTRPG uses Pathfinder (2e) as a base, but it is also very different especially in terms of character creation and the fact it uses opposed rolls when possible. It's a classless system that gives players (at least) two feats per level to plot out as desired. My current group is enjoying it a great deal, and we’ve had a campaign running for almost a year now.

# Character Sheet
One of the things I’ve been working the most on have been the online Character Sheet, inspired by Pathbuilder for Pathfinder. It is designed to provide an easy way to design, update and play with your character. 

If it sounds interesting, I recommend you to go to the page and check it out, make a character. You can set stats, pick feats, spells, weapons and more. When I’m not working on other projects, I’m adding new things here.
https://acasez.github.io/kastorixv2/characterSheet 

# DM Screen
To accompany the Character Sheet I have made an interactive DM Screen where I can design and run different creatures. Here I can create new creatures, create custom attacks and abilities with dropdowns and save them as JSON files. I then import and load the creatures when I DM, and keep track of stats and abilities. Many of the functions such as the proficiency markers and spell and weapon components reuses React Components from the character sheet.

I still want to improve the DM Screen with features to make it easier to design and balance creatures, with things like creature type and level templates. 
https://acasez.github.io/kastorixv2/DMScreen

# Data Handling 
One thing I found is that designing an TTRPG, especially one as combat heavy and crunchy as this requires a lot of data. Making spells and feats is of course fun, but storing and updating was a bit of a challenge. At first I put the feats directly on the pages, but later I ended up storing them in a google sheet document. I have a python script to import all the data to my folder and store it  in JSON files for easy access. The raw JSON data is then at runtime used to make typed data objects that are exported for the character sheet, DM Screen and more.
