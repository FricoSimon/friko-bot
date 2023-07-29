import { SlashCommandBuilder } from 'discord.js';

const joinVoiceCommand = new SlashCommandBuilder()
    .setName('voice')
    .setDescription('Join a voice channel.');

export default joinVoiceCommand;
