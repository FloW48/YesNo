const Command = require('./command');
const ytdl = require ('ytdl-core');
const YouTube = require('simple-youtube-api')
const youtube = new YouTube('AIzaSyCmeV3veizmR4y0bVlNtdJ38xo4UVTgtK8')

queue = []
singing = false
var dispatcher;
var repeat = false;
var url
var paused = false;

module.exports = class Play extends Command{

    static match (message){
        return message.content.startsWith('!gilouplay') || message.content.startsWith('!gplay') || message.content.startsWith('!p') ||
        message.content.startsWith('!gilouskip') || message.content.startsWith('!gskip') || 
        message.content.startsWith('!gnp') || message.content.startsWith('!gnowplaying') ||
        message.content.startsWith('!glist') ||
        message.content.startsWith('!gstop') || message.content.startsWith('!giloustop') ||
        message.content.startsWith('!gpause') ||
        message.content.startsWith('!grepeat') || message.content.startsWith('!gr') ||
        message.content.startsWith('!alvityl')
    }

    static playActivyl(bot){
        if(!singing){
            bot.channels.fetch('339020307203620865').then(channel =>{
                channel.join()
                .then(connection => {
                    singing = true;
                    dispatcher = connection.play('Alvityl.mp3', {volume : 6})
                    .on('error', () => {
                        message.channel.send('**__Une erreur s\'est produite, veuillez réessayer__**')
                    })
        
                    dispatcher.on('finish', function(){
                        singing = false;
                        connection.disconnect();
                    })
                })
            }) .catch(console.error);
        }
    }


    static async action(message){
        if (message.content.startsWith('!gskip') || message.content.startsWith('!gilouskip')){
            skipMusic(message)
        }

        
        else if (message.content.startsWith('!gilouplay') || message.content.startsWith('!gplay') || message.content.startsWith('!p')){
            const args = message.content.split(' ');
            const searchString = args.slice(1).join(' ');
            url = args[1] ? args[1].replace(/<(.+)>/g, '$1') : '';

            if (message.content.includes('/playlist?') || message.content.includes('list')){
                try {
                    let i;
                    var playlist = await youtube.getPlaylist(url);
                    var videos = await playlist.getVideos();
                    var video = videos[0]
                    url = video.url
                    for (i = 0; i < videos.length; i++){
                        queue.push(videos[i].url)
                    }
                    showAndDeleteMessage(message, '**'+videos.length+' vidéos ont été ajoutés à la liste d\'attente**');
                } catch (error) {
                    return console.log('Erreur lors du chargement de la playlist' + error)
                }
            }
            else{    
                try {
                    var video = await youtube.getVideoByID(url)
                } catch (error) {
                    try {
                        var videos = await youtube.searchVideos(searchString, 1);
                        var video = await youtube.getVideoByID(videos[0].id);
                    } catch (err) {
                        console.log(err)
                        return showAndDeleteMessage(message, '**__No result__**')
                    }
                }
                url = video.url 
            }
            if (ytdl.validateURL(url)){
                if (singing === false){
                    singing = true
                    let voiceChannel = message.member.voice.channel;
                    if (!message.content.includes('/playlist?')) queue.push(url)
                    await voiceChannel.join()
                    .then(connection => {
                        playMusic(queue[0], connection, message);
                    })
                    .catch(console.error);
                }
                else{
                    queue.push(url)
                    showAndDeleteMessage(message, '**'+video.title+'**' + ' ajoutée à la file d\'attente')
                }
            }
            else{
                showAndDeleteMessage(message, '**__Erreur URL non valide__**')
            }            
        }


        else if (message.content.startsWith('!gnp' || message.content.startsWith('!gnowplaying'))) {
            let info = await getVideoInfo(queue[0])
            if (info.length.hours === 0) isPlayingMess = showAndDeleteMessage(message, 'Voici ce que je chante acutellement : ' +'**'+info.title+' '+'('+info.length.minutes+(9<info.length.seconds? ':' : ':0')+info.length.seconds+')'+'**' )
            else isPlayingMess = showAndDeleteMessage(message, 'Voici ce que je chante acutellement : ' +'**'+info.title+' '+'('+info.length.hours+(9<info.length.minutes? ':' : ':0')+info.length.minutes+(9<info.length.seconds? ':' : ':0')+info.length.seconds+')'+'**');
        }


        else if (message.content.startsWith('!glist')){
            let i;
            let info; 
            message.channel.send('Liste des musiques dans la queue : \n')
            for (i = 0; i < queue.length; i++){
                info = await getVideoInfo(queue[i]).catch(err =>{
                    console.log(err)
                })
                if (info.length.hours === 0) message.channel.send('**'+info.title+' '+'('+info.length.minutes+(9<info.length.seconds? ':' : ':0')+info.length.seconds+')'+'**' );
                else message.channel.send('**'+info.title+' '+'('+info.length.hours+(9<info.length.minutes? ':' : ':0')+info.length.minutes+(9<info.length.seconds? ':' : ':0')+info.length.seconds+')'+'**');
            }
        }


        else if (message.content.startsWith('!gstop') || message.content.startsWith('!giloustop')){
            queue = [];
            singing = false;
            showAndDeleteMessage(message, '**Gilou a fini de chanter, il va se reposer maintenant**')
            message.member.voice.channel.leave();
        }


        else if (message.content.startsWith('!gpause')){
            if(singing){
                if(paused){
                    dispatcher.resume();
                    paused = !paused
                    showAndDeleteMessage(message, "**Je remets le son bébé**")
                }
                else{
                    dispatcher.pause();
                    paused = !paused
                    showAndDeleteMessage(message, "**Je mets pause, tu peux aller pisser**")
                }
            }    
        }

        else if (message.content.startsWith('!grepeat') || message.content.startsWith('!gr')){
            repeat = !repeat
            if(repeat) { showAndDeleteMessage(message, 'Je jouerai cette musique jusqu\' à ma ***MORT***') }
            else { showAndDeleteMessage(message, 'J\'avoue on en a marre de cette musique au bout d\'un moment') }
        }


        else if (message.content.startsWith('!alvityl')){
            if (singing === false){
                singing = true
                let voiceChannel = message.member.voice.channel;
                await voiceChannel.join()
                .then(connection => {
                    dispatcher = connection.play('Alvityl.mp3', {volume : 6})
                    .on('error', () => {
                        message.channel.send('**__Une erreur s\'est produite, veuillez réessayer__**')
                    })

                    dispatcher.on('finish', function(){
                        singing = false;
                        connection.disconnect();
                    })
                })
                .catch(console.error);
            }

        }
    }   
      
}   

