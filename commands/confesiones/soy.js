const Discord = require('discord.js');
const frases = require('./data.json').Soy.Frases;

module.exports = {
    name: 'soy',
    category: 'Confesiones',
    premium: false,
    alias: ['s'],
    run: async (client, message, args) => {
        console.log(message);
        
        message.channel.send(`${message.author} `+ frases[Math.floor(Math.random()*frases.length)]);       
    }
};


