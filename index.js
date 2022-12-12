const Discord = require('discord.js');
//console.log(process.argv)
//console.log(__dirname+'/.env.dev')
if(process.argv[3]==='dev')         require('dotenv').config({path: __dirname+'/.env.dev'})
else if(process.argv[3]==='prod')   require('dotenv').config({path: __dirname+'/.env'})


//console.log(process.env)


const client = new Discord.Client({
    intents: [
        'DirectMessageReactions',
        'DirectMessageTyping',
        'DirectMessages',
        'GuildBans',
        'GuildEmojisAndStickers',
        'GuildIntegrations',
        'GuildInvites',
        'GuildMembers',
        'GuildMessageReactions',
        'GuildMessageTyping',
        'GuildMessages',
        'GuildPresences',
        'GuildScheduledEvents',
        'GuildVoiceStates',
        'GuildWebhooks',
        'Guilds',
        'MessageContent'
    ]
});
const CONFIG = require('./config.json');


client.login(CONFIG.token).then(()=>{
    console.log(`${client.user.username} se ha conectado`);

    const {readdirSync} = require('fs');

    client.commands = new Discord.Collection();

    for (const fileEvent of readdirSync('./events/')) {
        if(fileEvent.endsWith('.js')){
            const fileName = fileEvent.substring(0,fileEvent.length - 3);
            const fileContent = require(`./events/${fileEvent}`);
            client.on(fileName, fileContent.bind(null, client, CONFIG.environment.PREFIX));
            delete require.cache[require.resolve(`./events/${fileEvent}`)];
        }        
    }


    for (const fileCommand of readdirSync('./commands/')) {
        for (const fileCommandCategory of readdirSync(`./commands/${fileCommand}`)){
            if(fileCommandCategory.endsWith('.js')){
                const fileName = fileCommandCategory.substring(0,fileCommandCategory.length - 3);
                const fileContent = require(`./commands/${fileCommand}/${fileCommandCategory}`);
                client.commands.set(fileName, fileContent);
            }  
        }      
    }


});

client.on('ready',()=>{
    console.log('Estoy activo');
    //client.channels.cache.get('999402473628377118').send('Estoy activo');
});

/* client.on('messageCreate', message => {
    if(message.content.toLowerCase().startsWith(CONFIG.environment.PREFIX+'hi')){
        client.channels.cache.get('999402473628377118').send(`Hola ${message.author.tag} cómo estai choro.`);
    }
}); */