import { SlashCommandBuilder } from 'discord.js';

const dadJokesCommand = new SlashCommandBuilder()
    .setName('dadjokes')
    .setDescription('Get a dad joke.');

export default dadJokesCommand;
