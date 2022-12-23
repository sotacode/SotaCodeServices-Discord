const Discord = require('discord.js');
const Canvas = require('canvas');
const fs = require('fs');

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


client.on('ready',async()=>{
    /* Canvas.registerFont('assets/Fonts/onepiecefont.ttf', {family: 'OnePiece'})
    const canvas = Canvas.createCanvas(1018, 468);
    ctx = canvas.getContext("2d");
    ctx.globalAlpha = 0.3;
    const background = await Canvas.loadImage("https://i.imgur.com/trVhBB8.jpg")
    ctx.drawImage(background,0,0,canvas.width, canvas.height);
    ctx.globalAlpha = 1.0;

    ctx.fillStyle = "#ffffff"
    ctx.strokeStyle = "#000"
    ctx.font = '50px "Arial"'
    ctx.fillText("🏴‍☠️ Tripulación Los Mancos 🏴‍☠️", 190, 60)
    ctx.strokeText(`🏴‍☠️ Tripulación Los Mancos 🏴‍☠️`, 190, 60)

    ctx.fillStyle = "#ffffff"
    ctx.strokeStyle = "#000"
    ctx.font = '120px "OnePiece"'
    ctx.fillText("Bienvenid@", 460, 240)
    ctx.fillText(`${'Nelsota'}`, 460, 340)
    ctx.strokeText("Bienvenid@", 460, 240)
    ctx.strokeText(`${'Nelsota'}`, 460, 340)
    
    ctx.beginPath()
    ctx.arc(247, 278, 150, 0, Math.PI * 2, true)
    ctx.lineWidth = 8;
    ctx.stroke();
    ctx.closePath()
    ctx.clip()
    
    const avatar = await Canvas.loadImage("https://i.imgur.com/Vzvutwg.jpg")
    ctx.drawImage(avatar,97,127, 301, 301)

    fs.writeFileSync('out.png', canvas.toBuffer()) */

});

/* client.on('guildMemberAdd',async  (member) => {
    if(member.guild.id === "752716924298723448"){
        Canvas.registerFont('assets/Fonts/onepiecefont.ttf', {family: 'OnePiece'})
        const canvas = Canvas.createCanvas(1018, 468);
        ctx = canvas.getContext("2d");
        ctx.globalAlpha = 0.5;
        const background = await Canvas.loadImage("https://i.imgur.com/trVhBB8.jpg")
        ctx.drawImage(background,0,0,canvas.width, canvas.height);
        ctx.globalAlpha = 1.0;

        ctx.fillStyle = "#ffffff"
        ctx.strokeStyle = "#000"
        ctx.font = '50px "Arial"'
        ctx.fillText("🏴‍☠️ Tripulación Los Mancos 🏴‍☠️", 190, 60)
        ctx.strokeText(`🏴‍☠️ Tripulación Los Mancos 🏴‍☠️`, 190, 60)

        ctx.fillStyle = "#ffffff"
        ctx.strokeStyle = "#000"
        ctx.font = '120px "OnePiece"'
        ctx.fillText("Bienvenid@", 460, 240)
        ctx.fillText(`${member.user.username}`, 460, 340)
        ctx.strokeText("Bienvenid@", 460, 240)
        ctx.strokeText(`${member.user.username}`, 460, 340)

        ctx.beginPath()
        ctx.arc(247, 258, 175, 0, Math.PI * 2, true)
        ctx.lineWidth = 8;
        ctx.stroke();
        ctx.closePath()
        ctx.clip()

        const avatar = await Canvas.loadImage(member.user.displayAvatarURL({dynamic:true, size: 1024, extension: 'jpg'}))
        ctx.drawImage(avatar,72,83, 350, 350)

        const attachment = new Discord.AttachmentBuilder(canvas.toBuffer(), "Bienvenida.png")
        client.channels.cache.get("1055624860920971324").send({files: [attachment]})
        
    }
}); */


client.login(process.env.TOKEN_DISCORD).then(()=>{
    console.log(`${client.user.username} se ha conectado`);

    const {readdirSync} = require('fs');

    client.commands = new Discord.Collection();

    for (const fileEvent of readdirSync('./events/')) {
        if(fileEvent.endsWith('.js')){
            const fileName = fileEvent.substring(0,fileEvent.length - 3);
            const fileContent = require(`./events/${fileEvent}`);
            client.on(fileName, fileContent.bind(null, client, process.env.PREFIX_DISCORD));
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