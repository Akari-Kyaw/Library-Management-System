import Echo from 'laravel-echo';
import Pusher from 'pusher-js';

declare global {
    interface Window {
        Pusher: typeof Pusher;
        Echo?: Echo;
    }
}

window.Pusher = Pusher;

const key = import.meta.env.VITE_REVERB_APP_KEY as string | undefined;
const host = (import.meta.env.VITE_REVERB_HOST as string | undefined) ?? window.location.hostname;
const port = Number(import.meta.env.VITE_REVERB_PORT ?? 8080);
const scheme = (import.meta.env.VITE_REVERB_SCHEME as string | undefined) ?? 'http';

if (key) {
    window.Echo = new Echo({
        broadcaster: 'reverb',
        key,
        wsHost: host,
        wsPort: port,
        wssPort: port,
        forceTLS: scheme === 'https',
        enabledTransports: ['ws', 'wss'],
    });
}

export {};
