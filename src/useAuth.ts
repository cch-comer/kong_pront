/* eslint-disable */
import { ref, onMounted, onUnmounted } from "vue";
import api from "@/api";
import axios from "axios";
import VueCookies from "vue-cookies";

const oauthUrl = import.meta.env.VITE_OAUTH_URL

export function useAuth() {

    const checkAccessToken = async () => {
        const access_token = VueCookies.get('access_token');
        if (access_token) { // access_token이 살아있을 경우
            return;
        } else { // access_token이 죽었을 경우
            const response = await axios.post(
                oauthUrl+'oauth/tokenCheck',
                new URLSearchParams({
                    client_id: 'comerstone',
                    client_secret: '1234',
                    grant_type: 'refresh_token',
                }),
                {
                    headers: {'Content-Type': 'application/x-www-form-urlencoded'},
                    withCredentials: true
                }
            )
            console.log(response)
            if(response.ok === 'asd') { // refresh_token을 재발급 해온경우
                return;
            } else { // refresh_token 기간이 만료된 경우
                logout();

            }

        }
    }

    const logout = () => {
        localStorage.removeItem('username');
        VueCookies.remove("access_token");
        alert("로그아웃되었습니다.");
        window.location.href = "/login";
    };

    const startActivityTracking = () => {
        document.addEventListener("click", checkAccessToken);
    };

    const stopActivityTracking = () => {
        document.removeEventListener("click", checkAccessToken);
    };

    onMounted(() => {
        // startActivityTracking();
    });

    onUnmounted(() => {
        // stopActivityTracking();
    });

    return { logout };
}