import io from 'socket.io-client';

declare global {
    interface Window {
        webkitAudioContext: typeof AudioContext
    }
}

class CharacterAnimator {
    private audioContext: AudioContext | undefined;
    private analyser: AnalyserNode | undefined;
    private dataArray: Uint8Array | undefined;
    private threshold: number = 12;
    private currentEmotion: string = 'neutral';
    private currentMouthStatus: string = 'closed';
    private currentEyeStatus: string = 'open';
    private isShowing: boolean = false;
    private isPlaying: boolean = false;
    private audioQueue: Array<{path: string, emotion: string}> = [];

    constructor() {
        document.addEventListener('DOMContentLoaded', () => {
            this.setCharacterStatus();
            document.getElementById('character')?.click();
            this.simulateBlink();
        });

        document.addEventListener('click', this.initializeAudioContext.bind(this));
        this.setupSocket();
    }

    private initializeAudioContext(): void {
        this.audioContext = new (window.AudioContext || window.webkitAudioContext)();
        this.analyser = this.audioContext.createAnalyser();
        this.analyser.fftSize = 2048;
        this.dataArray = new Uint8Array(this.analyser.frequencyBinCount);

        console.log("AudioContext started");
        this.startAudioAnalysis();
    }

    private simulateBlink(): void {
        const doubleBlinkProbability = 0.2;
        this.setCharacterStatus(undefined, undefined, 'closed');

        setTimeout(() => {
            this.setCharacterStatus(undefined, undefined, 'open');
            if (Math.random() < doubleBlinkProbability) {
                setTimeout(() => {
                    this.setCharacterStatus(undefined, undefined, 'closed');
                    setTimeout(() => {
                        this.setCharacterStatus(undefined, undefined, 'open');
                    }, 100);
                }, 300);
            }
        }, 100);

        const nextBlink = Math.random() * 8000 + 2000;
        setTimeout(() => this.simulateBlink(), nextBlink);
    }

    private setCharacterStatus(emotion: string = 'neutral', mouth: string = 'closed', eye: string = 'open'): void {
        this.currentEmotion = emotion ?? this.currentEmotion;
        this.currentMouthStatus = mouth ?? this.currentMouthStatus;
        this.currentEyeStatus = eye ?? this.currentEyeStatus;

        const targetImage = `/static/images/pngtuber/${this.currentEmotion}_${this.currentMouthStatus}_${this.currentEyeStatus}.png`;
        const characterImg = document.getElementById('character') as HTMLImageElement;
        if(characterImg.src != targetImage) {
            characterImg.src = targetImage;
        }
    }

    private startAnimation(): void {
        const character = document.getElementById('character') as HTMLElement;
        switch (this.currentEmotion) {
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

    private stopAnimation(): void {
        const character = document.getElementById('character') as HTMLElement;
        character.style.animation = '';
    }

    private startAudioAnalysis(): void {
        const analyzeAudio = () => {
            requestAnimationFrame(analyzeAudio);
            if (!this.analyser || !this.dataArray) return;

            this.analyser.getByteFrequencyData(this.dataArray);
            let sum = this.dataArray.reduce((a, b) => a + b, 0);
            let average = sum / this.dataArray.length;

            if (average > this.threshold) {
                this.setCharacterStatus(undefined, 'open', undefined);
                this.startAnimation();
            } else {
                this.setCharacterStatus(undefined, 'closed', undefined);
                this.stopAnimation();
            }
        };
        analyzeAudio();
    }

    private playAudio(url: string, volume: number): void {
        fetch(url)
            .then(response => response.blob())
            .then(blob => {
                const audioUrl = URL.createObjectURL(blob);
                const audio = new Audio(audioUrl);
                audio.setAttribute("preload", "auto");
                audio.volume = volume;
                audio.autoplay = true;

                if (!this.audioContext) return;

                const source = this.audioContext.createMediaElementSource(audio);
                source.connect(this.analyser);
                this.analyser.connect(this.audioContext.destination);

                audio.addEventListener('ended', () => {
                    audio.pause();
                    URL.revokeObjectURL(audioUrl);
                    audio.remove();
                    source.disconnect();
                    this.isPlaying = false;
                });

                document.getElementById("root")?.appendChild(audio);
            })
            .catch(error => console.error('Error:', error));
    }

    private setupSocket(): void {
        const socket = io();
        socket.on('bot.playAudio', (msg: any) => {
            if (Array.isArray(msg)) {
                this.audioQueue.push(...msg.reverse());
            } else {
                this.audioQueue.push(msg);
            }
        });

        socket.on('reload', () => {
            location.reload();
        });

        this.setupIntervals();
    }

    private setupIntervals(): void {
        setInterval(() => {
            if (!this.isShowing && !this.isPlaying && this.audioQueue.length > 0) {
                this.isPlaying = true;
                const { path, emotion } = this.audioQueue.pop()!;
                this.setCharacterStatus(emotion, undefined, undefined);
                this.playAudio(path, 0.5);
            }
        }, 500);
    }
}

const animator = new CharacterAnimator();
