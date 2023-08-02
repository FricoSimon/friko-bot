import { ChannelType, SlashCommandBuilder, } from 'discord.js';

const registerCommand = new SlashCommandBuilder()
    .setName('register')
    .setDescription('Register yourself as a student/alumni of SI ITHB.')
    .addStringOption(option =>
        option.setName('name')
            .setDescription('Your name')
            .setRequired(true)
    )
    .addIntegerOption(option =>
        option.setName('nim')
            .setDescription('Your NIM')
            .setRequired(true)
    )
    .addIntegerOption(option =>
        option.setName('batch')
            .setDescription('Your batch')
            .setRequired(true)
            .addChoices(
                { name: '2019', value: 2019 },
                { name: '2020', value: 2020 },
                { name: '2021', value: 2021 },
                { name: '2022', value: 2022 },
            )
    )
    .addChannelOption((option) =>
        option
            .setName('channel')
            .setDescription('The channel to send the message to')
            .addChannelTypes(ChannelType.GuildText)
            .setRequired(true)
    );


export default registerCommand.toJSON();