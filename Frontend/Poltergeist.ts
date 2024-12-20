import axios from 'axios';
import { gsap } from 'gsap';
import { Flip } from 'gsap/Flip';
import { PixiPlugin } from 'gsap/PixiPlugin';
import { MotionPathPlugin } from 'gsap/MotionPathPlugin';
import { transitionService } from '../Services/TransitionService';
import SwipeListener from 'swipe-listener';

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
    private bgFolder?: string;
    private audioFolder?: string;
    private currentAudioElement: HTMLAudioElement | null = null;
    private imageInfo: HTMLDivElement | null = null;
    private imageHistory: any[] = []; // To keep track of loaded images
    private currentIndex: number = -1;
    private mediaTimeout = null;
    private currentTimeline = null;

    private config = {
        audio: {
            minBlockInterval: 5 * 60 * 1000,
            maxBlockInterval: 10 * 60 * 1000,
            weightedExponent: 1.5, // Higher weight for shorter times
            betweenFilesInterval: 500, // .5 seconds between audio files
            allowedStartTime: null, // '0800' for 8 AM
            allowedEndTime: null,   // '2330' for 11:30 PM
        },
        gallery: {
            imageEffects: ['zoom', 'pan', 'panzoom'], // Image effects
            effectDuration: 5000, // Effect duration in milliseconds
            afterEffectDuration: 5000, // Duration to animate to full image
            holdDuration: 2000, // Duration to hold full image
            minEffectChainLength: 2, // Minimum number of effects in the chain
            maxEffectChainLength: 4, // Maximum number of effects in the chain
            minPanDistance: 5, // Minimum pan distance in percentage
            minZoomFactor: 0.05, // Minimum zoom factor (e.g., 5% change)
            maxImageHistory: 20, // Maximum number of images in the history
        },
    };

    public enableAudio: boolean = false;

    /**
     * Initializes the Poltergeist instance, sets up the media container, fetches media files,
     * and starts the slideshow and audio scheduling.
     */
    constructor() {
        const self = this;

        this.container = document.getElementById('media-container');

        // Get query parameters
        const queryParams = this.getQueryParams();

        // Set category, bgFolder, and audioFolder from query params or default to 'cat'
        this.category = queryParams['category'] || 'cat';
        this.bgFolder = queryParams['bgFolder'] || undefined;
        this.audioFolder = queryParams['audioFolder'] || undefined;

        // Update config with query params
        this.updateConfigWithQueryParams(queryParams);

        transitionService.setContainer(this.container);
        transitionService.setInitialScale(this.initialScale);

        // Create image info
        this.imageInfo = document.createElement('div');
        this.imageInfo.classList.add('image-info');
        this.imageInfo.innerText = 'Bild Attribution: ';
        this.container.appendChild(this.imageInfo);

        this.init();

        // Listen for visibility change events
        document.addEventListener('visibilitychange', this.handleVisibilityChange.bind(this));

        // Listen for swipe left event
        document.addEventListener('keydown', (e) => {
            if (e.key === 'ArrowLeft') {
                this.showPreviousMedia();
            }
        });

        const swipeLeftListener = SwipeListener(this.container);
        this.container.addEventListener('swipe', function (e) {
            self.showPreviousMedia();
        });
    }

    /**
     * Updates the configuration object with values from query parameters.
     * @param {Record<string, any>} queryParams - The query parameters from the URL.
     */
    updateConfigWithQueryParams(queryParams: Record<string, any>): void {
        for (const key in queryParams) {
            if (queryParams.hasOwnProperty(key)) {
                this.setConfigValueByPath(this.config, key, queryParams[key]);
            }
        }
    }

    /**
     * Sets a value in the config object based on a dot-notated path.
     * @param {any} obj - The config object to update.
     * @param {string} path - The dot-notated path (e.g., 'gallery.effectDuration').
     * @param {any} value - The value to set.
     */
    setConfigValueByPath(obj: any, path: string, value: any): void {
        const keys = path.split('.');
        let current = obj;

        for (let i = 0; i < keys.length - 1; i++) {
            const key = keys[i];

            // Create the nested object if it doesn't exist
            if (!(key in current)) {
                current[key] = {};
            }

            current = current[key];
        }

        const lastKey = keys[keys.length - 1];

        // Attempt to parse numbers and booleans
        current[lastKey] = this.parseValue(value);
    }

    /**
     * Parses a string value to a number, boolean, or keeps it as a string.
     * @param {string} value - The value to parse.
     * @returns {any} - The parsed value.
     */
    parseValue(value: string): any {
        if (value === 'true') return true;
        if (value === 'false') return false;
        if (/^\d{4}$/.test(value)) return value; // Keep military time strings as is
        if (value.includes(',')) return value.split(',').map(v => v.trim());
        if (!isNaN(Number(value))) return Number(value);
        return value;
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

        // Attempt to enable audio playback programmatically
        this.attemptAutoEnableAudio();
    }

    /**
     * Attempts to enable audio playback without user interaction.
     */
    attemptAutoEnableAudio(): void {
        const testAudio = new Audio();
        const canPlayPromise = testAudio.play();

        if (canPlayPromise !== undefined) {
            canPlayPromise
                .then(() => {
                    // Browser allowed autoplay
                    this.enableAudio = true;
                    const audioPrompt = document.getElementById('audio-prompt');
                    if (audioPrompt) {
                        audioPrompt.style.display = 'none';
                    }
                })
                .catch((error) => {
                    // Autoplay was prevented
                    console.warn('Autoplay prevented by the browser:', error);
                });
        }
    }

    /**
     * Fetches a random audio file from the server.
     * @returns {Promise<string>}
     */
    async fetchAudioFile(): Promise<any> {
        try {
            const folderParam = this.audioFolder ? `?folder=${encodeURIComponent(this.audioFolder)}` : '';
            const response = await axios.get(`/api/poltergeist/audio${folderParam}`);
            return response.data ? response.data : null;
        } catch (error) {
            console.error('Error fetching audio file:', error);
            return null;
        }
    }

    /**
     * Fetches a random background image file from the server.
     * @returns {Promise<any>}
     */
    async fetchBackgroundFile(): Promise<any> {
        try {
            const folderParam = this.bgFolder ? `folder=${encodeURIComponent(this.bgFolder)}&` : '';
            const response = await axios.get(`/api/poltergeist/backgrounds?${folderParam}category=${encodeURIComponent(this.category)}`);
            return response.data;
        } catch (error) {
            console.error('Error fetching background file:', error);
            return null;
        }
    }

    /**
     * Starts the slideshow of media files by showing the next media.
     */
    startSlideshow(): void {
        this.showNextMedia();
    }

    /**
     * Shows the next media file in the slideshow.
     */
    async showNextMedia(): Promise<void> {
        clearTimeout(this.mediaTimeout);
        if(this.currentTimeline) {
            this.currentTimeline.clear();
        }
        if (this.currentIndex < this.imageHistory.length - 1) {
            // Show next image from history
            this.currentIndex++;
            this.loadMedia(this.imageHistory[this.currentIndex].url);
        } else {
            // Fetch a new image and add to history
            const mediaFile = await this.fetchBackgroundFile();
            if (!mediaFile || !mediaFile.url) {
                console.error('No background file available, retrying in 10 seconds');
                clearTimeout(this.mediaTimeout);
                this.mediaTimeout = setTimeout(() => this.showNextMedia(), 10000); // Retry after 10 seconds
                return;
            }

            // Add the new image to history
            if (this.imageHistory.length >= this.config.gallery.maxImageHistory) {
                this.imageHistory.shift(); // Remove the oldest image if at capacity
            }
            this.imageHistory.push(mediaFile);
            this.currentIndex = this.imageHistory.length - 1;

            this.loadMedia(mediaFile.url, mediaFile.attribution);
        }
    }

    /**
     * Shows the previous media file in the history.
     */
    showPreviousMedia(): void {
        if (this.currentIndex > 0) {
            this.currentIndex--;
            this.loadMedia(this.imageHistory[this.currentIndex].url, this.imageHistory[this.currentIndex].attribution);
        } else {
            console.log('No more previous images in history.');
        }
    }

    /**
     * Loads a media file (image or video) into the container and applies effects.
     * @param {string} url - The media file name.
     * @param {string} info - The media file attribution information.
     * @returns {Promise<void>}
     */
    async loadMedia(url: string, info: string = ''): Promise<void> {
        const fileExtension = url.split('.').pop().toLowerCase();
        let mediaElement: HTMLElement;

        try {
            if (['mp4', 'webm'].includes(fileExtension)) {
                // Handle video files
                const videoElement = document.createElement('video');
                videoElement.src = url;
                videoElement.autoplay = true;
                videoElement.loop = false;
                videoElement.onended = () => {
                    this.showNextMedia();
                };
                videoElement.muted = !this.enableAudio; // Mute video if audio is disabled
                videoElement.style.width = '100%';
                videoElement.style.height = '100%';
                videoElement.style.objectFit = 'cover';

                await new Promise<void>((resolve, reject) => {
                    videoElement.onloadeddata = () => resolve();
                    videoElement.onerror = () => {
                        console.error('Error loading video:', url);
                        reject(new Error('Video load error'));
                    };
                });

                mediaElement = document.createElement('div');
                mediaElement.classList.add('media-element');
                mediaElement.appendChild(videoElement);
            } else {
                // Handle image files
                await new Promise<void>((resolve, reject) => {
                    const img = new Image();
                    img.src = url;
                    img.onload = () => resolve();
                    img.onerror = () => {
                        console.error('Error loading image:', url);
                        reject(new Error('Image load error'));
                    };
                });

                mediaElement = document.createElement('div');
                mediaElement.classList.add('media-element');
                mediaElement.style.backgroundImage = `url('${url}')`;
                mediaElement.style.backgroundSize = 'cover';
                mediaElement.style.backgroundPosition = 'center center';
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
            this.displayImageInfo(info);
        } catch (error) {
            console.error('Error loading media:', error);
            // Load the next media after a delay
            clearTimeout(this.mediaTimeout);
            this.mediaTimeout = setTimeout(() => this.showNextMedia(), 5000);
        }
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
     * Applies a chain of random image effects to the media element.
     * @param {HTMLElement} element - The media element to apply the effects to.
     */
    applyRandomImageEffect = (element: HTMLElement): void => {
        // Always start centered
        gsap.set(element, { x: 0, y: 0, xPercent: 0, yPercent: 0, scale: this.initialScale });

        const {
            minEffectChainLength,
            maxEffectChainLength,
            effectDuration,
            afterEffectDuration,
            holdDuration,
            minPanDistance,
            minZoomFactor,
        } = this.config.gallery;

        const chainLength = Math.floor(Math.random() * (maxEffectChainLength - minEffectChainLength + 1)) + minEffectChainLength;

        // Create a GSAP timeline
        this.currentTimeline = gsap.timeline({
            onComplete: () => {
                // After the entire animation sequence is complete, show the next media
                this.showNextMedia();
            },
        });

        // Apply a chain of random effects
        for (let i = 0; i < chainLength; i++) {
            const effect = this.getRandomImageEffect();

            switch (effect) {
                case 'zoom':
                    this.addZoomEffectToTimeline(this.currentTimeline, element, effectDuration / 1000, minZoomFactor);
                    break;
                case 'pan':
                    this.addPanEffectToTimeline(this.currentTimeline, element, effectDuration / 1000, minPanDistance);
                    break;
                case 'panzoom':
                    this.addPanZoomEffectToTimeline(this.currentTimeline, element, effectDuration / 1000, minPanDistance, minZoomFactor);
                    break;
                default:
                    this.addZoomEffectToTimeline(this.currentTimeline, element, effectDuration / 1000, minZoomFactor);
                    break;
            }
        }

        // After the effect chain is over, animate to X/Y=0, Scale=1 over afterEffectDuration
        this.currentTimeline.to(element, {
            xPercent: 0,
            yPercent: 0,
            scale: 1,
            duration: afterEffectDuration / 1000,
            ease: 'power1.inOut',
        });

        // Hold for holdDuration seconds
        this.currentTimeline.to({}, { duration: holdDuration / 1000 });
    };

    /**
     * Adds a zoom effect to the timeline.
     * @param {gsap.core.Timeline} timeline - The GSAP timeline.
     * @param {HTMLElement} element - The media element.
     * @param {number} duration - Duration of the effect in seconds.
     * @param {number} minZoomFactor - Minimum zoom factor change.
     */
    addZoomEffectToTimeline(
        timeline: gsap.core.Timeline,
        element: HTMLElement,
        duration: number,
        minZoomFactor: number
    ): void {
        const currentScale = gsap.getProperty(element, 'scale') as number;
        const zoomDirection = Math.random() > 0.5 ? 1 : -1;

        const maxScale = this.initialScale * 1.2; // Maximum allowed scale
        const minScale = Math.max(this.calculateMinScale(), this.initialScale); // Ensure minScale covers container

        // Calculate end scale with minimum zoom factor
        let endScale = currentScale + zoomDirection * (Math.random() * (maxScale - minScale) * 0.2 + minZoomFactor);

        // Clamp the end scale within minScale and maxScale
        endScale = Math.min(Math.max(endScale, minScale), maxScale);

        // Ensure the scale changes by at least minZoomFactor
        if (Math.abs(endScale - currentScale) < minZoomFactor) {
            endScale = currentScale + zoomDirection * minZoomFactor;
            // Clamp again
            endScale = Math.min(Math.max(endScale, minScale), maxScale);
        }

        timeline.to(element, {
            scale: endScale,
            duration: duration,
            ease: 'power1.inOut',
        });
    }

    /**
     * Adds a pan effect to the timeline.
     * @param {gsap.core.Timeline} timeline - The GSAP timeline.
     * @param {HTMLElement} element - The media element.
     * @param {number} duration - Duration of the effect in seconds.
     * @param {number} minPanDistance - Minimum pan distance in percentage.
     */
    addPanEffectToTimeline(
        timeline: gsap.core.Timeline,
        element: HTMLElement,
        duration: number,
        minPanDistance: number
    ): void {
        const currentXPercent = gsap.getProperty(element, 'xPercent') as number;
        const currentYPercent = gsap.getProperty(element, 'yPercent') as number;
        const currentScale = gsap.getProperty(element, 'scale') as number;

        // Calculate the maximum pan percentages based on the current scale
        const { maxPanXPercent, maxPanYPercent } = this.calculateMaxPanPercents(currentScale);

        // Random pan distance with minimum value
        let panDistanceX = Math.random() * maxPanXPercent * 2 - maxPanXPercent;
        let panDistanceY = Math.random() * maxPanYPercent * 2 - maxPanYPercent;

        // Ensure minimum pan distance
        if (Math.abs(panDistanceX) < minPanDistance) {
            panDistanceX = minPanDistance * Math.sign(panDistanceX || Math.random() - 0.5);
        }
        if (Math.abs(panDistanceY) < minPanDistance) {
            panDistanceY = minPanDistance * Math.sign(panDistanceY || Math.random() - 0.5);
        }

        // Clamp pan distances to maximum allowed values
        const endXPercent = this.clamp(
            currentXPercent + panDistanceX,
            -maxPanXPercent,
            maxPanXPercent
        );
        const endYPercent = this.clamp(
            currentYPercent + panDistanceY,
            -maxPanYPercent,
            maxPanYPercent
        );

        timeline.to(element, {
            xPercent: endXPercent,
            yPercent: endYPercent,
            duration: duration,
            ease: 'power1.inOut',
        });
    }

    /**
     * Adds a pan and zoom effect to the timeline.
     * @param {gsap.core.Timeline} timeline - The GSAP timeline.
     * @param {HTMLElement} element - The media element.
     * @param {number} duration - Duration of the effect in seconds.
     * @param {number} minPanDistance - Minimum pan distance in percentage.
     * @param {number} minZoomFactor - Minimum zoom factor change.
     */
    addPanZoomEffectToTimeline(
        timeline: gsap.core.Timeline,
        element: HTMLElement,
        duration: number,
        minPanDistance: number,
        minZoomFactor: number
    ): void {
        const currentXPercent = gsap.getProperty(element, 'xPercent') as number;
        const currentYPercent = gsap.getProperty(element, 'yPercent') as number;
        const currentScale = gsap.getProperty(element, 'scale') as number;

        // Calculate the maximum pan percentages based on the current scale
        const { maxPanXPercent, maxPanYPercent } = this.calculateMaxPanPercents(currentScale);

        // Random pan distance with minimum value
        let panDistanceX = Math.random() * maxPanXPercent * 2 - maxPanXPercent;
        let panDistanceY = Math.random() * maxPanYPercent * 2 - maxPanYPercent;

        // Ensure minimum pan distance
        if (Math.abs(panDistanceX) < minPanDistance) {
            panDistanceX = minPanDistance * Math.sign(panDistanceX || Math.random() - 0.5);
        }
        if (Math.abs(panDistanceY) < minPanDistance) {
            panDistanceY = minPanDistance * Math.sign(panDistanceY || Math.random() - 0.5);
        }

        // Clamp pan distances to maximum allowed values
        const endXPercent = this.clamp(
            currentXPercent + panDistanceX,
            -maxPanXPercent,
            maxPanXPercent
        );
        const endYPercent = this.clamp(
            currentYPercent + panDistanceY,
            -maxPanYPercent,
            maxPanYPercent
        );

        // Zoom calculations
        const zoomDirection = Math.random() > 0.5 ? 1 : -1;

        const maxScale = this.initialScale * 1.2;
        const minScale = Math.max(this.calculateMinScale(), this.initialScale); // Ensure minScale covers container

        // Calculate end scale with minimum zoom factor
        let endScale = currentScale + zoomDirection * (Math.random() * (maxScale - minScale) * 0.2 + minZoomFactor);

        // Clamp the end scale within minScale and maxScale
        endScale = Math.min(Math.max(endScale, minScale), maxScale);

        // Ensure the scale changes by at least minZoomFactor
        if (Math.abs(endScale - currentScale) < minZoomFactor) {
            endScale = currentScale + zoomDirection * minZoomFactor;
            // Clamp again
            endScale = Math.min(Math.max(endScale, minScale), maxScale);
        }

        timeline.to(element, {
            xPercent: endXPercent,
            yPercent: endYPercent,
            scale: endScale,
            duration: duration,
            ease: 'power1.inOut',
        });
    }

    /**
     * Calculates the maximum allowed pan percentages to ensure the image covers the container.
     * @param {number} scale - The current scale of the image.
     * @returns {{ maxPanXPercent: number, maxPanYPercent: number }} - The maximum pan percentages.
     */
    calculateMaxPanPercents(scale: number): { maxPanXPercent: number; maxPanYPercent: number } {
        const containerWidth = this.container.clientWidth;
        const containerHeight = this.container.clientHeight;

        // Assuming the image covers the container at scale = 1
        const maxPanX = ((scale - 1) * containerWidth) / 2;
        const maxPanY = ((scale - 1) * containerHeight) / 2;

        // Convert to percentage of container size
        const maxPanXPercent = (maxPanX / containerWidth) * 100;
        const maxPanYPercent = (maxPanY / containerHeight) * 100;

        return { maxPanXPercent, maxPanYPercent };
    }

    /**
     * Calculates the minimum scale required to cover the container.
     * @returns {number} - The minimum scale.
     */
    calculateMinScale(): number {
        // Since the image is set to cover the container, minScale is 1
        return 1;
    }

    /**
     * Clamps a value between a minimum and maximum.
     * @param {number} value - The value to clamp.
     * @param {number} min - The minimum value.
     * @param {number} max - The maximum value.
     * @returns {number} - The clamped value.
     */
    clamp(value: number, min: number, max: number): number {
        return Math.max(min, Math.min(max, value));
    }

    /**
     * Displays image info.
     * @param {string} data - The data to display
     */
    displayImageInfo(data: string): void {
        if(data === '') {
            this.imageInfo.style.display = 'none';
            this.imageInfo.innerText = '';
        } else {
            this.imageInfo.style.display = 'block';
            this.imageInfo.innerText = `Image ${data}`;
        }
    }

    /**
     * Displays audio info.
     * @param {string} data - The data to display
     */
    displayAudioInfo(data: string): HTMLDivElement {
        const audioInfo = document.createElement('div');
        audioInfo.classList.add('audio-info');
        audioInfo.innerText = `Audio: ${data}`;
        this.container.appendChild(audioInfo);

        return audioInfo;
    }

    /**
     * Schedules the next audio playback block.
     */
    scheduleAudioPlayback(): void {
        this.playAudioBlock();
    }

    /**
     * Checks if audio playback is allowed at the current time.
     * @returns {boolean} True if audio playback is allowed, false otherwise.
     */
    isAudioAllowedAtCurrentTime(): boolean {
        const { allowedStartTime, allowedEndTime } = this.config.audio;

        if (!allowedStartTime || !allowedEndTime) {
            // No time restriction
            return true;
        }

        const now = new Date();
        const nowMinutes = now.getHours() * 60 + now.getMinutes();

        const startMinutes = this.parseMilitaryTime(allowedStartTime);
        const endMinutes = this.parseMilitaryTime(allowedEndTime);

        if (startMinutes <= endMinutes) {
            // Time range does not cross midnight
            return nowMinutes >= startMinutes && nowMinutes <= endMinutes;
        } else {
            // Time range crosses midnight
            return nowMinutes >= startMinutes || nowMinutes <= endMinutes;
        }
    }

    /**
     * Parses a military time string (e.g., '0800') into minutes since midnight.
     * @param {string} timeStr - The military time string.
     * @returns {number} Minutes since midnight.
     */
    parseMilitaryTime(timeStr: string): number {
        if (!/^\d{4}$/.test(timeStr)) {
            throw new Error(`Invalid military time format: ${timeStr}`);
        }
        const hours = parseInt(timeStr.substring(0, 2), 10);
        const minutes = parseInt(timeStr.substring(2, 4), 10);
        return hours * 60 + minutes;
    }

    /**
     * Plays a random block of audio files, then schedules the next block.
     */
    async playAudioBlock(): Promise<void> {
        if (!this.enableAudio) {
            setTimeout(() => this.playAudioBlock(), 10000);
            return;
        }

        if (!this.isAudioAllowedAtCurrentTime()) {
            // Audiowiedergabe ist derzeit nicht erlaubt
            console.log('Audiowiedergabe ist derzeit eingeschränkt.');
            setTimeout(() => this.playAudioBlock(), 60000);
            return;
        }

        const numFiles = Math.floor(Math.random() * 3) + 1;
        let filesToPlayPromises = [];

        for (let i = 0; i < numFiles; i++) {
            // Audiodatei-URLs als Promises abrufen
            filesToPlayPromises.push(this.fetchAudioFile());
        }

        try {
            // Alle Promises parallel auflösen
            const filesToPlay = await Promise.all(filesToPlayPromises);

            // Ungültige Dateien herausfiltern
            const validFiles = filesToPlay.filter(file => file && file.url);

            if (validFiles.length > 0) {
                // Gültige Audiodateien abspielen
                for (const file of validFiles) {
                    await this.playAudioFile(file);
                    await this.delay(this.config.audio.betweenFilesInterval);
                }
            } else {
                console.log('Keine gültigen Audiodateien zum Abspielen verfügbar, erneuter Versuch in 10 Sekunden');
                setTimeout(() => this.playAudioBlock(), 10000);
                return;
            }
        } catch (error) {
            console.error('Fehler beim Abrufen der Audiodateien:', error);
            setTimeout(() => this.playAudioBlock(), 10000);
            return;
        }

        const blockInterval = this.getRandomBlockInterval();
        setTimeout(() => this.playAudioBlock(), blockInterval);
    }

    /**
     * Plays a single audio file.
     * @param {string} file - The name of the audio file to play.
     * @returns {Promise<void>}
     */
    playAudioFile(file: any): Promise<void> {
        return new Promise((resolve) => {
            const audio = new Audio(file.url);
            const audioInfo = this.displayAudioInfo(file.title);
            audio.volume = 0.5;
            this.currentAudioElement = audio; // Aktuelles Audioelement speichern
            audio.play().catch((error) => {
                console.error('Audio konnte nicht abgespielt werden:', error);
                audioInfo.remove();
                resolve();
            });
            audio.onended = () => {
                this.currentAudioElement = null;
                audioInfo.remove();
                resolve();
            };
            audio.onerror = () => {
                console.error('Fehler während der Audiowiedergabe');
                this.currentAudioElement = null;
                audioInfo.remove();
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
     * Returns a random image effect based on the configured effects.
     * @returns {string} The name of the selected image effect.
     */
    getRandomImageEffect(): string {
        const effects = this.config.gallery.imageEffects;
        return effects[Math.floor(Math.random() * effects.length)];
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
     * Parses query parameters from the URL, supporting nested keys with dot notation.
     * @returns {Record<string, string>} An object mapping query parameter names to values.
     */
    getQueryParams(): Record<string, string> {
        const params: Record<string, string> = {};
        const searchParams = new URLSearchParams(window.location.search);

        for (const [key, value] of searchParams.entries()) {
            params[decodeURIComponent(key)] = decodeURIComponent(value);
        }

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
        // Pausing logic if needed
    }

    /**
     * Resumes the slideshow.
     */
    resumeSlideshow(): void {
        // Resuming logic if needed
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
