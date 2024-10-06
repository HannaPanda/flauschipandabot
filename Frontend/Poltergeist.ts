import axios from 'axios';
import { gsap } from 'gsap';
import { Flip } from 'gsap/Flip';
import { PixiPlugin } from 'gsap/PixiPlugin';
import { MotionPathPlugin } from 'gsap/MotionPathPlugin';
import { transitionService } from '../Services/TransitionService';

gsap.registerPlugin(Flip, PixiPlugin, MotionPathPlugin);

/**
 * Class representing the Poltergeist media player.
 * Handles background image slideshow, audio playback, and visual transitions.
 */
class Poltergeist {
    private container: HTMLElement;
    private initialScale: number = 1.3;
    private currentElement: HTMLElement;
    private category: string;
    private slideshowTimeout: NodeJS.Timeout;
    private currentAudioElement: HTMLAudioElement | null = null;

    private config = {
        audio: {
            minBlockInterval: 5 * 60 * 1000,
            maxBlockInterval: 10 * 60 * 1000,
            weightedExponent: 1.5, // Higher weight for shorter times
            betweenFilesInterval: 5000, // 5 seconds between audio files
        },
        gallery: {
            imageEffects: ['zoom', 'pan', 'panzoom'], // Image effects
            effectDuration: 5000, // Effect duration in milliseconds
            minMediaInterval: 5000, // Minimum time between media transitions
            maxMediaInterval: 15000, // Maximum time between media transitions
        },
    };

    public enableAudio: boolean = false;

    /**
     * Initializes the Poltergeist instance, sets up the media container, fetches media files,
     * and starts the slideshow and audio scheduling.
     */
    constructor() {
        this.container = document.getElementById('media-container');

        const queryParams = this.getQueryParams();
        this.category = queryParams['category'] || 'cat';

        transitionService.setContainer(this.container);
        transitionService.setInitialScale(this.initialScale);

        this.init();

        // Listen for visibility change events
        document.addEventListener('visibilitychange', this.handleVisibilityChange.bind(this));
    }

    /**
     * Asynchronously initializes the media player by fetching media files and starting the slideshow.
     * @returns {Promise<void>}
     */
    async init(): Promise<void> {
        this.startSlideshow();
        this.scheduleAudioPlayback();

        const enableAudioPlayback = () => {
            this.enableAudio = true;
            const audioPrompt = document.getElementById('audio-prompt');
            if (audioPrompt) {
                audioPrompt.style.display = 'none';
            }
            document.removeEventListener('click', enableAudioPlayback);
        };

        document.addEventListener('click', enableAudioPlayback);
    }

    /**
     * Fetches a random audio file from the server.
     * @returns {Promise<string>}
     */
    async fetchAudioFile(): Promise<string> {
        const response = await axios.get(`/api/poltergeist/audio`);
        return response.data.url ? response.data.url : '';
    }

    /**
     * Fetches a random background image file from the server.
     * @returns {Promise<void>}
     */
    async fetchBackgroundFile(): Promise<string> {
        const response = await axios.get(`/api/poltergeist/backgrounds?category=${encodeURIComponent(this.category)}`);
        return response.data.url ? response.data.url : '';
    }

    /**
     * Starts the slideshow of media files by showing the next media.
     */
    startSlideshow(): void {
        this.showNextMedia();
    }

    /**
     * Shows the next media file in the slideshow and schedules the next one.
     */
    async showNextMedia(): Promise<void> {
        const mediaFile = await this.fetchBackgroundFile();
        if (!mediaFile) {
            console.error('No background file available');
            return;
        }

        this.loadMedia(mediaFile).then(() => {
            const nextInterval = this.getRandomMediaInterval();
            this.slideshowTimeout = setTimeout(() => this.showNextMedia(), nextInterval);
        });
    }

