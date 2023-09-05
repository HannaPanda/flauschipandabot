import Speech from "speak-tts";

function _init() {
    /*const speech = new Speech();
    speech
        .init({
            volume: 0.5,
            lang: "en-GB",
            rate: 1,
            pitch: 1,
            //'voice':'Microsoft Katja - German (Germany) (de-DE)',
            //'splitSentences': false,
            listeners: {
                onvoiceschanged: voices => {
                    console.log("Voices changed", voices);
                }
            }
        })
        .then(data => {
            let messageQueue = [];
            let isShowing = false;

            var socket = io();
            socket.on('bot.say', function(msg) {
                messageQueue.push(msg);
            });

            window.setInterval(() => {
                if(!isShowing && messageQueue.length > 0) {
                    isShowing = true;
                    let $text = $('<p></p>');
                    let text = messageQueue.pop();
                    $text.text(text);
                    $text.hide();
                    $('#chat-wrapper').append($text);
                    $text.fadeIn(200).delay(Math.max(3000, text.split(' ').length/130*60000)).fadeOut(200, () => {
                        $text.remove();
                        isShowing = false;
                    });
                    speech.setLanguage('de-DE');
                    speech.setVoice('Microsoft Katja - German (Germany)');
                    speech
                        .speak({
                            text: text,
                            queue: false,
                            listeners: {
                                onstart: () => {},
                                onend: () => {},
                                onresume: () => {},
                                onboundary: event => {}
                            }
                        })
                        .then(data => {
                            isShowing = false;
                        })
                        .catch(e => {
                            isShowing = false;
                        });
                }
            }, 500)

            socket.on('reload', function(msg) {
                location.reload();
            });
        })
        .catch(e => {});*/

}

_init();

function playAudio(text, volume) {
    let audio = document.createElement("audio");

    //audio.setAttribute("src", "https://api.streamelements.com/kappa/v2/speech?voice=Joey&text="+text);
    audio.setAttribute("src", "https://api.streamelements.com/kappa/v2/speech?voice=de-DE-Wavenet-A&text="+text);
    audio.setAttribute("preload", "auto");
    audio.volume = volume;
    audio.autoplay = true;

    audio.addEventListener('ended', function() {
        audio.pause();
        audio.removeAttribute('src');
        audio.load();
        audio.remove();
    });

    document.getElementById("root").appendChild(audio);
}

let messageQueue = [];
let messageQueueNoText = [];
let isShowing = false;

var socket = io();
socket.on('bot.say', function(msg) {
    messageQueue.push(msg);
});
socket.on('bot.say.notext', function(msg) {
    messageQueueNoText.push(msg);
});

window.setInterval(() => {
    if(!isShowing && messageQueue.length > 0) {
        isShowing = true;
        let $text = $('<p></p>');
        let text = messageQueue.pop();
        $text.text(text);
        $text.hide();
        $('#chat-wrapper').append($text);
        $text.fadeIn(200).delay(Math.max(3000, text.split(' ').length/130*60000)).fadeOut(200, () => {
            $text.remove();
            isShowing = false;
        });
        playAudio(text, 0.5);
    }
}, 500)

window.setInterval(() => {
    if(!isShowing && messageQueueNoText.length > 0) {
        let text = messageQueueNoText.pop();
        playAudio(text, 0.5);
    }
}, 500)

socket.on('reload', function(msg) {
    location.reload();
});