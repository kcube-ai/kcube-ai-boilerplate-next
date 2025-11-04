import { getToken } from "@/lib/token";

export const isLoggedIn = (): boolean => {
    return !!getToken();
}
