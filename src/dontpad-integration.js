import JSONToParams from "./json-to-params";

const DontpadIntegration = (dontpadUrl)=> {

    const updateToDontpad = (mdContent)=> {
        fetch(dontpadUrl, {
            body: JSONToParams({'text': mdContent}),
            mode: 'no-cors',
            headers: new Headers({
                'Accept': 'application/json',
                'Content-Type': 'application/x-www-form-urlencoded;charset=UTF-8'
            }),
            method: 'POST'
        });
    };

    const getFromDontpad = ()=> {
        return "getting content from dontpad";
    };

    return {
        dontpadUrl,
        updateToDontpad,
        getFromDontpad
    };
};

export default DontpadIntegration;