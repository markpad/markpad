import redirect from "/src/redirect";
import DontpadIntegration from "./src/dontpad-integration";
import ConfigsFromLocation from "./src/configs-from-location";
import FileSaver from "file-saver";
import SimpleMDE from "simplemde";

redirect();

const customSaveAction = {
    "name": "save-txt",
    "action": ()=> {
        let blob = new Blob(["Hello, world!"], {type: "text/plain;charset=utf-8"});
        FileSaver.saveAs(blob, "hello world.txt");
    },
    "className": "fa fa-download p-float-right",
    "title": "Save file"
};

const toolbarOrderedItems = ["bold", "italic", "heading", "|", "quote", "unordered-list", "ordered-list", "|",
  "link", "image", "|", "preview", "side-by-side", "fullscreen", customSaveAction];

const simpleMDEConfigs = {
    element: document.querySelector("[data-selector=\"simplemde-textarea\"]"),
    autofocus: true,
    toolbar: toolbarOrderedItems,
    spellChecker: false
};

const dontpadIntegration = new DontpadIntegration("http://dontpad.com/markpad");
const configsFromLocation = new ConfigsFromLocation().init();
const simpleMDE = new SimpleMDE(simpleMDEConfigs);
simpleMDE.toggleFullScreen();

