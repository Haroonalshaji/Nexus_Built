import { setCookie as nSetCookie, parseCookies, destroyCookie } from 'nookies'

export function setCookie(name, value, days) {
    try {
        nSetCookie(null, name, String(value ?? ''), {
            maxAge: days * 24 * 60 * 60,
            path: '/',
            sameSite: 'strict',
            secure: typeof window !== 'undefined' ? window.location.protocol === 'https:' : false,
        });
        return true;
    } catch (error) {
        return false;
    }
};

export function getCookie(name) {
    try {
        const cookies = parseCookies();
        return cookies[name] ?? null;
    } catch (error) {
        return null;
    }
};

export function deleteCookie(name) {
    try {
        destroyCookie(null, name, { path: '/' });
        return true;
    } catch (error) {
        return false;
    }
};

export function listAllCookies() {
    try {
        const cookies = parseCookies();
        return Object.entries(cookies).map(([name, value]) => ({ name, value }));
    } catch (error) {
        return [];
    }
};