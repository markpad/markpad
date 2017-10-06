const JSONToParams = (object) => {
    return Object.keys(object).map((k) => encodeURIComponent(k) + '=' + encodeURIComponent(object[k])).join('&');
};
export default JSONToParams;