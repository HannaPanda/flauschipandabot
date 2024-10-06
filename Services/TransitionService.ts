import { gsap } from 'gsap';
import { Flip } from 'gsap/Flip';
import { PixiPlugin } from 'gsap/PixiPlugin';
import { MotionPathPlugin } from 'gsap/MotionPathPlugin';

gsap.registerPlugin(Flip, PixiPlugin, MotionPathPlugin);

/**
 * Service class to handle various transition effects between media elements.
 * Provides methods to apply different visual effects (e.g., fade, slide, flip) to HTML elements.
 */
class TransitionService {
    private transitionEffects = [
        'fade',
        'slide',
        'flip',
        'blur',
        'colorfade',
        'glitch',
        'mosaic',
    ]; // List of supported transition effects

    private container: HTMLElement;
    private initialScale: number;

    /**
     * Sets the container element where transitions will take place.
     * @param {HTMLElement} container - The container element for transitions.
     */
    public setContainer(container: HTMLElement): void {
        this.container = container;
    }

    /**
     * Sets the initial scale value for transitions.
     * @param {number} initialScale - The initial scale to be applied to the new element during transitions.
     */
    public setInitialScale(initialScale: number): void {
        this.initialScale = initialScale;
    }

    /**
     * Applies a random transition effect between the old and new media elements.
     * @param {HTMLElement} oldElement - The current media element to be replaced.
     * @param {HTMLElement} newElement - The new media element to be shown.
     * @param {Function} applyRandomImageEffect - A function that applies image effects to the new element.
     */
    applyRandomTransitionEffect(oldElement: HTMLElement, newElement: HTMLElement, applyRandomImageEffect: Function): void {
        const effect = this.getRandomTransitionEffect();

        gsap.set(newElement, {
            opacity: 0,
            scale: this.initialScale,
            x: 0,
            y: 0,
            xPercent: 0,
            yPercent: 0,
        });

        switch (effect) {
            case 'fade':
                this.applyFadeTransition(oldElement, newElement, applyRandomImageEffect);
                break;
            case 'slide':
                this.applySlideTransition(oldElement, newElement, applyRandomImageEffect);
                break;
            case 'flip':
                this.applyFlipTransition(oldElement, newElement, applyRandomImageEffect);
                break;
            case 'blur':
                this.applyBlurTransition(oldElement, newElement, applyRandomImageEffect);
                break;
            case 'colorfade':
                this.applyColorFadeTransition(oldElement, newElement, applyRandomImageEffect);
                break;
            case 'glitch':
                this.applyGlitchTransition(oldElement, newElement, applyRandomImageEffect);
                break;
            case 'mosaic':
                this.applyMosaicTransition(oldElement, newElement, applyRandomImageEffect);
                break;
            default:
                this.applyFadeTransition(oldElement, newElement, applyRandomImageEffect);
                break;
        }
    }

    /**
     * Selects a random transition effect from the available options.
     * @returns {string} The name of the selected transition effect.
     */
    getRandomTransitionEffect(): string {
        const effects = this.transitionEffects;
        return effects[Math.floor(Math.random() * effects.length)];
    }

    /**
     * Applies a fade transition between two elements.
     * @param {HTMLElement} oldElement - The old element to fade out.
     * @param {HTMLElement} newElement - The new element to fade in.
     * @param {Function} applyRandomImageEffect - A function to apply additional effects to the new element.
     */
    applyFadeTransition(oldElement: HTMLElement, newElement: HTMLElement, applyRandomImageEffect: Function): void {
        gsap.set(newElement, { opacity: 0 });

        const tl = gsap.timeline({
            onComplete: () => {
                if (oldElement && oldElement !== newElement) {
                    oldElement.remove();
                }
                applyRandomImageEffect(newElement);
            },
        });

        tl.to(oldElement || {}, {
            opacity: 0,
            duration: 1,
            ease: 'power1.inOut',
        }).to(
            newElement,
            {
                opacity: 1,
                duration: 1,
                ease: 'power1.inOut',
            },
            '-=1'
        );
    }

