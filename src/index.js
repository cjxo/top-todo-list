import "./styles.css";
import { createProject } from "./project";
import createProjectRenderer from "./project_renderer";

const project = createProject();
project.addCategory(
        "Hobby", 
        [
            "The Odin Project TODO-List",
            "Play Dead By Daylight"
        ]
    );

project
    .findCategory("Hobby")
    .findEntry("Play Dead By Daylight")
    .addTodo("Unlock Feng Min", "April 24, 2024", "Normal")
    .notes = 
    "<>\tAs usual, grind either Killer (using Huntress) or grind survivor (using Nea).\n" +
    "<>\tThereafter, we have enough Iridescent Shards; Read the following link:\n" +
    "  \thttps://deadbydaylight.fandom.com/wiki/Feng_Min#Unique_Perks\n" +
    "<>\tFeng Min Bunny Ears is quite cool... but it costs 7200 Iridescent Shards!! NYAA";


const initalEntry = project.findCategory("Hobby").findEntry("The Odin Project TODO-List");
const todoA = initalEntry.addTodo("Initialize Webpack", "April 20, 2024", "High")
todoA.notes =
    "Initialize Webpack using the following steps:\n" + 
    "1. https://webpack.js.org/guides/getting-started/\n" +
    "2. https://webpack.js.org/guides/asset-management/\n" + 
    "3. https://rapidevelop.org/webpack/setup-html-webpack-plugin/\n" + 
    "4. https://webpack.js.org/guides/development/\n" +
    "5. https://webpack.js.org/guides/production/"
    ;
todoA.isComplete = true;

initalEntry
    .addTodo("Think About Todo List Features", "April 20, 2024", "High")
    .notes = 
    "- A notion of projects (as required). But the user might also want to classify projects.\n" +
	"Thus, we want a project type represented (probably) by a string. For example, the user might\n" +
	"add \"Work\" project or \"Free Time\" project. Under work, the user might place work-related projects,\n" +
	"like \"prepare presentation\". The user can then expand that section and view todo list of checkboxes with\n" +
	"a title, description, due date, and priority for each sub-problem under \"prepare presentation\".\n" +
	"Under Free Time, the user might add \"the odin project todo list\", and within that section, it may contain\n" +
	"todo-list entries like \"brainstorm todo-list\", \"download required assets\", etc. You get the point.\n" +
    "\n" +
	"- From this, we need some thing like \"Project Type\", \"Project Entry\", \"Todo Card\" objects...\n" +
    "\n" +
    "- Ok so I have implemented project application logic which is quite straightforward.\n" +
    "\n" +
    "- The DOM rendering is MORE invovled";

initalEntry
    .addTodo("Use date-fns", "April 22, 2024", "normal")
    .notes = 
    "As recommended by TOP: https://github.com/date-fns/date-fns?tab=readme-ov-file."


const projectRenderer = createProjectRenderer(project);
projectRenderer.begin(initalEntry);