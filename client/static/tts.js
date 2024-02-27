let audioContext;
let analyser;
let dataArray;
let threshold = 128;
let currentEmotion = 'neutral';
let currentMouthStatus = 'closed';
let currentEyeStatus = 'open';

document.addEventListener('click', function() {
    // Erstellt den AudioContext, wenn der Benutzer auf die Seite klickt
    audioContext = new (window.AudioContext || window.webkitAudioContext)();
    analyser = audioContext.createAnalyser();
    analyser.fftSize = 2048;
    dataArray = new Uint8Array(analyser.frequencyBinCount);

    console.log("AudioContext started");
    startAudioAnalysis();

    // Weitere Audio-Verarbeitung hier
});

function simulateBlink() {
    console.log('blink');
    // Define the probability of double blinking
    const doubleBlinkProbability = 0.2; // 20% chance to double blink

    setCharacterStatus(null, null, 'closed');

    // Open the eye after a short duration
    setTimeout(() => {
        setCharacterStatus(null, null, 'open');

        if (Math.random() < doubleBlinkProbability) {
            setTimeout(() => {
                setCharacterStatus(null, null, 'closed');
                setTimeout(() => {
                    setCharacterStatus(null, null, 'open');
                }, 100);
            }, 300);
        }
    }, 100);

    // Determine the next blink time (randomly between 2 and 10 seconds)
    const nextBlink = Math.random() * 8000 + 2000;

    // Call the function again after a random time
    setTimeout(simulateBlink, nextBlink);
}

function setCharacterStatus(emotion = 'neutral', mouth = 'closed', eye = 'open') {
    currentEmotion = emotion || currentEmotion;
    currentMouthStatus = mouth || currentMouthStatus;
    currentEyeStatus = eye || currentEyeStatus;

    document.getElementById('character').src = '/static/images/pngtuber/'+currentEmotion+'_'+currentMouthStatus+'_'+currentEyeStatus+'.png';
}

function startAnimation() {
    const character = document.getElementById('character');
    switch (currentEmotion) {
        case 'mad':
            character.style.animation = 'wackeln 0.5s infinite';
            break;
        case 'sad':
            character.style.animation = 'traurig 1s infinite';
            break;
        case 'shy':
            character.style.animation = 'schuechtern 1s infinite';
            break;
        case 'happy':
            character.style.animation = 'gluecklich 0.6s infinite';
            break;
        default:
            character.style.animation = 'huepfen 0.5s 1';
    }
}

// Funktion, um das Hüpfen zu stoppen
function stopAnimation() {
    document.getElementById('character').style.animation = '';
}

function startAudioAnalysis() {
    const analyzeAudio = () => {
        requestAnimationFrame(analyzeAudio);
        analyser.getByteFrequencyData(dataArray);
        let sum = dataArray.reduce((a, b) => a + b, 0);
        let average = sum / dataArray.length;

        if(average > 12) {
            setCharacterStatus(null, 'open', null);
            startAnimation();
        } else {
            setCharacterStatus(null, 'closed', null);
            stopAnimation();
        }
    };
    analyzeAudio();
}

function playAudio(url, volume) {
    fetch(url)
        .then(response => response.blob())
        .then(blob => {
            var url = URL.createObjectURL(blob);
            var audio = new Audio(url);
            // Jetzt können Sie das Audio-Element verwenden

            audio.setAttribute("preload", "auto");
            audio.volume = volume;
            audio.autoplay = true;

            const source = audioContext.createMediaElementSource(audio);
            source.connect(analyser);
            analyser.connect(audioContext.destination);

            audio.addEventListener('ended', function() {
                audio.pause();
                audio.removeAttribute('src');
                audio.load();
                audio.remove();
                source.disconnect();
                isPlaying = false;
            });

            document.getElementById("root").appendChild(audio);
        })
        .catch(error => console.error('Error:', error));
}

let messageQueue = [];
let messageQueueNoText = [];
let audioQueue = [];
let isShowing = false;
let isPlaying = false;

var socket = io();
socket.on('bot.say', function(msg) {
    messageQueue.push(msg);
});
socket.on('bot.say.notext', function(msg) {
    messageQueueNoText.push(msg);
});
socket.on('bot.playAudio', function(msg) {
    console.log(msg);
    if (Array.isArray(msg)) {
        audioQueue.push(...msg.reverse());
    } else {
        audioQueue.push(msg);
    }
});

window.setInterval(() => {
    if(!isShowing && !isPlaying && messageQueue.length > 0) {
        isShowing = true;
        isPlaying = true;
        let $text = $('<p></p>');
        let text = messageQueue.pop();
        $text.text(text);
        $text.hide();
        $('#chat-wrapper').append($text);
        $text.fadeIn(200).delay(Math.max(3000, text.split(' ').length/130*60000)).fadeOut(200, () => {
            $text.remove();
            isShowing = false;
        });
        playAudio("https://api.streamelements.com/kappa/v2/speech?voice=de-DE-Wavenet-A&text="+text, 0.5);
    }
}, 500);

window.setInterval(() => {
    if(!isShowing && !isPlaying && messageQueueNoText.length > 0) {
        isPlaying = true;
        let text = messageQueueNoText.pop();
        playAudio("https://api.streamelements.com/kappa/v2/speech?voice=de-DE-Wavenet-A&text="+text, 0.5);
    }
}, 500);

window.setInterval(() => {
    if(!isShowing && !isPlaying && audioQueue.length > 0) {
        isPlaying = true;
        let {path, emotion} = audioQueue.pop();
        setCharacterStatus(emotion, null, null);
        playAudio(path, 0.5);
    }
}, 500);

socket.on('reload', function(msg) {
    location.reload();
});

window.addEventListener('DOMContentLoaded', () => {
    setCharacterStatus();
    document.getElementById('character').click();
    simulateBlink();
});