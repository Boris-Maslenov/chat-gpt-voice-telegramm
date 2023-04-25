import { Telegraf } from 'telegraf'
import { message } from 'telegraf/filters';
import config from 'config';
import { OggConverter} from './ogg.js';
console.log(OggConverter);

const bot = new Telegraf(config.get('TELEGRAM_TOKEN'));

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
        //await ctx.reply(href);
        console.log(userId);
    } catch(e){
        console.log(e);
    }
    
});

bot.launch();

process.once('SIGINT', () => bot.stop('SIGINT'));
process.once('SIGTERM', () => bot.stop('SIGTERM'));