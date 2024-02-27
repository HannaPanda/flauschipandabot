
class PngTuber {
    constructor() {
        this.audioContext = new (window.AudioContext || window.webkitAudioContext)();
        this.analyser = this.audioContext.createAnalyser();
        this.analyser.fftSize = 2048;
        this.dataArray = new Uint8Array(this.analyser.frequencyBinCount);
        this.threshold = 128;
        this.characterImage = document.getElementById('character');
        this.currentEmotion = 'Neutral';
        this.isMouthOpen = false;
        this.nextBlinkTime = Date.now() + this.getRandomBlinkInterval();
        this.initSocket();
        //this.startAudioAnalysis();
    }

    initSocket() {
        this.socket = io();
        this.socket.on('bot.say', (msg) => {
            const { emotion, text } = msg;
            this.playAudio(text, 0.5, emotion);
        });
    }

    startAudioAnalysis() {
        const analyzeAudio = () => {
            requestAnimationFrame(analyzeAudio);
            this.analyser.getByteFrequencyData(this.dataArray);
            let sum = this.dataArray.reduce((a, b) => a + b, 0);
            let average = sum / this.dataArray.length;
            this.updateCharacter(this.currentEmotion, average > this.threshold);
            this.blink();
        };
        analyzeAudio();
    }

    updateCharacter(emotion, mouthOpen) {
        this.currentEmotion = emotion;
        this.isMouthOpen = mouthOpen;
        const emotionConfig = emotionsConfig[emotion];
        this.characterImage.src = '/static/images/pngtuber/' + emotionConfig[mouthOpen ? 'open' : 'closed'];
    }

    playAudio(text, volume, emotion) {
        const audio = document.createElement('audio');
        audio.src = 'https://api.streamelements.com/kappa/v2/speech?voice=de-DE-Wavenet-A&text=' + text;
        audio.preload = 'auto';
        audio.volume = volume;
        const source = this.audioContext.createMediaElementSource(audio);
        source.connect(this.analyser);
        this.analyser.connect(this.audioContext.destination);
        audio.addEventListener('ended', () => {
            audio.remove();
            source.disconnect();
        });
        document.getElementById('root').appendChild(audio);
        audio.play();
        this.updateCharacter(emotion, false);
    }

    getRandomBlinkInterval() {
        return Math.random() * (blinkIntervalMax - blinkIntervalMin) + blinkIntervalMin;
    }

    blink() {
        if (Date.now() >= this.nextBlinkTime) {
            const emotionConfig = emotionsConfig[this.currentEmotion];
            this.characterImage.src = '/static/images/pngtuber/' + emotionConfig.closed;
            setTimeout(() => {
                this.characterImage.src = '/static/images/pngtuber/' + emotionConfig[this.isMouthOpen ? 'open' : 'closed'];
                this.nextBlinkTime = Date.now() + this.getRandomBlinkInterval();
            }, blinkDuration);
        }
    }
}

// Konfiguration für Emotionen und Bilder
const emotionsConfig = {
    'Happy': { open: 'happy_open.png', closed: 'happy_closed.png' },
    'Neutral': { open: 'neutral_open.png', closed: 'neutral_closed.png' },
    'Mad': { open: 'mad_open.png', closed: 'mad_closed.png' },
    'Sad': { open: 'sad_open.png', closed: 'sad_closed.png' },
    'Shy': { open: 'shy_open.png', closed: 'shy_closed.png' },
};

// Variablen für das Blinzeln
const blinkIntervalMin = 3000; // Minimales Intervall zwischen Blinzeln in ms
const blinkIntervalMax = 10000; // Maximales Intervall zwischen Blinzeln in ms
const blinkDuration = 200; // Dauer des Blinzelns in ms

// Instanz des PngTubers erstellen
const pngTuber = new PngTuber();
