import io from 'socket.io-client';

declare global {
    interface Window {
        webkitAudioContext: typeof AudioContext;
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
    private audioQueue: Array<{ path: string; emotion: string }> = [];

    private audioEl: HTMLAudioElement | undefined;
    private mediaSourceNode: MediaElementAudioSourceNode | undefined;

    // cache for image swap
    private lastSpritePath: string | undefined;

    constructor() {
        document.addEventListener('DOMContentLoaded', () => {
            this.setCharacterStatus(); // initial
            this.simulateBlink();
        });

        document.addEventListener('click', this.initializeAudioContext.bind(this));
        this.initializeAudioContext(); // eager for OBS

        this.setupSocket();
    }

    private initializeAudioContext(): void {
        if (!this.audioContext) {
            this.audioContext = new (window.AudioContext || window.webkitAudioContext)();
        }
        if (!this.analyser) {
            this.analyser = this.audioContext.createAnalyser();
            this.analyser.fftSize = 2048;
            this.dataArray = new Uint8Array(this.analyser.frequencyBinCount);
            try { this.analyser.disconnect(); } catch {}
            this.analyser.connect(this.audioContext.destination);
        }
        console.log('AudioContext initialized:', this.audioContext?.state);
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

    // CHANGED: remove default params; only merge inside
    private setCharacterStatus(emotion?: string, mouth?: string, eye?: string): void {
        this.currentEmotion = (emotion ?? this.currentEmotion);
        this.currentMouthStatus = (mouth ?? this.currentMouthStatus);
        this.currentEyeStatus = (eye ?? this.currentEyeStatus);

        const targetImage = `/static/images/pngtuber/${this.currentEmotion}_${this.currentMouthStatus}_${this.currentEyeStatus}.png`;

        // robust compare to avoid needless reloads
        if (this.lastSpritePath !== targetImage) {
            const characterImg = document.getElementById('character') as HTMLImageElement | null;
            if (characterImg) characterImg.src = targetImage;
            this.lastSpritePath = targetImage;
        }
    }

    private startAnimation(): void {
        const character = document.getElementById('character') as HTMLElement | null;
        if (!character) return;
        switch (this.currentEmotion) {
            case 'mad':   character.style.animation = 'wackeln 0.5s infinite'; break;
            case 'sad':   character.style.animation = 'traurig 1s infinite'; break;
            case 'shy':   character.style.animation = 'schuechtern 1s infinite'; break;
            case 'happy': character.style.animation = 'gluecklich 0.6s infinite'; break;
            default:      character.style.animation = 'huepfen 0.5s 1';
        }
    }

    private stopAnimation(): void {
        const character = document.getElementById('character') as HTMLElement | null;
        if (character) character.style.animation = '';
    }

    private startAudioAnalysis(): void {
        const analyzeAudio = () => {
            requestAnimationFrame(analyzeAudio);
            if (!this.analyser || !this.dataArray) return;

            this.analyser.getByteFrequencyData(this.dataArray);
            const sum = this.dataArray.reduce((a, b) => a + b, 0);
            const average = sum / this.dataArray.length;

            const newMouthStatus = average > this.threshold ? 'open' : 'closed';
            if (this.currentMouthStatus !== newMouthStatus) {
                this.setCharacterStatus(undefined, newMouthStatus, undefined);
                if (newMouthStatus === 'open') this.startAnimation(); else this.stopAnimation();
            }
        };
        analyzeAudio();
    }

    private async ensureAudioEl(): Promise<void> {
        if (this.audioEl) return;

        this.audioEl = document.createElement('audio');
        this.audioEl.preload = 'auto';
        this.audioEl.crossOrigin = 'anonymous';

        if (this.audioContext) {
            this.mediaSourceNode = this.audioContext.createMediaElementSource(this.audioEl);
            if (this.analyser) this.mediaSourceNode.connect(this.analyser);
        }

        // CHANGED: chain next track instantly on 'ended' (no polling delay)
        this.audioEl.addEventListener('ended', () => {
            this.isPlaying = false;
            this.audioEl!.src = '';
            this.startNextFromQueue(); // immediate chain
        });

        // Optional: verbose timing hooks (comment out when done)
        const t0 = () => performance.now().toFixed(1);
        const p = (ev: string) => console.log('[TTS]', ev, t0(), {rs: this.audioEl!.readyState, ns: this.audioEl!.networkState});
        ['loadstart','loadedmetadata','canplay','playing','stalled','waiting','ended','error'].forEach(ev => this.audioEl!.addEventListener(ev, () => p(ev)));

        document.getElementById('root')?.appendChild(this.audioEl);
    }

    private async playAudio(url: string, volume: number): Promise<void> {
        await this.ensureAudioEl();

        try {
            if (this.audioContext?.state !== 'running') {
                await this.audioContext?.resume();
            }

            this.audioEl!.volume = volume;
            this.audioEl!.src = url;

            const playPromise = this.audioEl!.play();
            if (playPromise) {
                await playPromise.catch(async (err) => {
                    console.warn('audio.play() rejected, retry resume → play', err);
                    await this.audioContext?.resume();
                    await this.audioEl!.play();
                });
            }
        } catch (e) {
            console.error('Error in playAudio:', e);
            this.isPlaying = false;
        }
    }

    private setupSocket(): void {
        const socket = io();

        socket.on('bot.playAudio', (msg: any) => {
            if (Array.isArray(msg)) this.audioQueue.push(...msg.reverse());
            else this.audioQueue.push(msg);
            // kick off immediately if idle
            this.startNextFromQueue();
        });

        socket.on('reload', () => location.reload());
    }

    // NEW: no 500ms polling; immediate drain
    private startNextFromQueue(): void {
        if (this.isShowing || this.isPlaying) return;
        const next = this.audioQueue.pop();
        if (!next) return;

        this.isPlaying = true;
        const { emotion, path } = next;
        this.setCharacterStatus(emotion, undefined, undefined);
        void this.playAudio(path, 0.5);
    }
}

const animator = new CharacterAnimator();
