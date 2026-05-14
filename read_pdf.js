const fs = require('fs');
const pdf = require('pdf-parse');

let dataBuffer = fs.readFileSync('client_new/src/assets/resume.pdf');

pdf(dataBuffer).then(function(data) {
    console.log(data.text);
}).catch(function(error){
    console.error(error);
});