    /**
     * Applies a sliding transition between two elements.
     * The direction of the slide is chosen randomly.
     * @param {HTMLElement} oldElement - The old element to slide out.
     * @param {HTMLElement} newElement - The new element to slide in.
     * @param {Function} applyRandomImageEffect - A function to apply additional effects to the new element.
     */
    applySlideTransition(oldElement: HTMLElement, newElement: HTMLElement, applyRandomImageEffect: Function): void {
        const directions = ['left', 'right', 'top', 'bottom'];
        const direction = directions[Math.floor(Math.random() * directions.length)];

        let fromVars = {};
        let toVars = {};

        switch (direction) {
            case 'left':
                fromVars = { xPercent: -100 };
                toVars = { xPercent: 0 };
                break;
            case 'right':
                fromVars = { xPercent: 100 };
                toVars = { xPercent: 0 };
                break;
            case 'top':
                fromVars = { yPercent: -100 };
                toVars = { yPercent: 0 };
                break;
            case 'bottom':
                fromVars = { yPercent: 100 };
                toVars = { yPercent: 0 };
                break;
        }

        gsap.set(newElement, { ...fromVars, opacity: 1 });

        const tl = gsap.timeline({
            onComplete: () => {
                if (oldElement && oldElement !== newElement) {
                    oldElement.remove();
                }
                applyRandomImageEffect(newElement);
            },
        });

        tl.to(oldElement || {}, {
            opacity: 0,
            duration: 1,
            ease: 'power1.inOut',
        }).to(
            newElement,
            {
                ...toVars,
                duration: 1,
                ease: 'power1.inOut',
            },
            '-=1'
        );
    }

    /**
     * Applies a flip transition between two elements.
     * The new element flips into place while the old one flips out.
     * @param {HTMLElement} oldElement - The old element to flip out.
     * @param {HTMLElement} newElement - The new element to flip in.
     * @param {Function} applyRandomImageEffect - A function to apply additional effects to the new element.
     */
    applyFlipTransition(oldElement: HTMLElement, newElement: HTMLElement, applyRandomImageEffect: Function): void {
        gsap.set(newElement, { rotationY: -180, transformOrigin: '50% 50%', opacity: 1 });

        const tl = gsap.timeline({
            onComplete: () => {
                if (oldElement && oldElement !== newElement) {
                    oldElement.remove();
                }
                applyRandomImageEffect(newElement);
            },
        });

        tl.to(oldElement || {}, {
            rotationY: 180,
            opacity: 0,
            duration: 1,
            ease: 'power1.inOut',
            transformOrigin: '50% 50%',
        }).to(
            newElement,
            {
                rotationY: 0,
                duration: 1,
                ease: 'power1.inOut',
                transformOrigin: '50% 50%',
            },
            '-=1'
        );
    }

    /**
     * Applies a blur transition between two elements.
     * The old element blurs out while the new one blurs in.
     * @param {HTMLElement} oldElement - The old element to blur out.
     * @param {HTMLElement} newElement - The new element to blur in.
     * @param {Function} applyRandomImageEffect - A function to apply additional effects to the new element.
     */
    applyBlurTransition(oldElement: HTMLElement, newElement: HTMLElement, applyRandomImageEffect: Function): void {
        gsap.set(newElement, { filter: 'blur(20px)', opacity: 0 });

        const tl = gsap.timeline({
            onComplete: () => {
                gsap.set(newElement, { clearProps: 'filter' });
                if (oldElement && oldElement !== newElement) {
                    oldElement.remove();
                }
                applyRandomImageEffect(newElement);
            },
        });

        tl.to(oldElement || {}, {
            opacity: 0,
            filter: 'blur(60px)',
            duration: 1.5,
            ease: 'power1.inOut',
        }).to(
            newElement,
            {
                opacity: 1,
                filter: 'blur(0px)',
                duration: 1.5,
                ease: 'power1.inOut',
            },
            '-=1'
        );
    }

