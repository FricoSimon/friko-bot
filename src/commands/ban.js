import { SlashCommandBuilder, } from 'discord.js';

const banCommand = new SlashCommandBuilder()
    .setName('ban')
    .setDescription('Ban a user from the server.')
    .addSubcommand(subcommand =>
        subcommand
            .setName('user')
            .setDescription('Ban a user from the server.')
            .addUserOption(option =>
                option
                    .setName('user')
                    .setDescription('The user to ban.')
                    .setRequired(true)
            )
    );

export default banCommand.toJSON();