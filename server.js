// How NodeJS diffrens from vanilla JS
// 1). Node run on a server, not in a browser
// 2). The console is the terminal window
console.log("hello world!!")
// 3). global object instead of window object
// console.log(global)
// 4). Has common Code modules
// 5). commonJS modules instead of ES6 modules

const os = require('os')
const path = require('path')
const math = require('./math')

console.log(math.add(3,4))
/* 
console.log(os.type())
console.log(os.version())
console.log(os.homedir())

console.log(__dirname)
console.log(__filename)

console.log(path.dirname(__filename))
console.log(path.basename(__filename))
console.log(path.extname(__filename))

console.log(path.parse(__filename))
*/

// 6). Missing some JS APIs like fetch