    /**
     * Loads a media file (image or video) into the container and applies effects.
     * @param {string} file - The media file name.
     * @returns {Promise<void>}
     */
    async loadMedia(file: string): Promise<void> {
        const fileExtension = file.split('.').pop().toLowerCase();
        let mediaElement: HTMLElement;

        if (['mp4', 'webm'].includes(fileExtension)) {
            // Handle video files
            const videoElement = document.createElement('video');
            videoElement.src = file;
            videoElement.autoplay = true;
            videoElement.loop = false;
            videoElement.onended = () => {
                clearTimeout(this.slideshowTimeout);
                this.showNextMedia();
            };
            videoElement.muted = !this.enableAudio; // Video nur muten, wenn Audio deaktiviert ist
            videoElement.style.width = '100%';
            videoElement.style.height = '100%';
            videoElement.style.objectFit = 'cover';

            await new Promise<void>((resolve) => {
                videoElement.onloadeddata = () => resolve();
            });

            mediaElement = document.createElement('div');
            mediaElement.classList.add('media-element');
            mediaElement.appendChild(videoElement);
        } else {
            // Handle image files
            mediaElement = document.createElement('div');
            mediaElement.classList.add('media-element');
            mediaElement.style.backgroundImage = `url('${file}')`;
            mediaElement.style.backgroundSize = 'cover';
            mediaElement.style.backgroundPosition = 'center center';

            await new Promise<void>((resolve) => {
                const img = new Image();
                img.src = file;
                img.onload = () => resolve();
            });
        }

        // Reset GSAP transformations
        gsap.killTweensOf(mediaElement);
        gsap.set(mediaElement, {
            clearProps: 'transform,filter,opacity,x,y,xPercent,yPercent,rotation,rotationY,scale,height,width',
        });
        gsap.set(mediaElement, {
            scale: this.initialScale,
            x: 0,
            y: 0,
            xPercent: 0,
            yPercent: 0,
        });

        this.transitionToNewMedia(mediaElement);
        this.displayExifData(mediaElement, file);
    }

    /**
     * Transitions to the new media element using a random effect.
     * @param {HTMLElement} newElement - The new media element to display.
     */
    transitionToNewMedia(newElement: HTMLElement): void {
        const oldElement = this.currentElement;

        this.container.appendChild(newElement);
        this.currentElement = newElement;

        transitionService.applyRandomTransitionEffect(oldElement, newElement, this.applyRandomImageEffect);
    }

    /**
     * Applies a random image effect (zoom, pan, or panzoom) to the media element.
     * @param {HTMLElement} element - The media element to apply the effect to.
     */
    applyRandomImageEffect = (element: HTMLElement): void => {
        gsap.set(element, { x: 0, y: 0, xPercent: 0, yPercent: 0 });
        const effect = this.getRandomImageEffect();

        const maxPan = (this.initialScale - 1) * 100;

        switch (effect) {
            case 'zoom':
                this.applyZoomEffect(element);
                break;
            case 'pan':
                this.applyPanEffect(element, maxPan);
                break;
            case 'panzoom':
                this.applyPanZoomEffect(element, maxPan);
                break;
            default:
                this.applyZoomEffect(element);
                break;
        }
    };

    /**
     * Returns a random image effect based on the configured effects.
     * @returns {string} The name of the selected image effect.
     */
    getRandomImageEffect(): string {
        const effects = this.config.gallery.imageEffects;
        return effects[Math.floor(Math.random() * effects.length)];
    }

    /**
     * Applies a zoom effect to the media element.
     * @param {HTMLElement} element - The media element to zoom.
     */
    applyZoomEffect(element: HTMLElement): void {
        const zoomIn = Math.random() > 0.5;
        const minScale = this.initialScale;
        const maxScale = this.initialScale * 1.2;
        const startScale = minScale;
        const endScale = zoomIn ? maxScale : minScale;

        gsap.fromTo(
            element,
            { scale: startScale },
            {
                scale: endScale,
                duration: this.config.gallery.effectDuration / 1000,
                ease: 'power1.inOut',
            }
        );
    }

