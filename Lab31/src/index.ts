import TelegramBot from 'node-telegram-bot-api';
import dotenv from 'dotenv';

dotenv.config();

const token = process.env.TELEGRAM_BOT_TOKEN!;

const bot = new TelegramBot(token, { polling: true });

bot.on('message', msg => {
    const chatId = msg.chat.id;
    const message = msg.text;

    if (message === '/monkey') {
        sendRandomMonkeySticker(chatId);
    } else if (message) {
        bot.sendMessage(chatId, `echo: ${message}`);
    }
});

bot.on('sticker', msg => {
    const chatId = msg.chat.id;
    const stickerId = msg.sticker!.file_id;

    bot.sendSticker(chatId, stickerId);
});

bot.on('polling_error', error => {
    console.log(`Ошибка в работе бота: ${error}`);
});

const sendRandomMonkeySticker = (chatId: number) => {
    const monkeyStickers = [
        'CAACAgIAAxkBAAMUZG5JSpRbGpSeTY2HzmhNx11PpK0AAp0aAALEIFlJzAxkVOwdP4ovBA',
        'CAACAgIAAxkBAAMWZG5Jc3ObN3sXB2Hh17RdRpPn_qkAAnIjAALsLcFLk2eXzaXvUV4vBA',
        'CAACAgIAAxkBAAMYZG5Jfp-NZzTPTRf1s3Tf_vB4YcEAAtohAAIlpUlJvJlvAYwUU5cvBA',
        'CAACAgIAAxkBAAMaZG5JhYTMX0ZTRHGLbIbn9gABzZSpAAKsIgACCRhhS6RzI4mHm1hVLwQ',
        'CAACAgIAAxkBAAMcZG5Jj8GppsnFWAOutxhVF2y03qoAAscaAAIOmMhIKOnR2TfOLCcvBA',
        'CAACAgIAAxkBAAMeZG5Jl8_Px8QaWRua_gIw7LDDKU0AAuwnAAJUIdlIrIusyuAv3qYvBA',
        'CAACAgIAAxkBAAMgZG5JoGRERkpLUpGyRV1UuhXOUakAApwaAAJtyuFJomvHo-yEyRUvBA'
    ];

    const randomStickerId = monkeyStickers[Math.floor(Math.random() * monkeyStickers.length)];

    bot.sendSticker(chatId, randomStickerId);
}

console.log('Bot is running...');