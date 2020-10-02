const Discord = require('discord.js');
const bot = new Discord.Client();

var bannedWords = ["oui", "non"]
var botOn = true
var pauseBot = false

bot.on('ready', function(){
    let isOn =  botOn ? 'on' : 'off'
    bot.user.setActivity("Bot "+isOn).catch(console.error);
})

bot.on('message', function (message){
    if(botOn && !pauseBot && message.channel.id == "666563454517248006"){
        checkMessage(message)
    }
    changeState(message)
})

bot.login('NzYxNTA4NTQyOTUxMTk0NjQ2.X3boGA.cjJic_A6XM0R7GlJ2FnTbSrHKYg')
    .catch(console.error);


function checkMessage(message){
    message.content = message.content.toLowerCase()
    const args = message.content.split(/[ ,.:_*/;?!]/);
    console.log(args)
    if(message.author.id == "256054054260572161"){
        if(message.content.startsWith("nion add ")){
            bannedWords.push(args[2])
        }
        else if(message.content.startsWith("nion remove ")){
            bannedWords.splice(bannedWords.indexOf(args[2]), 1);
        }
    }
    if(message.content.startsWith("nion show")){
        pauseBot = true;
        let stringBuilder = ""
        for(i = 0; i < bannedWords.length; i++){
            stringBuilder += bannedWords[i]+", "
        }
        message.channel.send("Mots bannis : "+stringBuilder)
        pauseBot = false;
    }
    else{
        for(i = 0; i < args.length; i++){
            if(bannedWords.indexOf(args[i]) != -1){
                member = message.member
                let role = message.guild.roles.cache.find(r => r.name === "Combatant");
                goulag(member, role)
            }
        }
    }
}

function goulag(member, role){
    member.roles.add(role)
    setTimeout(function() {
        member.roles.remove(role)
    }, 10000)
}

function changeState(message){
    if(message.content.startsWith("nion state")){
        let isOn =  botOn ? 'on' : 'off'
        message.channel.send("Bot is **"+ isOn+"**")
    }
    if(  (message.member != null && message.member.hasPermission("ADMINISTRATOR")) || message.author.id == 256054054260572161 ){
        if(message.content.startsWith("nion on")){
            message.channel.send("Bot turned **on**")
            botOn = true
            let isOn =  botOn ? 'on' : 'off'
            bot.user.setActivity("Bot "+isOn).catch(console.error);
        }
        else if(message.content.startsWith("nion off")){
            message.channel.send("Bot turned **off**")
            botOn = false
            let isOn =  botOn ? 'on' : 'off'
            bot.user.setActivity("Bot "+isOn).catch(console.error);
        }
    }
}

