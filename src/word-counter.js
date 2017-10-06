const wordCounter = (data)=> {
    let pattern = /[a-zA-Z0-9_\u0392-\u03c9\u0410-\u04F9]+|[\u4E00-\u9FFF\u3400-\u4dbf\uf900-\ufaff\u3040-\u309f\uac00-\ud7af]+/g;
    let m = data.match(pattern);
    let count = 0;
    if(m === null) return count;
    for(let i = 0; i < m.length; i++) {
        if(m[i].charCodeAt(0) >= 0x4E00) {
            count += m[i].length;
        } else {
            count += 1;
        }
    }
    return count;
}
export default wordCounter;