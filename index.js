import DontpadIntegration from "./src/dontpad-integration";
import ConfigsFromLocation from "./src/configs-from-location";
import FileSaver from "file-saver";
import SimpleMDE from "simplemde";
let simplemde;
let filename;

const customSaveAction = {
    "name": "save-txt",
    "action": ()=> {
        let blob = new Blob([simplemde.value()], {type: "text/plain;charset=utf-8"});
        FileSaver.saveAs(blob, `${filename}.txt`);
    },
    "className": "fa fa-download p-float-right",
    "title": "Save file"
};

const toolbarOrderedItems = ["bold", "italic", "heading", "|", "quote", "unordered-list", "ordered-list", "|",
  "link", "image", "|", "preview", "side-by-side", "fullscreen", customSaveAction];

const dontpadIntegration = new DontpadIntegration("http://dontpad.com/markpad");
const configs = new ConfigsFromLocation();
filename = configs.path.last;

simplemde = new SimpleMDE({
    element: document.querySelector("[data-selector=\"simplemde-textarea\"]"),
    autofocus: true,
    toolbar: toolbarOrderedItems,
    spellChecker: false
});

simplemde.toggleFullScreen();

if(typeof configs.search !== "undefined" && typeof configs.search.mode !== "undefined"){
    switch (configs.search.mode) {
        case "preview":
            simplemde.togglePreview();
            break;
        case "side-by-side":
            simplemde.toggleSideBySide();
            break;
    }
}