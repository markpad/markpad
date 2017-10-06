// author: https://lowrey.me/transform-query-parameters-into-a-object-with-es6/

const locationSearchToObject = (queryString = window.location.search.substring(1)) => {
    return queryString.split('&')
        .map(str => {
          let [key, value] = str.split('=');
          return {[key]: decodeURI(value)};
        })
    .reduce((prev, curr) => Object.assign(prev, curr));
};

export default locationSearchToObject;
