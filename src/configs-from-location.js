import locationSearchToObject from "./location-search-to-object";

const ConfigsFromLocation = (location = window.location)=> {

    const init = () => {
        return locationSearchToObject();
    };

    return {
        init
    };
};

export default ConfigsFromLocation;