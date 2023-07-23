import {
    ActionRowBuilder,
    Client,
    GatewayIntentBits,
    ModalBuilder,
    Routes,
    TextInputBuilder,
    TextInputStyle,
    ButtonBuilder,
    ButtonStyle,
} from 'discord.js';
import { REST } from 'discord.js';
import dotenv from 'dotenv';
import * as command from './commands/index.js';
import { SelectMenuBuilder } from '@discordjs/builders';
dotenv.config();

// Create a new client instance
const client = new Client({
    intents: [
        GatewayIntentBits.Guilds, // required for guild-based events
        GatewayIntentBits.GuildMessages, // required for message-based events
        GatewayIntentBits.MessageContent,
    ],
});

// Create a new REST client
const rest = new REST({ version: '10' }).setToken(process.env.TOKEN);

// Log when bot is ready
client.on('ready', () => {
    console.log(`Logged in as ${client.user.tag} successfully!`);
});

// Log messages to console
client.on('messageCreate', (message) => {
    console.log(`${message.content} sent by ${message.author.username}`);
});

// main function
async function main() {
    // register slash commands
    const commands = [
        command.ownerCommand,
        command.registerCommand,
        command.banCommand,
        command.semesterCommand,
        command.loginCommand,
    ];

    try {
        console.log('Started refreshing application (/) commands.');
        await rest.put(
            Routes.applicationCommands(process.env.CLIENT_ID, process.env.GUILD_ID),
            { body: commands }
        );
        client.login(process.env.TOKEN);
    } catch (error) {
        console.log(error);
    }
}

// listen for interactions
client.on('interactionCreate', async (interaction) => {
    if (!interaction.isChatInputCommand()) return;

    if (interaction.commandName === 'ping') {
        await interaction.reply('Pong!');
    } else if (interaction.commandName === 'owner') {
        await interaction.reply({
            content: 'My owner is <@!177711122571329537>',
            components: [
                new ActionRowBuilder().addComponents(
                    new ButtonBuilder()
                        .setLabel('LinkedIn')
                        .setStyle(ButtonStyle.Link)
                        .setURL('https://www.linkedin.com/in/fricosimon/'),
                    new ButtonBuilder()
                        .setLabel('GitHub')
                        .setStyle(ButtonStyle.Link)
                        .setURL('https://github.com/FricoSimon')
                ),
            ],
        });
    } else if (interaction.commandName === 'register') {
        const name = interaction.options.getString('name');
        const nim = interaction.options.getInteger('nim');
        const batch = interaction.options.getInteger('batch');
        await interaction.reply(
            `Hi ${nim} - ${name}! You have been registered as a student/alumni of SI ITHB ${batch}.`
        );
    } else if (interaction.commandName === 'semester') {
        const actionRow = new ActionRowBuilder().addComponents(
            new SelectMenuBuilder().setCustomId('semester_options').setOptions(
                { label: 'Semester 1', value: '1' },
                { label: 'Semester 2', value: '2' },
                { label: 'Semester 3', value: '3' },
                { label: 'Semester 4', value: '4' }
            )
        );
        await interaction.reply({ components: [actionRow] });
    } else if (interaction.commandName === 'login') {
        const modal = new ModalBuilder()
            .setTitle('Login')
            .setCustomId('login_modal')
            .setComponents(
                new ActionRowBuilder().addComponents(
                    new TextInputBuilder()
                        .setLabel('NIM')
                        .setCustomId('NIM')
                        .setStyle(TextInputStyle.Short)
                ),
                new ActionRowBuilder().addComponents(
                    new TextInputBuilder()
                        .setLabel('password')
                        .setCustomId('password')
                        .setStyle(TextInputStyle.Short)
                ),
                new ActionRowBuilder().addComponents(
                    new TextInputBuilder()
                        .setLabel('note')
                        .setCustomId('note')
                        .setStyle(TextInputStyle.Paragraph)
                )
            );

        await interaction.showModal(modal);
    }
});

// listen for modal submissions
client.on('interactionCreate', async (interaction) => {
    if (!interaction.isModalSubmit()) return;

    if (interaction.customId === 'login_modal') {
        const nim = interaction.fields.getTextInputValue('NIM');
        const password = interaction.fields.getTextInputValue('password');
        const note = interaction.fields.getTextInputValue('note');
        await interaction.reply({
            content: `NIM: ${nim}\nPassword: ${password}\nNote: ${note}`,
            ephemeral: true
        });

    }
});

main();
