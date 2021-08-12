const fs = require('fs')
const path = require('path')
const fsEx = require('fs-extra')
const pathEx = require('path-extra')
const express = require('express')
const DHT = require('bittorrent-dht')
const WebTorrent = require('webtorrent')
const ed = require('bittorrent-dht-sodium')
const {Upload} = require('./upload.js')
const {Download} = require('./download.js')

class Program {
    constructor(){
        this.port = Math.floor(Math.random() * (65535 - 1024 + 1)) + 1024
        this.runServer()
        this.dht = new DHT({ verify: ed.verify })
        this.webtorrent = new WebTorrent()
        this.upload = []
        this.download = []
    }
    runServer(){
        this.server = express()
        this.server.use(express.static('folder'))
    }
    prepareSite(pathOfDir){
        // fs.lstatSync(path_string).isDirectory() throws an error, use it in a try/catch block or  use the if statement below this without that check
        // if(fs.existsSync(pathOfFolder)){
        let pathOfFolder = path.resolve(pathOfDir)
        let pathOfFile = pathOfFolder + path.sep + 'index.html'
        let title = path.basename(pathOfFolder)
        fsEx.pathExists(pathOfFolder, (errorFolder, existsFolder) => {
            if(errorFolder){
                return errorFolder
            } else if(existsFolder){
                fsEx.pathExists(pathOfFile, (errorFile, existsFile) => {
                    if(errorFile){
                        return errorFile
                    } else if(existsFile){} else if(!existsFile){
                        fs.readdir(pathOfFolder, (errorDir, filesDir) => {
                            if(errorDir){
                                return errorDir
                            } else if(filesDir){
                                fs.writeFile(pathOfFile, `<html><head><title>Bittorrent Site</head><body><p>${filesDir.filter(filesFilter => {return filesFilter !== 'index.html'}).map(filesMap => {return `<br /><a href="${filesMap}">${filesMap}</a><br />`})}</p></body></html>`, errorHTML => {
                                    if(errorHTML){
                                        return errorHTML
                                    } else {}
                                })
                            }
                        })
                    }
                })
            } else if(!existsFolder){
                return new Error('directory does not exist')
            }
        })
    }
    // prepareSite(data){
    //     let localFolder = path.resolve('./upload') + path.sep + data.title
    //     let localFile = localFolder + path.sep + 'index.html'
    //     fsEx.copy(data.pathOfFolder, path.resolve('./upload') + path.sep + data.title, {overwrite: true}, error => {
    //         if(error){
    //             return error
    //         } else {}
    //     })
    // }
    uploadTorrent(data){
        let localFolder = path.resolve('./upload') + path.sep + data.title
        let localFile = localFolder + path.sep + 'index.html'
        this.webtorrent.seed(data.localFile, {path: localFolder, destroyStoreOnDestroy: true}, torrent => {
        })
    }
    uploadHash(data){
        let upload = {keypair: ed.keygen(), folder: data.localFolder, file: data.localFile, seq: 0, value: data.value, info: null}
        this.dht.put({k: upload.keypair.pk, seq: upload.seq, v: Buffer.from(upload.value), sign: function(buf){return ed.sign(buf, upload.keypair.sk)}}, (error, hash) => {
            if(error){
                this.webtorrent.remove(upload.torrentid, {destroyStore: true})
                // this.purgeUploadData(upload)
                return error
            } else if(hash){
                upload.hash = hash
                this.upload.push(new Upload(upload))
                // return upload
            }
        })
    }
    // purgeTorrent(data){
    //     this.webtorrent.remove(data.torrentid, {destroyStore: true}, error => {
    //         if(error){
    //             return error
    //         } else {
    //             return true
    //         }
    //     })
    // }
    purgeUploadData(data){
        for(let i = 0;i < this.upload.length;i++){
            if(this.upload[i].title === data.title){
                this.webtorrent.remove(this.upload[i].torrentid, {destroyStore: true})
                this.upload.splice(i, 1)
            }
        }
    }
    purgeDownloadData(data){
        for(let i = 0;i < this.download.length;i++){
            if(this.download[i].title === data.title){
                this.webtorrent.remove(this.download[i].torrentid, {destroyStore: true})
                this.download.splice(i, 1)
            }
        }
    }
}

exports.Program = Program