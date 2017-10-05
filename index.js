let simpleMDE;

const hash = () => {
    return window.location.hash.indexOf("#!") !== -1 ? window.location.hash.toString().replace("#!", "") : window.location.pathname;
}

const JSONToParams = function params(obj){
  return Object.keys(obj).map((k) => encodeURIComponent(k) + '=' + encodeURIComponent(obj[k])).join('&')
};

const updateDontpad = () => {
  fetch(`http://dontpad.com${hash()}` , {
    body: JSONToParams({"text":simpleMDE.value()}),
    mode: "no-cors",
    headers: new Headers({
      "Accept": "application/json",
      "Content-Type": "application/x-www-form-urlencoded;charset=UTF-8"
    }),
    method: "POST"
  }).then(function(res){
    console.log(res);
  });
};

var timeout = setTimeout( () => {
  simpleMDE = new SimpleMDE({
    element: document.querySelector("[data-selector='markpad-textarea']"),
    autofocus: true,
    toolbar: [
      "bold", "italic", "heading", "|" , "quote", "unordered-list", "ordered-list", "|",
      "link", "image", "|", "preview", "side-by-side", "|", "guide", {
        "name": "save",
        "action": () => {
        var file = new File([simpleMDE.value()], `${hash()}.txt`, {type: "text/plain;charset=utf-8"});
saveAs(file);
},
"className": "fa fa-hdd-o",
  "title": "Save file"
}
]
});
simpleMDE.toggleFullScreen();
}, 0);

var intervalShowMDEContent = setInterval( () => {
  updateDontpad();
}, 2000);