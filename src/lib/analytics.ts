declare global {
    interface Window {
        umami: {
            track: (eventName: string, data?: Record<string, any>) => void;
        };
    }
}

export const trackEvent = (eventName: string, data?: Record<string, any>) => {
    if (window.umami) {
        try {
            window.umami.track(eventName, data);
        } catch (e) {
            console.warn('Umami track failed', e);
        }
    } else {
        if (import.meta.env.DEV) {
            console.log('Avg Analytics [DEV] ->', eventName, data);
        }
    }
};
