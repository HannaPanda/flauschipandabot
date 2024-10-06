import 'photoswipe';

declare module 'photoswipe' {
    interface Content {
        element: HTMLImageElement | HTMLDivElement | HTMLVideoElement;
    }
}
