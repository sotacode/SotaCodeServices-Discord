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
    let i = 0
    for (agente of response.data.data) {
        if(i%6==0 && i!=0) agentes += agente.displayName +'\n'
        else agentes += agente.displayName;
        
        if(i!=response.data.data.length - 1) agentes += ' - ';
        i++;
    }
    embedsData = new Discord.EmbedBuilder()
                            .setTitle('Los agentes de Valorant son:')
                            .setDescription(agentes)
                            .setColor(0x0099FF)
                            .setURL('https://discord.js.org/')
                            //.setAuthor({ name: 'Tema: Valorant', iconURL: 'https://i.imgur.com/A12drNs.png', url: 'https://playvalorant.com/es-mx/?gclid=Cj0KCQiA4uCcBhDdARIsAH5jyUkBKqSexCvSFYlJDqymwynSDeASx-Vz0d9TatNTdu4vFKCfE0oIc5YaAmWrEALw_wcB&gclsrc=aw.ds' })
                            .setAuthor({ name: 'Tema: Valorant', url: 'https://playvalorant.com/es-mx/?gclid=Cj0KCQiA4uCcBhDdARIsAH5jyUkBKqSexCvSFYlJDqymwynSDeASx-Vz0d9TatNTdu4vFKCfE0oIc5YaAmWrEALw_wcB&gclsrc=aw.ds' })
                            //.setDescription('Some description here')
                            .setThumbnail('https://i.imgur.com/A12drNs.png')
                            /* .addFields(
                                { name: 'Regular field title', value: 'Some value here' },
                                { name: '\u200B', value: '\u200B' },
                                { name: 'Inline field title', value: 'Some value here', inline: true },
                                { name: 'Inline field title', value: 'Some value here', inline: true },
                            )
                            .addFields({ name: 'Inline field title', value: 'Some value here', inline: true }) */
                            //.setImage('https://i.imgur.com/AfFp7pu.png')
                            //.setTimestamp()
                            .setFooter({ text: 'Created by SotaCode', iconURL: 'https://i.imgur.com/Vzvutwg.jpg' })

    message.channel.send('.')
    .then(msg=>{
        msg.edit({
            embeds: [ embedsData ]
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