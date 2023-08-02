import { ChannelType, SlashCommandBuilder } from 'discord.js';

const scheduleCommand = new SlashCommandBuilder()
    .setName('schedule')
    .setDescription('Schedule a message')
    .addStringOption(option =>
        option.setName('message')
            .setDescription('Type your message')
            .setRequired(true)
    )
    .addIntegerOption(option =>
        option.setName('time')
            .setDescription('Set the time')
            .setRequired(true)
            .addChoices(
                { name: '5 Sec', value: 5000 },
                { name: '1 Min', value: 60000 },
                { name: '5 Min', value: 300000 },
                { name: '10 Min', value: 600000 },
                { name: '30 Min', value: 1800000 },
            )
    )
    .addChannelOption(option =>
        option
            .setName('channel')
            .setDescription('The channel to send the message to')
            .addChannelTypes(ChannelType.GuildText)
            .setRequired(true)
    );

export default scheduleCommand;
