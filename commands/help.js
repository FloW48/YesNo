const Discord = require('discord.js');
const Command = require('./command');

module.exports = class Help extends Command{
    static match(message){
        return message.content.startsWith('!ghelp')
    }

    static action(message, bot){
        var args = message.content.split(' ');
        var urlAvatarFloW = bot.users.fetch('256054054260572161').then(user => urlAvatarFloW = user.avatarURL())
    

        if(args.length == 1){
            const embed = new Discord.MessageEmbed();
            embed.setTitle("Besoin d'aide ? Gilou est là pour t'aider !")
            embed.setAuthor(bot.user.username,  bot.user.avatarURL())
            embed.setTimestamp(Date.now());
            embed.setColor([240,176,255])

            embed.addField("🎵 Commandes audio 🎵", 
            ">>> • !gplay ou !p `<lien>` ou `<mot clé>`\n"+
            " • !gstop\n"+
            " • !gskip\n"+
            " • !gpause (si déjà en pause, relance la musique)\n"+
            " • !grepeat (passe en boucle la musique actuelle)\n"+
            " • !gnp (pour obtenir la chanson en train d'être jouée)\n"+
            " • !glist (pour obtenir toutes les musiques dans la queue)\n")

            embed.addField("🤡 Commandes Gif Ingénieur 🤡", 
            ">>> • !gif change `<lien gif>`\n"+
            " • !gif get")

            var urlAvatarFloW = bot.users.fetch('256054054260572161').then(user => 
                {
                    urlAvatarFloW = user.avatarURL()
                    embed.setFooter("Owner : FloW", urlAvatarFloW)
                    message.channel.send(embed);
                })
        }
        //const embed = new Discord.MessageEmbed();
        //embed.setTitle('Besoin d\'aide ? Gilou est là pour ça !');
        //embed.setColor('#ff33cc');
        //embed.setDescription('!gplay + Mots Clés ou Lien ```Effectue une recherche sur YouTube en cas de mots clés, et séléctionne le premier résultat.\nSi vous entrez un lien de vidéo, le son sera joué, si vous entrez un lien de playlist, toutes les musiques seront ajoutées à la file d\'attente``` \n\n !gskip : ```Passe à la musique suivante``` \n\n !gnp ```Donne le nom de la musique qui se joue actuellement```\n\n !gstop : ```Déconnecte Gilou et enlève toutes les belles chansons qu\'il voulait jouer de la file d\'attente```')
        //message.channel.send(embed);
    }
}