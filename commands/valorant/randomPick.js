const Discord = require('discord.js');
const axios = require('axios');

module.exports = {
    name: 'vpickrandom',
    category: 'Valorant',
    premium: false,
    alias: ['vpr'],
    run: async (client, message, args) => {

        axios.get('https://valorant-api.com/v1/agents')
        .then(response => {
            if(args.length == 0){
                returnOnePick(message, response);
            }else{
                returnPickPerUser(message, response, args);
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

returnOnePick =  (message, response) => {
    console.log(message)
    console.log("------")
    console.log(args)
    /* let agentes = '';
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
    }) */
}


returnPickPerUser = async (message, response, args) => {
    const embedsPaginates = []
    let page = 0
    const menciones = message.mentions.users
    console.log(message.mentions.users)
    console.log("------")
    menciones.forEach((value, key) => {
        embedsPaginates.push(new Discord.EmbedBuilder()
        .setColor('BLUE')
        .setTitle(`Pick para ${value}`)
        .setDescription(`Agente 1`))
    });

    const getRow = (id) =>{
        const row = new Discord.ActionRowBuilder()

        row.addComponents(
            new Discord.ButtonBuilder().setCustomId('prev_embed')
                                        .setStyle('SECONDARY')
                                        .setEmoji('⏪')
                                        .setDisabled(id===0)
        )
        row.addComponents(
            new Discord.ButtonBuilder().setCustomId('prev_embed')
                                        .setStyle('SECONDARY')
                                        .setEmoji('⏩')
                                        .setDisabled(id===embedsPaginates.length - 1)
        )

        return row
    }

    const renderEmbed = embedsPaginates[page]
    let reply = Discord.Message || undefined;
    let collector
    
    const filter = (i = Discord.InteractionCollector()) => console.log("Filter "+i)
    const time = 1000*60*5
    if (message) {
        reply = await message.reply({
            embeds: [renderEmbed],
            components: [getRow(page)]
        })
    } else {
        
    }
    message.channel.send('.')
        .then(msg=>{
            msg.edit({
                embeds: [ new Discord.EmbedBuilder()
                                    .setColor('BLUE')
                                    .setTitle('Etiquetando')
                                    .setDescription(`1: ${embedsPaginates[0]} y 2: ${embedsPaginates[1]}`)
                        ]
            });
        });
}