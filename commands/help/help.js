const Discord = require('discord.js');
const fs = require('fs');


function getHelpData(){
    const files = fs.readdirSync(__dirname+'/..');
    let helpCommands = []
    for(let file of files){
        try {
            if(require(`${__dirname}/../${file}/data.json`).help.commands){
                console.log("He leido correctamente en "+`${__dirname}/${file}/data.json`)
                let commandsPerFile = require(`${__dirname}/../${file}/data.json`).help.commands;
                let commands = [];
                for(let command of commandsPerFile){
                    commands.push(command)
                }
                helpCommands.push({
                    theme: file,
                    commands: commands
                })
            }else{
                console.log("No existe comando descripción help en directorio "+`${__dirname}/../${file}/data.json`)
            }
        } catch (error) {
            console.log("No existe comando descripción help en directorio "+`${__dirname}/../${file}/data.json`)
        }
    }

    /* for(let theme of helpCommands){
        console.log(theme.theme)
        for(let command of theme.commands){
            console.log(command)
        }
    } */
    return helpCommands;
}

module.exports = {
    name: 'help',
    category: 'Valorant',
    premium: false,
    alias: ['h'],
    run: async (client, message, args) => {
        
        console.log(message); 
        let categoryCommands = getHelpData();

        let stringHelps = '**Estos son los comandos disponibles SotaCode Services\n\n**'
        for(let category of categoryCommands){
            console.log(category.theme)
            stringHelps += category.theme+'\n'
            for(let command of category.commands){
                console.log(command)
                stringHelps += ` -${command.command}\t -${command.shortCommand}:\t ${command.description}`
            }
            stringHelps += '\n\n'
        }

        message.channel.send(`${stringHelps}`);       
    }
};