    /**
     * Applies a color fade transition between two elements.
     * The old element fades to grayscale, and the new element fades in from grayscale to full color.
     * @param {HTMLElement} oldElement - The old element to fade out.
     * @param {HTMLElement} newElement - The new element to fade in.
     * @param {Function} applyRandomImageEffect - A function to apply additional effects to the new element.
     */
    applyColorFadeTransition(oldElement: HTMLElement, newElement: HTMLElement, applyRandomImageEffect: Function): void {
        gsap.set(newElement, { filter: 'grayscale(100%)', opacity: 0 });

        const tl = gsap.timeline({
            onComplete: () => {
                gsap.set(newElement, { clearProps: 'filter' });
                if (oldElement && oldElement !== newElement) {
                    oldElement.remove();
                }
                applyRandomImageEffect(newElement);
            },
        });

        tl.to(oldElement || {}, {
            opacity: 1,
            filter: 'grayscale(66%)',
            duration: 1,
            ease: 'power1.in',
        }).to(oldElement || {}, {
            opacity: 0,
            filter: 'grayscale(100%)',
            duration: 0.5,
            ease: 'power1.out',
        }).to(
            newElement,
            {
                opacity: 1,
                filter: 'grayscale(0%)',
                duration: 3,
                ease: 'power1.inOut',
            },
            '-=1'
        );
    }

    /**
     * Applies a glitch transition between two elements.
     * The new element glitches into view while the old one glitches out.
     * @param {HTMLElement} oldElement - The old element to glitch out.
     * @param {HTMLElement} newElement - The new element to glitch in.
     * @param {Function} applyRandomImageEffect - A function to apply additional effects to the new element.
     */
    applyGlitchTransition(oldElement: HTMLElement, newElement: HTMLElement, applyRandomImageEffect: Function): void {
        gsap.set(newElement, { opacity: 0 });

        const tl = gsap.timeline({
            onComplete: () => {
                if (oldElement && oldElement !== newElement) {
                    oldElement.remove();
                }
                gsap.set(newElement, { clearProps: 'filter' });
                applyRandomImageEffect(newElement);
            },
        });

        // Glitch artifacts generation
        const createGlitchArtifact = () => {
            const artifact = document.createElement('div');
            artifact.style.position = 'absolute';
            artifact.style.width = `${Math.random() * 30 + 10 * 1.5}px`;
            artifact.style.height = `${Math.random() * 10 + 5 * 1.5}px`;
            artifact.style.backgroundColor = '#ff00ff';
            artifact.style.opacity = '0.8';
            artifact.style.top = `${Math.random() * 100}%`;
            artifact.style.left = `${Math.random() * 100}%`;
            document.body.appendChild(artifact);

            // Animate and remove the artifact
            gsap.to(artifact, {
                duration: Math.random() * 0.2 + 0.1,
                opacity: 0,
                onComplete: () => artifact.remove(),
            });
        };

        // Add glitch artifacts randomly during the transition
        const addGlitchArtifacts = () => {
            for (let i = 0; i < 20; i++) {
                setTimeout(createGlitchArtifact, Math.random() * 300);
            }
        };

        // Add artifacts at the start
        addGlitchArtifacts();

        tl.to(oldElement || {}, { opacity: 0, duration: 0.1 })
            .to(newElement, { opacity: 1, duration: 0.1 }, '-=0.1')
            .set(newElement, { xPercent: -3, yPercent: -3, filter: 'hue-rotate(45deg)' })
            .to(newElement, { xPercent: 3, yPercent: 3, duration: 0.05 })
            .set(newElement, { xPercent: -5, yPercent: 5, filter: 'hue-rotate(90deg)' })
            .to(newElement, { xPercent: 5, yPercent: -5, duration: 0.05 })
            .set(newElement, { xPercent: -10, yPercent: -10, filter: 'hue-rotate(-90deg)' })
            .to(newElement, { xPercent: 10, yPercent: 10, duration: 0.05 })
            .set(newElement, { xPercent: 0, yPercent: -15, filter: 'hue-rotate(180deg)' })
            .to(newElement, { xPercent: -15, yPercent: 0, duration: 0.05 })
            .set(newElement, { xPercent: 15, yPercent: 15, filter: 'hue-rotate(-180deg)' })
            .to(newElement, { xPercent: 0, yPercent: 0, duration: 0.05 })
            .set(newElement, { clearProps: 'filter' });

        // Add more artifacts in the middle of the transition
        setTimeout(addGlitchArtifacts, 150);
    }

