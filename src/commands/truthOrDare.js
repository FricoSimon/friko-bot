import { SlashCommandBuilder } from 'discord.js';

const truthOrDareCommand = new SlashCommandBuilder()
    .setName('truthordare')
    .setDescription('Play a game of Truth or Dare.');

export default truthOrDareCommand;
