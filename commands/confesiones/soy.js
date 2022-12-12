const Discord = require('discord.js');
const frases = require('./data.json').Soy.Frases;

module.exports = {
    name: 'soy',
    category: 'Valorant',
    premium: false,
    alias: [],
    run: async (client, message, args) => {
        console.log(message);
        
        message.channel.send(`${message.author} `+ frases[Math.floor(Math.random()*frases.length)]);       
    }
};