    /**
     * Applies a pan effect to the media element.
     * @param {HTMLElement} element - The media element to pan.
     * @param {number} maxPan - The maximum pan distance in percentage.
     */
    applyPanEffect(element: HTMLElement, maxPan: number): void {
        gsap.set(element, { xPercent: 0, yPercent: 0 });

        const angle = Math.random() * 360;
        const radian = angle * (Math.PI / 180);

        const panDistance = Math.random() * maxPan * 0.5;
        const panX = Math.cos(radian) * panDistance;
        const panY = Math.sin(radian) * panDistance;

        gsap.to(element, {
            xPercent: panX,
            yPercent: panY,
            duration: this.config.gallery.effectDuration / 1000,
            ease: 'power1.inOut',
        });
    }

    /**
     * Applies a combined pan and zoom effect to the media element.
     * @param {HTMLElement} element - The media element to pan and zoom.
     * @param {number} maxPan - The maximum pan distance in percentage.
     */
    applyPanZoomEffect(element: HTMLElement, maxPan: number): void {
        gsap.set(element, { xPercent: 0, yPercent: 0 });

        const angle = Math.random() * 360;
        const radian = angle * (Math.PI / 180);

        const panDistance = Math.random() * maxPan * 0.5;
        const panX = Math.cos(radian) * panDistance;
        const panY = Math.sin(radian) * panDistance;

        const zoomIn = Math.random() > 0.5;
        const minScale = this.initialScale;
        const maxScale = this.initialScale * 1.2;
        const startScale = minScale;
        const endScale = zoomIn ? maxScale : minScale;

        gsap.to(element, {
            xPercent: panX,
            yPercent: panY,
            scale: endScale,
            duration: this.config.gallery.effectDuration / 1000,
            ease: 'power1.inOut',
        });
    }

    /**
     * Displays EXIF data for the media file.
     * @param {HTMLElement} element - The media element to append EXIF data to.
     * @param {string} file - The name of the media file.
     */
    displayExifData(element: HTMLElement, file: string): void {
        const exifInfo = document.createElement('div');
        exifInfo.classList.add('exif-info');
        exifInfo.innerText = `Dateiname: ${file}`;
        this.container.appendChild(exifInfo);

        setTimeout(() => {
            exifInfo.remove();
        }, 5000);
    }

    /**
     * Schedules the next audio playback block.
     */
    scheduleAudioPlayback(): void {
        this.playAudioBlock();
    }

    /**
     * Plays a random block of audio files, then schedules the next block.
     */
    async playAudioBlock(): Promise<void> {
        if (!this.enableAudio) {
            setTimeout(() => this.playAudioBlock(), 10000);
            return;
        }

        const numFiles = Math.floor(Math.random() * 3) + 1;
        let filesToPlayPromises = [];

        for (let i = 0; i < numFiles; i++) {
            // Fetch audio file URLs as promises
            filesToPlayPromises.push(this.fetchAudioFile());
        }

        let filesToPlay = [];
        try {
            // Resolve all promises in parallel
            filesToPlay = await Promise.all(filesToPlayPromises);

            // Filter out any empty strings in case fetchAudioFile returned invalid URLs
            const validFiles = filesToPlay.filter(file => file !== '');

            // Continue with valid files
            if (validFiles.length > 0) {
                // Play or process the valid audio files here
                console.log('Files to play:', validFiles);
            } else {
                console.log('No valid audio files to play');
            }

        } catch (error) {
            console.error('Error fetching audio files:', error);
        }

        for (const file of filesToPlay) {
            await this.playAudioFile(file);
            await this.delay(this.config.audio.betweenFilesInterval);
        }

        const blockInterval = this.getRandomBlockInterval();
        setTimeout(() => this.playAudioBlock(), blockInterval);
    }

    /**
     * Plays a single audio file.
     * @param {string} file - The name of the audio file to play.
     * @returns {Promise<void>}
     */
    playAudioFile(file: string): Promise<void> {
        return new Promise((resolve) => {
            const audio = new Audio(file);
            this.currentAudioElement = audio; // Speichere das aktuelle Audioelement
            audio.play().catch((error) => {
                console.error('Audio could not be played:', error);
                resolve();
            });
            audio.onended = () => {
                this.currentAudioElement = null;
                resolve();
            };
        });
    }

