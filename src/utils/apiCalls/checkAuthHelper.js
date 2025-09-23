
import {
    getCookie as nGetCookie,
    setCookie as nSetCookie,
    deleteCookie as nDeleteCookie
} from '@/utils/cookies/cookies';
import { adminRefreshTokern } from './auth';

// Aliases for cleaner use
const getCookie = nGetCookie;
const setCookie = nSetCookie;
const deleteCookie = nDeleteCookie;

export async function checkAuth(userType, router, toast) {
    // console.log("🔍 Checking authentication...");

    const accessToken = getCookie('accessToken');
    const refreshToken = getCookie('refreshToken');

    if (!accessToken) {
        toast({
            title: "You are not logged in!",
            variant: "destructive"
        });
        router.push('/vendor');
        return;
    }

    try {
        let isValid = false;

        if (accessToken) {
            isValid = true;
        } else {
            const payload = { accessToken: accessToken, refreshToken: refreshToken };
            await adminRefreshTokern(payload)
        }


        if (isValid) {
            // console.log("✅ Token is valid");
            return;
        }

        // ⏳ Try to refresh if invalid
        // console.log("⚠️ Token invalid, attempting refresh...");

        if (!refreshToken) {
            toast({
                title: "Session expired. Please log in again.",
                variant: "destructive"
            });
            router.push('/auth/sign-in');
            return;
        }



    } catch (error) {
        // console.error("❌ Auth check error:", error);
        toast({
            title: "Authentication failed. Please log in again.",
            variant: "destructive"
        });
        router.push('/vendor');
    }
}

/**
 * 🚪 Clears tokens & redirects to login
 */
export function redirectToLogin(userType, router, toast) {
    deleteCookie('accessToken');
    deleteCookie('refreshToken');

    toast({
        title: "Session expired. Please login again.",
        variant: "destructive",
    });

    router.push(userType === 'vendor' ? '/vendor' : '/signin');
}
