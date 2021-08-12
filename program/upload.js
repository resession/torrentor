const ed = require('bittorrent-dht-sodium')
const fs = require('fs')
const path = require('path')

class Upload {
    constructor(data){
        this.keypair = data.keypair
        this.seq = data.seq
        this.value = Buffer.from(data.value)
        this.hash = data.hash
        this.folder = data.folder
        this.file = data.file
        this.info = data.info
        this.title = data.title
    }
    update(data){
        this.seq = this.seq + 1
        this.value = Buffer.from(data)
        return {k: this.keypair.pk, seq: this.seq, v: this.value, sign: function(buf){ return ed.sign(buf, this.keypair.sk) }}
    }
    // getPut(){
    //     // return {k: this.keypair.pk, seq: this.seq, v: this.value, sign: function(buf){ return ed.sign(buf, this.keypair.sk) }}
    //     // use the object below if the program does not accept the signature function
    //     // return {k: this.keypair.pk, seq: this.seq, v: this.value}
    // }
    save(){
        fs.writeFile(path.resolve('../ul') + path.sep + this.title, JSON.stringify({...this, secret: this.keypair.sk}), error => {
            if(error){
                return error
            } else {
                return true
            }
        })
    }
}

exports.Upload = Upload