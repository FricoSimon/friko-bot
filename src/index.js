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
    EmbedBuilder,
    userMention,
    ChannelType,
} from 'discord.js';
import { REST } from 'discord.js';
import { joinVoiceChannel, createAudioPlayer, createAudioResource, NoSubscriberBehavior } from '@discordjs/voice';
import { SelectMenuBuilder } from '@discordjs/builders';
import * as command from './commands/index.js';
import dotenv from 'dotenv';
import Express from "express";
import axios from "axios";

const app = new Express();
const port = 3000;
dotenv.config();

app.use(Express.json());
app.use(Express.urlencoded({ extended: true }));

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
client.on('ready', () => { console.log(`Logged in as ${client.user.tag} successfully!`); });

// main function
async function main() {
    // register slash commands
    const commands = [
        command.ownerCommand,
        command.registerCommand,
        command.banCommand,
        command.semesterCommand,
        command.loginCommand,
        command.truthOrDareCommand,
        command.translateCommand,
        command.dadJokesCommand
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

// listen for slash commands
client.on('interactionCreate', async (interaction) => {
    if (!interaction.isChatInputCommand()) return;

    try {
        if (interaction.commandName === 'owner') {
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
                            .setURL('https://github.com/FricoSimon'),
                    ),
                ],
            });
        } else if (interaction.commandName === 'register') {
            const name = interaction.options.getString('name');
            const nim = interaction.options.getInteger('nim');
            const batch = interaction.options.getInteger('batch');
            const channel = interaction.options.getChannel('channel');
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
                    ));
            await interaction.showModal(modal);
        } else if (interaction.commandName === 'truthordare') {
            await interaction.reply({
                content: 'Choose your destiny!',
                components: [
                    new ActionRowBuilder().addComponents(
                        new ButtonBuilder()
                            .setCustomId('truth')
                            .setLabel('Truth')
                            .setStyle(ButtonStyle.Success),
                        new ButtonBuilder()
                            .setCustomId('dare')
                            .setLabel('Dare')
                            .setStyle(ButtonStyle.Danger)
                    ),
                ],
            });
        } else if (interaction.commandName === 'voice') {
            const voiceState = interaction.member?.voice;
            const voiceChannel = voiceState?.channel;

            if (!voiceChannel) {
                console.log(`Member ${interaction.member.user.username} is not in a voice channel.`);
                await interaction.reply('You are not in a voice channel.');
                return; // Exit the function if the member is not in a voice channel
            }

            try {
                const connection = joinVoiceChannel({
                    channelId: voiceChannel.id,
                    guildId: voiceChannel.guild.id,
                    adapterCreator: voiceChannel.guild.voiceAdapterCreator,
                });

                await interaction.reply(`Joined the voice channel ${voiceChannel.name}.`);

                const player = createAudioPlayer({
                    behaviors: {
                        noSubscriber: NoSubscriberBehavior.Pause,
                    },
                });

                const resource = createAudioResource('./music/gurenge.mp3', {
                    metadata: {
                        title: 'A good song!',
                    },
                });

                // Start playing the music
                player.play(resource);
                connection.subscribe(player);

                // Leave the voice channel after 60 seconds
                setTimeout(() => {
                    connection.destroy();
                    console.log('Destroyed the connection');
                }, 60000);

            } catch (error) {
                console.error('Error joining voice channel:', error);
                await interaction.reply('An error occurred while trying to join the voice channel.');
            }
        } else if (interaction.commandName === 'translate') {
            const actionRow = new ActionRowBuilder().addComponents(
                new SelectMenuBuilder().setCustomId('translate_options').setOptions(
                    { label: 'English to Indonesia', value: 'en' },
                    { label: 'Indonesia to English', value: 'id' },
                ));
            await interaction.reply({ components: [actionRow] });
        } else if (interaction.commandName === 'dadjokes') {
            const options = {
                method: 'GET',
                url: 'https://dad-jokes.p.rapidapi.com/random/joke',
                headers: {
                    'X-RapidAPI-Key': process.env.rapidAPIKey_Dadjokes,
                    'X-RapidAPI-Host': process.env.rapidAPIHost_Dadjokes
                }
            };

            try {
                const response = await axios.request(options);
                const jokeSetup = response.data.body[0].setup;
                const jokePunchline = response.data.body[0].punchline;
                const username = interaction.user.username;

                const embedReply = new EmbedBuilder()
                    .setTitle('Dad Jokes')
                    .setAuthor({ name: `${username}` })
                    .setThumbnail('https://i.imgur.com/mKX4m6s.png')
                    .addFields({ name: 'Question', value: `${jokeSetup}`, inline: false })
                    .addFields({ name: 'Answer', value: `${jokePunchline}`, inline: false })
                    .setColor('#3ba55c')
                    .setTimestamp();

                const responses = [
                    "Hahaha",
                    "LOL",
                    "That's funny!",
                    "I can't stop laughing!",
                    "Good one!",
                    "LMAO!",
                    "XD"
                ];

                const randomResponse = responses[Math.floor(Math.random() * responses.length)];

                await interaction.reply({ content: randomResponse, embeds: [embedReply] });
            } catch (error) {
                console.error(error);
            }
        }
    } catch (error) {
        console.error(error);
        await interaction.reply({ content: 'Error!' });
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
    } else if (interaction.customId === 'translate_modal') {
        const translate = interaction.fields.getTextInputValue('translate');
        const encodedParams = new URLSearchParams();
        encodedParams.set('source_language', 'en');
        encodedParams.set('target_language', 'id');
        encodedParams.set('text', translate);

        const options = {
            method: 'POST',
            url: 'https://text-translator2.p.rapidapi.com/translate',
            headers: {
                'content-type': 'application/x-www-form-urlencoded',
                'X-RapidAPI-Key': process.env.rapidAPIKey_Translate,
                'X-RapidAPI-Host': process.env.rapidAPIHost_Translate
            },
            data: encodedParams,
        };

        const response = await axios.request(options);
        const translatedText = response.data.data.translatedText;
        await interaction.reply({
            content: `Translated Text: ${translatedText}`
        });
    } else if (interaction.customId === 'translate2_modal') {
        const translate = interaction.fields.getTextInputValue('translate');
        const encodedParams = new URLSearchParams();
        encodedParams.set('source_language', 'id');
        encodedParams.set('target_language', 'en');
        encodedParams.set('text', translate);

        const options = {
            method: 'POST',
            url: 'https://text-translator2.p.rapidapi.com/translate',
            headers: {
                'content-type': 'application/x-www-form-urlencoded',
                'X-RapidAPI-Key': process.env.rapidAPIKey,
                'X-RapidAPI-Host': process.env.rapidAPIHost
            },
            data: encodedParams,
        };

        const response = await axios.request(options);
        const translatedText = response.data.data.translatedText;
        await interaction.reply({
            content: `Translated Text: ${translatedText}`
        });
    }
});

