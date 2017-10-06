const ConfigsFromLocation = (location = window.location)=> {

    const path = () => {
        return location.path;
    };

    return {
        path
    };
};

export default ConfigsFromLocation;