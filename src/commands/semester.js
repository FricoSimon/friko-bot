import { SlashCommandBuilder, } from 'discord.js';

const semesterCommand = new SlashCommandBuilder()
    .setName('semester')
    .setDescription('Set your current semester.')

export default semesterCommand;