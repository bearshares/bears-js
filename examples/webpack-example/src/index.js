const bears = require('bears/lib/browser');

console.log('Getting post content...');
const resultP = bears.api.getContentAsync('yamadapc', 'test-1-2-3-4-5-6-7-9');
resultP.then(result => console.log(result));