// listen for select menu submissions
client.on('interactionCreate', async (interaction) => {
    if (!interaction.isButton()) return;

    try {
        if (interaction.customId === 'truth') {
            try {
                const response = await axios.get('https://api.truthordarebot.xyz/v1/truth');
                const data = response.data.question;
                const username = interaction.user.username;
                const userId = userMention(interaction.user.id);

                const embedReply = new EmbedBuilder()
                    .setTitle('You chose truth!')
                    .setAuthor({ name: `${username}` })
                    .setDescription('Answer this question honestly:')
                    .setThumbnail('https://i.imgur.com/mKX4m6s.png')
                    .addFields({ name: 'Question', value: `${data}`, inline: true })
                    .setColor('#3ba55c')
                    .setTimestamp();

                await interaction.reply({ content: `Answer this in 60s!\n${userId}`, embeds: [embedReply] });
            } catch (error) {
                console.error(error);
                await interaction.reply({ content: 'Error!' });
            }
        }

        // dare button handler
        else if (interaction.customId === 'dare') {
            try {
                const response = await axios.get('https://api.truthordarebot.xyz/v1/dare');
                const data = response.data.question;
                const username = interaction.user.username;
                const userId = userMention(interaction.user.id);

                const embedReply = new EmbedBuilder()
                    .setTitle('You chose dare!')
                    .setAuthor({ name: `${username}` })
                    .setDescription('Do this dare:')
                    .setThumbnail('https://i.imgur.com/mKX4m6s.png')
                    .addFields({ name: 'Order', value: `${data}`, inline: true })
                    .setColor('#FF5733')
                    .setTimestamp();

                await interaction.reply({ content: `Do this in 60s!\n${userId}`, embeds: [embedReply] });
                // const dm = await interaction.user.send(data); // Send the DM    

            } catch (error) {
                console.error(error);
                await interaction.reply({ content: 'Error!' });
            }
        }
    } catch (error) {
        console.error(error);
        await interaction.reply({ content: 'Error!' });
    }
});

// listen for select menu submissions then return modal
client.on('interactionCreate', async (interaction) => {
    if (!interaction.isButton && !interaction.isStringSelectMenu()) return;

    try {
        if (interaction.customId === 'translate_options') {
            const value = interaction.values[0];
            if (value === 'en') {
                const modal = new ModalBuilder()
                    .setTitle('translate')
                    .setCustomId('translate_modal')
                    .setComponents(
                        new ActionRowBuilder().addComponents(
                            new TextInputBuilder()
                                .setLabel('translate')
                                .setCustomId('translate')
                                .setStyle(TextInputStyle.Paragraph)
                        ));
                await interaction.showModal(modal);
            } else {
                const value = interaction.values[0];
                if (value === 'id') {
                    const modal = new ModalBuilder()
                        .setTitle('translate')
                        .setCustomId('translate2_modal')
                        .setComponents(
                            new ActionRowBuilder().addComponents(
                                new TextInputBuilder()
                                    .setLabel('translate')
                                    .setCustomId('translate')
                                    .setStyle(TextInputStyle.Paragraph)
                            ));
                    await interaction.showModal(modal);
                }
            };
        }
    } catch (error) {
        console.error(error);
        await interaction.reply({ content: 'Error!' });
    }
});

main();

app.listen(port, () => { console.log(`Example app listening at http://localhost:${port}`); });