"use strict";
var __awaiter = (this && this.__awaiter) || function (thisArg, _arguments, P, generator) {
    function adopt(value) { return value instanceof P ? value : new P(function (resolve) { resolve(value); }); }
    return new (P || (P = Promise))(function (resolve, reject) {
        function fulfilled(value) { try { step(generator.next(value)); } catch (e) { reject(e); } }
        function rejected(value) { try { step(generator["throw"](value)); } catch (e) { reject(e); } }
        function step(result) { result.done ? resolve(result.value) : adopt(result.value).then(fulfilled, rejected); }
        step((generator = generator.apply(thisArg, _arguments || [])).next());
    });
};
Object.defineProperty(exports, "__esModule", { value: true });
require("dotenv/config");
const openai_1 = require("openai");
const discord_js_1 = require("discord.js");
(() => __awaiter(void 0, void 0, void 0, function* () {
    const configuration = new openai_1.Configuration({
        apiKey: process.env.OPEN_IA_API_KEY
    });
    const openai = new openai_1.OpenAIApi(configuration);
    const discord = new discord_js_1.Client({
        intents: [discord_js_1.GatewayIntentBits.Guilds, discord_js_1.GatewayIntentBits.GuildMessages, discord_js_1.GatewayIntentBits.MessageContent]
    });
    discord.on('ready', (discord) => {
        discord.on('messageCreate', (message) => __awaiter(void 0, void 0, void 0, function* () {
            var _a, _b, _c, _d;
            try {
                const channelName = message.channel.toJSON();
                if (channelName.name !== process.env.DISCORD_CHANNEL_NAME) {
                    return;
                }
                const channel = message.channel;
                if (message.author.bot) {
                    return;
                }
                if (!message.content.match(/^\$question:.*$/)) {
                    yield channel.send('Para realizar uma pergunta, utilize o comando: ```$question: <pergunta>```');
                    return;
                }
                const question = message.content.replace(/^\$question:/, '').trim();
                const completion = yield openai.createChatCompletion({
                    messages: [{
                            role: 'user',
                            content: question
                        }],
                    model: 'gpt-3.5-turbo'
                });
                if (((_b = (_a = completion.data.choices[0].message) === null || _a === void 0 ? void 0 : _a.content) === null || _b === void 0 ? void 0 : _b.length) > 2000) {
                    yield message.reply({
                        files: [{
                                name: 'answer.txt',
                                attachment: Buffer.from((_c = completion.data.choices[0].message) === null || _c === void 0 ? void 0 : _c.content)
                            }]
                    });
                    return;
                }
                yield message.reply((_d = completion.data.choices[0].message) === null || _d === void 0 ? void 0 : _d.content);
            }
            catch (err) {
                console.log(err);
                message.reply("Ops, ocorreu um erro ao tentar responder sua pergunta. Tente novamente mais tarde.");
            }
        }));
    });
    discord.login(process.env.DISCORD_TOKEN);
}))();
