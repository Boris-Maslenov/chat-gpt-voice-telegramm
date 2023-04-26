import { Configuration, OpenAIApi } from "openai";
import {createReadStream} from 'fs';
export class OpenAI {
    constructor(apikey){
        const configuration = new Configuration({
            apikey,
        })
        this.openai = new OpenAIApi(configuration);
    }

    chat(){}
    async transcription(filepath){
        try{
            //console.log('filepath: ', filepath);
            //console.log(this.openai);
            console.log(createReadStream(filepath));
            const response = await this.openai.createTranscription( 
                createReadStream(filepath),
                'whisper-1'
                );
                return response.data.text;
        }catch(e){
            console.log('Ошибка генерации текста', e);
        }
    }
}