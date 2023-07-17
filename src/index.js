import { Client, GatewayIntentBits, Routes } from 'discord.js';
import { REST } from 'discord.js';
import dotenv from 'dotenv';
dotenv.config();

const client = new Client({
    intents: [GatewayIntentBits.Guilds,
    GatewayIntentBits.GuildMessages,
    GatewayIntentBits.MessageContent,
    ]
});

const rest = new REST({ version: '10' }).setToken(process.env.TOKEN);

// Log when bot is ready
client.on('ready', () => { console.log(`Logged in as ${client.user.tag} successfully!`); });

// Log messages to console
client.on('messageCreate', (message) => {
    console.log(`${message.content} sent by ${message.author.username}`);
});

async function main() {
    const commands = [
        {
            name: 'ping',
            description: 'Replies with Pong! The other command is deprecated. Do not use it.',
        },
        {
            name: 'owner',
            description: 'Who is the owner of this bot?',
        },
    ];

    try {
        console.log('Started refreshing application (/) commands.');
        await rest.put(Routes.applicationCommands(process.env.CLIENT_ID, process.env.GUILD_ID), { body: commands });
        client.login(process.env.TOKEN);
    }
    catch (error) {
        console.log(error);
    }
}

client.on('interactionCreate', async interaction => {
    if (!interaction.isChatInputCommand()) return;

    if (interaction.commandName === 'ping') {
        await interaction.reply('Pong!');
    } else if (interaction.commandName === 'owner') {
        await interaction
        await interaction.reply('My owner is <@!177711122571329537>\nFollow him on LinkedIn: https://www.linkedin.com/in/fricosimon/'); await interaction.reply('My owner is <@!177711122571329537>\nFollow him on LinkedIn: https://www.linkedin.com/in/fricosimon/');
    }
});

main();