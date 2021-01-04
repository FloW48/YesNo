const Discord = require('discord.js');
const bot = new Discord.Client();

var users = []

var bannedWords = ["oui", "non"]
var botOn = true
var pauseBot = false
var timeout = 10000;

bot.on('ready', function(){
    let isOn =  botOn ? 'on' : 'off'
    bot.user.setActivity("Bot "+isOn).catch(console.error);
})

bot.on('message', function(message){
    if(botOn && !pauseBot){
        checkMessage(message)
    }
    commands(message)
})

bot.login('tauken')
    .catch(console.error);


function checkMessage(message){
    message.content = message.content.toLowerCase()
    const args = message.content.split(/[ ,.:_*/;?!]/);
    if(message.channel.id == "666563454517248006"){
        for(i = 0; i < args.length; i++){
            if(bannedWords.indexOf(args[i]) != -1){
                goulag(message)
            }
        }
    }
}

async function goulag(message){
    let member = await message.member
    let role = await message.guild.roles.cache.find(r => r.name == 'Goulag');    
    member.roles.add(role)
    let user = findUser(message.author.id)
    if(findUser(message.author.id) == undefined){
        users.push({"id":message.author.id, "time":10})
    }
    else{
        user.time += 10;
    }
    setTimeout(function() {
        member.roles.remove(role)
    }, timeout)
}

function findUser(searchId){
    for(var i = 0; i < users.length; i++){
        if(users[i].id == searchId){
            return users[i];
        }
    }
    return undefined;
}


async function commands(message){
    message.content = message.content.toLowerCase()
    const args = message.content.split(/[ ,.:_*/;?!]/);
    if(message.content.startsWith("nion state")){
        let isOn =  botOn ? 'on' : 'off'
        message.channel.send("Bot is **"+isOn+"**")
    }
    else if(message.content.startsWith("nion show")){
        pauseBot = true;
        let stringBuilder = ""
        for(i = 0; i < bannedWords.length; i++){
            stringBuilder += bannedWords[i]+", "
        }
        message.channel.send("Mots bannis : "+stringBuilder)
        pauseBot = false;
    }
    else if(message.content.startsWith("nion help")){
        const embed = new Discord.MessageEmbed();
        embed.setTitle("Ni oui ni non")
        embed.setAuthor(bot.user.username,  bot.user.avatarURL())
        embed.setTimestamp(Date.now());
        embed.setColor([240,176,255])

        embed.addField("Commandes pour tout le monde", 
        ">>> • nion state\n"+
        " • nion show\n"+
        "• nion mytime [mention]\n"+
        "• nion ranking"
        )

        embed.addField("Commandes pour admin", 
        ">>> • nion on/off\n"+
        " • nion ban/unban `word`")
        message.channel.send(embed);
    }
    else if(message.content.startsWith("nion mytime")){
        if(args.length == 2){
            let user = findUser(message.author.id)
            if(user == undefined){
                message.channel.send("<@"+message.author.id+">, vous n'avez jamais été goulag, gg à vous")
            }
            else{
                message.channel.send("<@"+message.author.id+">, vous avez été goulag "+user.time+" secondes");
            }
        }
        else{
            let argsMsg = args[3].split(/[<@>]/);
            let id = argsMsg[0];
            let user = findUser(id)
            if(user == undefined){
                message.channel.send("<@"+id+">, n'a jamais été goulag, gg à lui/elle");
            }
            else{
                message.channel.send("<@"+id+">, a été goulag "+user.time+" secondes");
            }
        }
    }
    else if(message.content.startsWith("nion ranking") || message.content.startsWith("nion leaderboard")){
        users.sort(function(a,b){
            return b.time - a.time;
        });


        const embed = new Discord.MessageEmbed();
        embed.setTitle("Goulag Leaderboard")
        embed.setAuthor(bot.user.username,  bot.user.avatarURL())
        embed.setTimestamp(Date.now());
        embed.setColor([240,176,255])
        if(users.length == 0){
            embed.addField("Personne de goulag, gg", "Faites vous ban en écrivant un banword et vous apparaîtrez ici");
            message.channel.send(embed);
        }
        else{
            for(var i = 0; i < users.length && i < 10; i++){
                await bot.guilds.fetch("626684559345451010").then(function(guild){
                    guild.members.fetch(users[i].id.toString()).then(function(member){
                        userName = member.displayName;
                        embed.addField((i+1)+" - "+userName, 
                        ">>> "+users[i].time+" sec"
                        )
                    })
                })
            }
            message.channel.send(embed);
        }
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
        else if(message.content.startsWith("nion ban ")){
            bannedWords.push(args[2])
            message.channel.send(args[2]+" est désormais un mot banni")
        }
        else if(message.content.startsWith("nion unban ")){
            bannedWords.splice(bannedWords.indexOf(args[2]), 1);
            message.channel.send(args[2]+" n'est désormais plus un mot banni")
        }
    }
}

