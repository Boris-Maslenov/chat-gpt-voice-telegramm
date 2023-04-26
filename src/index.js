import { Telegraf } from 'telegraf'
import { message } from 'telegraf/filters';
import config from 'config';
import { OggConverter} from './ogg.js';
import { OpenAI} from './openai.js';
console.log(OggConverter);

const bot = new Telegraf(config.get('TELEGRAM_TOKEN'));
const api_key = config.get('OPEN_API_KEY');
console.log(api_key);

bot.command('start', async (ctx) => {
    await ctx.reply(JSON.stringify(ctx.message, null, 2));
});

// bot.on(message('text'), async(ctx)=>{
//     await ctx.reply(JSON.stringify(ctx.message, null, 2));
// });

bot.on(message('voice'), async (ctx)=>{
    try{
        //await ctx.reply(JSON.stringify(ctx.message, null, 2));
        const {href} = await ctx.telegram.getFileLink(ctx.message.voice.file_id);
        const userId = String(ctx.message.from.id);
        const oggConverter = new OggConverter()
        const oggPath = await oggConverter.create(href, userId);
        const mp3Path = await oggConverter.toMp3(oggPath, userId);

        const openai = new OpenAI(api_key);
        const text = await openai.transcription(mp3Path);
        console.log(text);
        //const response = await openai.chat(text);
        //await ctx.reply(mp3Path);
        //await ctx.reply(text);
        //console.log(userId);
    } catch(e){
        console.log(e);
    }
    
});

bot.launch();

process.once('SIGINT', () => bot.stop('SIGINT'));
process.once('SIGTERM', () => bot.stop('SIGTERM'));