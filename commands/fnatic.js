const Command = require('./command');

module.exports = class Fnatic extends Command{

    static match(message){
        if(message.member._roles.indexOf('717823652623810671') >= 0){
            showAndDeleteMessage(message, "**Let's go FNA TIC !! (bruit de foule en délire)**")
        }
    }
    

}

function showAndDeleteMessage(message, str){
    message.channel.send(str)
    .then((messageToDel) => {
        messageToDel.delete({timeout: 1000});
    });
}