async function showAndDeleteMessage(message, str){
    message.channel.send(str)
    .then((messageToDel) => {
        messageToDel.delete({timeout: 10000});
    });
}

async function playMusic(urlToPlay, connection, message){
    let info = await getVideoInfo(urlToPlay)
    stream = ytdl(urlToPlay, {filter : 'audioonly'})
    if (info.length.hours === 0) isPlayingMess = message.channel.send('Gilou chante : ' +'**'+info.title+' '+'('+info.length.minutes+(9<info.length.seconds? ':' : ':0')+info.length.seconds+')'+' => '+'**' +urlToPlay);
    else isPlayingMess = message.channel.send('Gilou chante : ' +'**'+info.title+' '+'('+info.length.hours+(9<info.length.minutes? ':' : ':0')+info.length.minutes+(9<info.length.seconds? ':' : ':0')+info.length.seconds+')'+' => '+'**' +urlToPlay);
    
    dispatcher = connection.play(stream)
        .on('error', () => {
            message.channel.send('**__Une erreur s\'est produite, veuillez réessayer__**')
        })
    
        
    dispatcher.on('finish', function(){
        if(repeat){
            playMusic(queue[0], connection, message);
        }
        else{
            queue.splice(0, 1);
            isPlayingMess.then((messageToDel) => {
                messageToDel.delete()
            })
            if (queue.length != 0){
                playMusic(queue[0], connection, message);
                singing = true;
            }
            else{
                message.channel.send('**Gilou a fini de chanter, il va se reposer maintenant**')
                connection.disconnect();
                singing = false;
            }
        }
    })
}

function skipMusic(message){
    if(repeat){
        showAndDeleteMessage(message, "J'ai pris la décision de désactiver le repeat pour vous, ne me remercier pas");
        repeat = false;
    }
    dispatcher.end();
}

async function getVideoInfo(url){
    vid = await youtube.getVideo(url)
        .catch(err =>{
            console.log('Erreur dans getVideoInfo\n\n' + err)
        })
    songInfo = {
        id: vid.id,
        title: vid.title,
        url: vid.url,
        length: vid.duration
    }
    return songInfo
}