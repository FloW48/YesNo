const Command = require('./command');

var gif = "https://tenor.com/view/they-dont-stop-coming-rap-all-star-gif-14395546";

module.exports = class Gif extends Command{

    static match(message){
        if(message.content.startsWith("!gif change ") || message.content.startsWith("!cg")){
            var args = message.content.split(' ');
            var gifUrl = args[2];
            if(gifUrl.includes('tenor') || gifUrl.includes("giphy")){
                gif = gifUrl;
                message.channel.send("**Gif d'ingénieur changé**")
                message.delete()
            }
            else{
                message.channel.send("**Ce n'est pas un gif ça monsieur**")
            }
        }
        else if(message.content.startsWith("!gif get")){
            message.channel.send(gif);
            message.delete()
        }
    }
    
    static getGif(){
        return gif;
    }

}

function showAndDeleteMessage(message, str){
    message.channel.send(str)
    .then((messageToDel) => {
        messageToDel.delete({timeout: 1000});
    });
}

