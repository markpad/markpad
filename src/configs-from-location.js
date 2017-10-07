import locationSearchToObject from "./location-search-to-object";

const ConfigsFromLocation = (location = window.location)=> {

    const _getInfo = () => {
        let info = location.pathname.substring(1) ? `${location.pathname.substring(1)}${location.search}` : location.hash.replace(/#!\//, "")
        info = info.split("?");
        return {
            path: { full: info[0], last: info[0].replace(/(.*)\/(.*)/, "$2")},
            search: locationSearchToObject(info[1])
        };
    };

    return _getInfo();
};

export default ConfigsFromLocation;