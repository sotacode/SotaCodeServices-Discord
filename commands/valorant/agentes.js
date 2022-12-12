const Discord = require('discord.js');
const axios = require('axios');

module.exports = {
    name: 'agentes',
    category: 'Valorant',
    premium: false,
    alias: ['va'],
    run: async (client, message, args) => {

        axios.get('https://valorant-api.com/v1/agents')
        .then(response => {
            if(args.length == 0){
                returnAllAgents(message, response);
            }else{
                returnAgentByName(message, response, args);
            }
        })
        .catch(error => {
            message.channel.send('.')
            .then(msg=>{
                msg.edit({
                    embeds: [ new Discord.EmbedBuilder()
                                        .setColor('BLUE')
                                        .setTitle('Error:')
                                        .setDescription(`Hubo un error de conexión con la base de datos, vuelve a intentar mas tarde.`)
                            ]
                });
            })
            console.log(error);
        });

        
    }
};

returnAllAgents =  (message, response) => {
    let agentes = '';
    for (agente of response.data.data) {
        agentes += agente.displayName + '\n';
    }
    message.channel.send('.')
    .then(msg=>{
        msg.edit({
            embeds: [ new Discord.EmbedBuilder()
                                .setColor('BLUE')
                                .setImage(response.data.data[0].fullPortrait)
                                .setTitle('Los agentes de Valorant son:')
                                .setDescription(agentes)
                    ]
        });
    })
}


returnAgentByName = (message, response, args) => {
    for (agente of response.data.data) {
        if (agente.displayName.toLowerCase() == args[0].toLowerCase()){
            message.channel.send('.')
            .then(msg=>{
                msg.edit({
                    embeds: [ new Discord.EmbedBuilder()
                                        .setColor('BLUE')
                                        .setImage(agente.fullPortrait)
                                        .setTitle(agente.displayName)
                            ]
                });
            });
            return;
        }
    }
    message.channel.send('.')
        .then(msg=>{
            msg.edit({
                embeds: [ new Discord.EmbedBuilder()
                                    .setColor('BLUE')
                                    .setTitle('Error')
                                    .setDescription('No existe el agente perrito')
                        ]
            });
        });
}