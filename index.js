import DontpadIntegration from "./src/dontpad-integration";
import ConfigsFromLocation from "./src/configs-from-location";
import Home from "./src/home";
import SimpleMDEInit from "./src/simplemde-init";

let simplemde;
let filename;

const configs = new ConfigsFromLocation();
const dontpadIntegration = new DontpadIntegration(`http://dontpad.com/${configs.path.full}`);
dontpadIntegration.getFromDontpad().then(res => {simplemde.value(res.content);});
filename = configs.path.last;

const home = new Home();
home.init(filename);

if(filename !== ""){
    SimpleMDEInit();
}





