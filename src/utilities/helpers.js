const fs = require("fs");
const randomStringGenerator = (len) => {
    const chars ="0123456789abcdefghijklmnopqrstuvwxyzABCDEFGHIJKLMNOPQRSTUVWXYZ";
    const length = chars.length;
    let random = "";
    for(let i = 0 ; i < len; i++){
        const posn = Math.ceil(Math.random()* (length-1));
        random+= chars[posn]
    }
    return random;
}
const deleteFile = (path) =>{
    if(fs.existsSync(path)){
        fs.unlinkSync(path) // unlink is asynchoronous so using sync 
    }
} 
module.exports = {
    randomStringGenerator,
    deleteFile
}