import { SlashCommandBuilder, } from 'discord.js';

const loginCommand = new SlashCommandBuilder()
    .setName('login')
    .setDescription('Login to your account')

export default loginCommand.toJSON();