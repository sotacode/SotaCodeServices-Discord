module.exports = async (client, PREFIX, message) => {
    if( 
        message.author.bot ||
        message.channel.type == 'DM' ||
        !message.content.startsWith(PREFIX)
    ){
        return;
    }

    let args = message.content.slice(PREFIX.length).trim().split(/ +/);
    let command = args.shift().toLowerCase();
    let cmd = client.commands.get(command) || client.commands.find(x=> x.alias.includes(command));

    if(!cmd){
        return message.reply('El comando que usaste no existe bro');
    }else{
        await cmd.run(client, message, args);
    }


    console.log(PREFIX + message.content + PREFIX);
}