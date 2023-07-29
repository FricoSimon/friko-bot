import { SlashCommandBuilder, } from 'discord.js';

const translateCommand = new SlashCommandBuilder()
    .setName('translate')
    .setDescription('Translate a message (English / Indonesian).')

export default translateCommand;