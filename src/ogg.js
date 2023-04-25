import axios from 'axios';
import {createWriteStream} from 'fs';
import {dirname, resolve} from 'path';
import {fileURLToPath} from 'url';

import ffmpeg from 'fluent-ffmpeg';
import installer from '@ffmpeg-installer/ffmpeg';

const __dirname = dirname(fileURLToPath(import.meta.url));
console.log('__dirname: ', __dirname);

export class OggConverter {
    constructor(){
        ffmpeg.setFfmpegPath(installer.path);
    }

    toMp3(input, output){
        try{
            const outputPath = resolve(dirname(input), `${output}.mp3`);
            console.log('outputPath: ', outputPath);
            return new Promise((resolve, reject)=>{
                ffmpeg(input)
                    .inputOptions('-t 30')
                    .output(outputPath)
                    .on('end', _ =>  resolve(outputPath) )
                    .on('error', error =>  reject(error) )
                    .run()
            });
        } catch(e){
            console.log(e);
        }
    }

    async create(url, filename){
        const oggPath = resolve(__dirname, '../voices', `${filename}.ogg`);
        const res = await axios({
            method: 'get',
            url,
            responseType: 'stream',
        });

        return new Promise((resolve)=>{
            const stream = createWriteStream(oggPath);
            res.data.pipe(stream);
            stream.on('finish', () => {
                console.log('stream finish');
                resolve(oggPath);
            });
        });
    }
}