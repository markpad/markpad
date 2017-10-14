import FileSaver from "file-saver";
import SimpleMDE from "simplemde";

const SimpleMDEInit = () => {

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
};

export default SimpleMDEInit;