const prompts = require('prompts')
const {Program} = require('./program/program.js')

const program = new Program()


const command = [
{
    type: 'text',
    name: 'command',
    message: 'command?'
}
];

// const create = [
//     {
//         type: 'text',
//         name: 'path',
//         message: 'what is the path for the folder?'
//     }
// ]

// const destroy = [
//     {
//         type: 'text',
//         name: 'path',
//         message: 'what is the path for the folder?'
//     }
// ]

// const settings = [
//     {
//         type: 'text',
//         name: 'path',
//         message: 'what is the path for the folder?'
//     }
// ]

(async () => {
    let count = 0
    while(true){
        const response = await prompts(command)
        if(response.command === 'exit'){
            process.exit(0)
        } else if(response.command === 'upload'){
            console.log('it works', program.dht.nodeId)
        } else if(response.command === 'download'){} else if(response.command === 'uploadupdate'){} else if(response.command === 'downloadupdate'){} else if(response.command === 'settings'){}
        count = count + 1
        console.log(count)
    }
})()
