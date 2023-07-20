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

// main function
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
        {
            name: 'register',
            description: 'Register yourself as a student/alumni of SI ITHB.',
            options: [
                {
                    name: 'name',
                    description: 'Your name',
                    type: 3,
                    required: true,
                },
                {
                    name: 'nim',
                    description: 'Your NIM',
                    type: 4,
                    required: true,
                },
                {
                    name: 'batch',
                    description: 'Your batch (year)',
                    type: 4,
                    required: false,
                    choices: [
                        {
                            name: '2020',
                            value: 2020,
                        },
                        {
                            name: '2021',
                            value: 2021,
                        },],
                },
            ]
        }];

    try {
        console.log('Started refreshing application (/) commands.');
        await rest.put(Routes.applicationCommands(process.env.CLIENT_ID, process.env.GUILD_ID), { body: commands });
        client.login(process.env.TOKEN);
    }
    catch (error) {
        console.log(error);
    }
}

// listen for interactions
client.on('interactionCreate', async interaction => {
    if (!interaction.isChatInputCommand()) return;

    if (interaction.commandName === 'ping') {
        await interaction.reply('Pong!');
    } else if (interaction.commandName === 'owner') {
        const messageContent = `My owner is <@!177711122571329537>
Follow him on LinkedIn: https://www.linkedin.com/in/fricosimon/
Follow him on GitHub: https://github.com/FricoSimon`;
        await interaction.reply(messageContent);
    } else if (interaction.commandName === 'register') {
        const name = interaction.options.getString('name');
        const nim = interaction.options.getInteger('nim');
        const batch = interaction.options.getInteger('batch');
        await interaction.reply(`Hi ${nim} - ${name}! You have been registered as a student/alumni of SI ITHB ${batch}.`);
    }
});

// Start the bot
main();