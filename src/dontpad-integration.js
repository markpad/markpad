import JSONToParams from "./json-to-params";

const DontpadIntegration = (dontpadUrl, callback)=> {

    let model = {
        hasChanged: false,
        lastUpdateTime: 0,
        content: "",
        isLoadingContent: false
    };

    const _getYQLUrl = () => {
        const configs = {
            api: "https://query.yahooapis.com/v1/public/yql?q=",
            parameters: `&format=json`,
            query: encodeURIComponent(`select * from json where url = '${dontpadUrl}.body.json?lastUpdate=${model.lastUpdateTime}'`)
        };
        return `${configs.api}${configs.query}${configs.parameters}`;
    };

    model.saveToDontpad = (mdContent)=> {
        return fetch(dontpadUrl, {
            body: JSONToParams({'text': mdContent}),
            mode: 'no-cors',
            headers: new Headers({
                'Accept': 'application/json',
                'Content-Type': 'application/x-www-form-urlencoded;charset=UTF-8'
            }),
            method: 'POST'
        }).then(result => result);
    };

    model.getFromDontpad = ()=> {
        model.isLoadingContent = true;

        return fetch(_getYQLUrl()).then(response => {
            if (response.ok) {
                return response.json();
            }
            return Promise.reject(Error('error'));
            }).then(result => {
                model.lastUpdateTime = result.query.results.json.lastUpdate;
                model.hasChanged = JSON.parse(result.query.results.json.changed);
                if(model.hasChanged){
                    model.content = result.query.results.json.body;
                }
                model.isLoadingContent = false;
                return new Promise((resolve) => {
                    resolve(model);
                });
            });
    };

    return model;

};

export default DontpadIntegration;