import { SlashCommandBuilder, } from 'discord.js';

const ownerCommand = new SlashCommandBuilder()
    .setName('owner')
    .setDescription('Get the owner of this bot.');

export default ownerCommand;