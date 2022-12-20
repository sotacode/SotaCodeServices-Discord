const Discord = require('discord.js');
const axios = require('axios');
const { ButtonBuilder, EmbedBuilder } = require('@discordjs/builders');

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
    const IDRANDOM = Math.floor(Math.random() * response.data.data.length);
    message.channel.send('.')
    .then(msg=>{
        msg.edit({
            embeds: [ new Discord.EmbedBuilder()
                                .setColor('BLUE')
                                .setImage(response.data.data[IDRANDOM].fullPortrait)
                                .setTitle('AGENTE: '+ response.data.data[IDRANDOM].displayName)
                                //.setDescription(agentes)
                    ]
        });
    })
}


returnPickPerUser = async (message, response, args) => {
    let pickedAgent = []
    let imgAgents = []
    let dataToEmbed = []
    for(let i=0; i<message.mentions.users.size; i++){
        let random = Math.floor(Math.random() * response.data.data.length);
        let agente = response.data.data[random].displayName;
        while(pickedAgent.includes(agente)){
            random = Math.floor(Math.random() * response.data.data.length);
            agente = response.data.data[random].displayName;
        }
        pickedAgent.push(agente);
        imgAgents.push({name: agente, img: response.data.data[random].fullPortraitV2})
    }

    let i = 0;
    let embeds = []
    message.mentions.users.forEach((value, key) => {
        console.log(value)
        embeds.push(new EmbedBuilder().setTitle(`Agente para: ${value.username}`)
                                        .setDescription(`${imgAgents[i].name}`)
                                        .setImage(imgAgents[i].img)
                                        )
        i++;
      });

    await pagination(message, embeds);
}

/**
 * 
 * @param {Discord.CommandInteraction} interaction
 * @param {Array} embeds
 */
async function pagination(interaction, embeds){
    //console.log(interaction)
    let allButtons = new Discord.ActionRowBuilder().addComponents(
        new ButtonBuilder().setCustomId('0').setLabel('⏮').setStyle('Secondary'),
        new ButtonBuilder().setCustomId('1').setLabel('⏪').setStyle('Secondary'),
        new ButtonBuilder().setCustomId('2').setLabel('⏩').setStyle('Secondary'),
        new ButtonBuilder().setCustomId('3').setLabel('⏭').setStyle('Secondary'),
    )
    //Send message if embeds is 1
    if(embeds.length===1){
        if(interaction.deferred){
            return interaction.followUp({
                embeds: [embeds[0]]
            })
        }else{
            return interaction.reply({
                embeds: [embeds[0]]
            })
        }
    }

    embeds = embeds.map((embed, index)=>{
        return embed.setFooter({
            text: `Page ${index + 1}/${embeds.length}`,
            iconURL: interaction.guild.iconURL({dynamic: true})
        });
    })
    let sendMsg;

    if(interaction.deferred){
        sendMsg = await interaction.followUp({
            embeds: [embeds[0]],
            components: [allButtons],
        })
    }else{
        sendMsg = await interaction.reply({
            embeds: [embeds[0]],
            components: [allButtons],
        })
    }


    let filter = m => m.member.id === interaction.member.id

    const collector = await sendMsg.createMessageComponentCollector({
        filter: filter,
        time: 30000
    });

    let currentPage = 0;
    collector.on('collect', async (b)=>{
        if(b.isButton){
            await b.deferUpdate().catch(e=>null)
            //page first
            switch (b.customId) {
                case "0":
                    {
                        if(currentPage!= 0) {
                            currentPage = 0;
                            await sendMsg.edit({
                                embeds: [embeds[currentPage]],
                                components: [allButtons]
                            }).catch(e=>null)
                        }
                    }
                    break;
                case "1":
                    {
                        if(currentPage!= 0) {
                            currentPage -= 1;
                            await sendMsg.edit({
                                embeds: [embeds[currentPage]],
                                components: [allButtons]
                            }).catch(e=>null)
                        }else{
                            currentPage = embeds.length - 1;
                            await sendMsg.edit({
                                embeds: [embeds[currentPage]],
                                components: [allButtons]
                            }).catch(e=>null)
                        }
                    }
                    break;
                case "2":
                    {
                        if(currentPage!= embeds.length - 1) {
                            currentPage += 1;
                            await sendMsg.edit({
                                embeds: [embeds[currentPage]],
                                components: [allButtons]
                            }).catch(e=>null)
                        }else{
                            currentPage = 0;
                            await sendMsg.edit({
                                embeds: [embeds[currentPage]],
                                components: [allButtons]
                            }).catch(e=>null)
                        }
                    }
                    break;
                case "3":
                    {
                        currentPage = embeds.length - 1;
                        await sendMsg.edit({
                            embeds: [embeds[currentPage]],
                            components: [allButtons]
                        }).catch(e=>null)
                    }
                    break;
            
                default:
                    break;
            }
        }
    })


    collector.on('end', async ()=>{
        allButtons.components.forEach((btn)=> btn.setDisabled(true))
        await sendMsg.edit({
            embeds: [embeds[currentPage]],
            components: [allButtons]
        }).catch(e=>null)
    })

}