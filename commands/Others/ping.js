const Discord = require('discord.js');
const ms = require('ms');
const {db, config} = require('../../DataBase/db')

module.exports = {
    name: 'ping',
    category: 'Others',
    premium: false,
    alias: ['p'],
    run: async (client, message, args) => {
        try {
            let query = "SELECT * FROM user"
            let result = db.mysql(config,query).data.rows
            console.log(result)
        } catch (error) {
            console.log(error);
        }
        message.channel.send('.')
            .then(msg=>{
                let ping = msg.createdTimestamp - message.createdTimestamp;
                msg.edit({
                    embeds: [ new Discord.EmbedBuilder()
                                        .setColor('BLUE')
                                        .setTitle('Tu Ping es:')
                                        .setDescription(`*Mensaje*: ${ping} 😲\n`)
                            ]
                });
                
            })
    }
};