    /**
     * Returns a random interval for the next audio block, weighted towards shorter intervals.
     * @returns {number} The interval in milliseconds.
     */
    getRandomBlockInterval(): number {
        const { minBlockInterval, maxBlockInterval, weightedExponent } = this.config.audio;
        const weightedRandom = Math.pow(Math.random(), weightedExponent);
        return minBlockInterval + weightedRandom * (maxBlockInterval - minBlockInterval);
    }

    /**
     * Returns a random selection of items from an array.
     * @template T
     * @param {T[]} array - The array to select items from.
     * @param {number} numItems - The number of items to select.
     * @returns {T[]} An array of randomly selected items.
     */
    getRandomItems<T>(array: T[], numItems: number): T[] {
        const shuffled = array.slice().sort(() => 0.5 - Math.random());
        return shuffled.slice(0, numItems);
    }

    /**
     * Returns a random interval for the next media transition.
     * @returns {number} The interval in milliseconds.
     */
    getRandomMediaInterval(): number {
        const { minMediaInterval, maxMediaInterval } = this.config.gallery;
        return minMediaInterval + Math.random() * (maxMediaInterval - minMediaInterval);
    }

    /**
     * Delays execution for a specified number of milliseconds.
     * @param {number} ms - The number of milliseconds to delay.
     * @returns {Promise<void>}
     */
    delay(ms: number): Promise<void> {
        return new Promise((resolve) => setTimeout(resolve, ms));
    }

    /**
     * Shuffles an array in place using the Fisher-Yates algorithm.
     * @template T
     * @param {T[]} array - The array to shuffle.
     */
    shuffleArray<T>(array: T[]): void {
        for (let i = array.length - 1; i > 0; i--) {
            const j = Math.floor(Math.random() * (i + 1));
            [array[i], array[j]] = [array[j], array[i]];
        }
    }

    /**
     * Parses query parameters from the URL.
     * @returns {Record<string, string>} An object mapping query parameter names to values.
     */
    getQueryParams(): Record<string, string> {
        const params: Record<string, string> = {};
        window.location.search
            .substring(1)
            .split('&')
            .forEach(function (item) {
                const s = item.split('=');
                params[decodeURIComponent(s[0])] = decodeURIComponent(s[1]);
            });
        return params;
    }

    /**
     * Handles the visibility change event to pause or resume media playback.
     */
    handleVisibilityChange(): void {
        if (document.visibilityState === 'hidden') {
            // Pause the slideshow and audio playback
            this.pauseSlideshow();
            this.pauseAudioPlayback();
        } else if (document.visibilityState === 'visible') {
            // Resume the slideshow and audio playback
            this.resumeSlideshow();
            this.resumeAudioPlayback();
        }
    }

    /**
     * Pauses the slideshow.
     */
    pauseSlideshow(): void {
        // Clear any scheduled media transitions
        if (this.slideshowTimeout) {
            clearTimeout(this.slideshowTimeout);
            this.slideshowTimeout = null;
        }
    }

    /**
     * Resumes the slideshow by scheduling the next media transition.
     */
    resumeSlideshow(): void {
        if (!this.slideshowTimeout) {
            this.showNextMedia(); // Start or continue the slideshow
        }
    }

    /**
     * Pauses audio playback by stopping any current audio files.
     */
    pauseAudioPlayback(): void {
        // If audio is currently playing, pause it
        if (this.currentAudioElement) {
            this.currentAudioElement.pause();
        }
    }

    /**
     * Resumes audio playback.
     */
    resumeAudioPlayback(): void {
        if (this.currentAudioElement && this.enableAudio) {
            this.currentAudioElement.play().catch((error) => {
                console.error('Error resuming audio playback:', error);
            });
        }
    }

}

/**
 * Initializes the Poltergeist instance when the DOM content is fully loaded.
 */
document.addEventListener('DOMContentLoaded', () => {
    new Poltergeist();
});
