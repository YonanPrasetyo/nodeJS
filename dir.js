const fs = require('fs')

if(!fs.existsSync('./new')){
    fs.mkdir('./new', (err) => {
        if (err) throw err
        console.log('Directory created!')
    })
}else{
    console.log('Directory already exists!')
}


if(fs.existsSync('./new')){
    fs.rmdir('./new', (err) => {
        if (err) throw err
        console.log('Directory removed!')
    })
}