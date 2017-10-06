import DontpadIntegration from "./src/dontpad-integration";
import ConfigsFromLocation from "./src/configs-from-location";
import wordCounter from "./src/word-counter";
import SimpleMDE from "simplemde";

const customSaveAction = {
    "name": "save-txt",
    "action": ()=> {},
    "className": "fa fa-download p-float-right",
    "title": "Save file"
};

const toolbarOrderedItems = ["bold", "italic", "heading", "|", "quote", "unordered-list", "ordered-list", "|",
  "link", "image", "|", "preview", "side-by-side", "fullscreen", customSaveAction];


const customWordsStatus = {
    className: "words-custom",
    defaultValue: function(el) {
        el.innerHTML = wordCounter("amor i love you");
    },
    onUpdate: function(el) {
        console.log("atualizou o número de palavras");
        el.innerHTML = wordCounter("amor i love you");
    }
};

const simpleMDEConfigs = {
    element: document.querySelector("[data-selector=\"simplemde-textarea\"]"),
    autofocus: true,
    toolbar: toolbarOrderedItems,
    spellChecker: false,
    // status: [customWordsStatus]
};

const dontpadIntegration = new DontpadIntegration("http://dontpad.com/markpad");
const configsFromLocation = new ConfigsFromLocation();
const simpleMDE = new SimpleMDE(simpleMDEConfigs);
simpleMDE.toggleFullScreen();