    /**
     * Applies a mosaic transition between two elements.
     * The new element is revealed by animated tiles in a mosaic pattern.
     * @param {HTMLElement} oldElement - The old element to transition out.
     * @param {HTMLElement} newElement - The new element to transition in.
     * @param {Function} applyRandomImageEffect - A function to apply additional effects to the new element.
     */
    applyMosaicTransition(oldElement: HTMLElement | null, newElement: HTMLElement, applyRandomImageEffect: Function): void {
        const rows = 25; // Number of rows in the mosaic
        const cols = 25; // Number of columns in the mosaic
        const duration = 0.5; // Duration of each tile's animation
        const staggerTime = 0.02; // Time offset between tile animations
        const tileWidth = 100 / cols;
        const tileHeight = 100 / rows;

        gsap.set(newElement, {
            opacity: 0,
            position: 'absolute',
            top: 0,
            left: 0,
            width: '100%',
            height: '100%'
        });

        const mosaicContainer = document.createElement('div');
        mosaicContainer.style.position = 'absolute';
        mosaicContainer.style.top = '0';
        mosaicContainer.style.left = '0';
        mosaicContainer.style.width = '100%';
        mosaicContainer.style.height = '100%';
        mosaicContainer.style.overflow = 'hidden';
        this.container.appendChild(mosaicContainer);

        if (oldElement && oldElement.parentElement !== this.container) {
            this.container.appendChild(oldElement);
        }

        const tiles = [];
        const delays = []; // Store delays for each tile

        for (let row = 0; row < rows; row++) {
            for (let col = 0; col < cols; col++) {
                const tile = document.createElement('div');
                tile.style.position = 'absolute';
                tile.style.width = `${tileWidth}%`;
                tile.style.height = `${tileHeight}%`;
                tile.style.left = `${col * tileWidth}%`;
                tile.style.top = `${row * tileHeight}%`;
                tile.style.opacity = '0'; // Start hidden

                mosaicContainer.appendChild(tile);
                tiles.push(tile);

                const delay = (row + col) * staggerTime;
                delays.push(delay);

                gsap.to(tile, {
                    opacity: 1,
                    duration: duration,
                    ease: 'power2.inOut',
                    delay: delay,
                });
            }
        }

        const maxDelay = Math.max(...delays);
        const totalCoverDuration = maxDelay + duration;

        gsap.delayedCall(totalCoverDuration, () => {
            if (oldElement && oldElement !== newElement) {
                oldElement.remove();
            }

            gsap.set(newElement, { opacity: 1 });
            this.container.insertBefore(newElement, mosaicContainer);

            tiles.forEach((tile, index) => {
                const originalDelay = delays[index];
                const reverseDelay = maxDelay - originalDelay;

                gsap.to(tile, {
                    opacity: 0,
                    duration: duration,
                    ease: 'power2.inOut',
                    delay: reverseDelay,
                    onComplete: () => {
                        tile.remove();
                    },
                });
            });

            const totalUncoverDuration = maxDelay + duration;

            gsap.delayedCall(totalUncoverDuration, () => {
                mosaicContainer.remove();
                applyRandomImageEffect(newElement);
            });
        });
    }
}

export const transitionService = new TransitionService();
