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
    "className": "fa fa-download",
    "title": "Save file"
};

const customSaveToDontpadAction = {
    "name": "save-dontpad",
    "action": ()=> {
        dontpadIntegration.saveToDontpad(simplemde.value());
    },
    "className": "fa fa-save",
    "title": "Save to dontpad"
};

const toolbarOrderedItems = ["bold", "italic", "heading", "|", "quote", "unordered-list", "ordered-list", "|",
  "link", "image", "|", "preview", "side-by-side", "fullscreen", "|", customSaveAction, customSaveToDontpadAction];

const configs = new ConfigsFromLocation();
const dontpadIntegration = new DontpadIntegration(`http://dontpad.com/${configs.path.full}`);
dontpadIntegration.getFromDontpad().then(res => {simplemde.value(res.content);});

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