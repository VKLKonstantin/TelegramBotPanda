import mongoose from "mongoose";
import TelegramBot, { Message } from "node-telegram-bot-api";
import { MONGO_PASSWORD, PORT, TELEGRAM_TOKEN } from "./config";
import { getAllPandas } from "./models/panda_wisdom_model";
import { getWeather } from "./weather";
import express from 'express';
import { Greetings } from "./greetings";

const UrlDB = `mongodb+srv://admin:${MONGO_PASSWORD}@cluster0.pfmktyu.mongodb.net/?retryWrites=true&w=majority`

const app = express();

app.get('/', (request, response) => {
    response.send('App is running');
}).listen(PORT, () => {
    console.log(`App is running, server is listening on port${PORT}`);
});

async function start(UrlDB: string) {
    try {
        await mongoose
            .connect(UrlDB)
            .then(() => {
                console.info('Connected to MONGO.');
            })
            .catch((error) => {
                console.error('Failed to connect to: MONGO.', error);

                return process.exit(1);
            });

    }
    catch (e) {
        console.log(e)
    }
}

start(UrlDB)

const bot = new TelegramBot(TELEGRAM_TOKEN, { polling: true })

function getRandomPanda(min: number, max: number) {
    min = Math.ceil(min);
    max = Math.floor(max);
    return Math.floor(Math.random() * (max - min)) + min;
}

bot.on('message', async (msg: Message) => {

    const weather = await getWeather('Минск')
    let _weather = [];
    _weather.push(
        `Температура: ${weather.main.temp} С`,
        ` ${weather.weather[0].description}`,
        ` скорость ветра: ${weather.wind.speed} м/с`,
    )

    const pandasList = await getAllPandas()
    const pandaVariant = getRandomPanda(0, pandasList.length);
    const wisdom = pandasList[pandaVariant].description
    const { id } = msg.chat;
    console.log('msg', msg)
    // @ts-ignore
    if (!Greetings.includes(msg!.text.toLocaleLowerCase())
        && msg!.text !== 'Хочу мудрость от Пандыча'
        && msg!.text !== 'Хочу прогноз погоды от Пандыча') {
        bot.sendMessage(id, 'Привет, меня зовут Пандыч, поприветствуй меня')
    }
    // @ts-ignore
    if (Greetings.includes(msg!.text.toLocaleLowerCase())) {
        bot.sendMessage(
            id,
            'Свой выбор сделай ты...',
            {
                reply_markup: {
                    keyboard: [
                        [{ text: 'Хочу мудрость от Пандыча' }],
                        [{ text: 'Хочу прогноз погоды от Пандыча' }],
                    ],
                    resize_keyboard: true
                }
            }
        )
    }

    switch (msg.text) {
        case 'Хочу мудрость от Пандыча':
            bot.sendMessage(
                id,
                wisdom,
            )

            const checkGif = pandasList[pandaVariant].picture.match(/gif/);
            console.log('checkGif', pandasList[pandaVariant].picture.match(/gif/))

            if (checkGif) {
                console.log('sendAnimation1')
                bot.sendAnimation(
                    id,
                    pandasList[pandaVariant].picture,
                )
                console.log('sendAnimation2')
            }
            else {
                bot.sendPhoto(
                    id,
                    pandasList[pandaVariant].picture,
                )
            }
            break;
        case 'Хочу прогноз погоды от Пандыча':
            bot.sendMessage(
                id,
                _weather.toString(),
            )
            break;
        default:
            break;
    }
})

