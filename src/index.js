import { Client, GatewayIntentBits } from 'discord.js';
import dotenv from 'dotenv';
dotenv.config();

const client = new Client({
    intents: [GatewayIntentBits.Guilds,
    GatewayIntentBits.GuildMessages,
    GatewayIntentBits.MessageContent,
    ]
});

client.login(process.env.TOKEN);

// Log when bot is ready
client.on('ready', () => {
    console.log(`Logged in as ${client.user.tag} successfully!`);
});

// Log messages to console
client.on('messageCreate', (message) => {
    console.log(`${message.content} sent by ${message.author.username}`);
})

// Log edited messages to console
client.on('messageUpdate', (oldMessage, newMessage) => {
    console.log(`${oldMessage.content} edited to ${newMessage.content} by ${oldMessage.author.username}`);
})
