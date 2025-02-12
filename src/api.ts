/* eslint-disable */
import axios from "axios";
const baseurl = import.meta.env.VITE_OAUTH_URL;

const api = axios.create({
    /*baseURL: baseurl,
    withCredentials: true, // Refresh Token을 서버로 보낼 때 필요*/
});

/*// 요청 인터셉터: 모든 요청 전에 Access Token 체크
api.interceptors.request.use(
    async (config) => {
        let token = sessionStorage.getItem("access_token");

        if (token) {
            config.headers.Authorization = `Bearer ${token}`;
        }

        return config;
    },
    (error) => {
        return Promise.reject(error);
    }
);

// 응답 인터셉터: Access Token 만료되면 자동 갱신
api.interceptors.response.use(
    (response) => response,
    async (error) => {
        if (error.response && error.response.status === 401) {
            console.log("Access Token 만료됨. Refresh Token으로 재발급 시도...");

            try {
                const refreshResponse = await axios.post(
                    baseurl+"oauth/token",
                    new URLSearchParams({
                        client_id: "comerstone",
                        client_secret: "1234",
                        grant_type: "refresh_token",
                    }),
                    { withCredentials: true }
                );

                const newAccessToken = refreshResponse.data.access_token;
                sessionStorage.setItem("access_token", newAccessToken);

                console.log("새로운 Access Token 발급 완료:", newAccessToken);

                // 실패했던 요청을 다시 시도
                error.config.headers.Authorization = `Bearer ${newAccessToken}`;
                return axios(error.config);
            } catch (refreshError) {
                console.error("Refresh Token도 만료됨. 로그아웃 처리...");
                sessionStorage.removeItem("access_token");
                localStorage.removeItem('username');
                alert("세션이 만료되었습니다. 다시 로그인해주세요.");
                window.location.href = "/login"; // 로그인 페이지로 이동
            }
        }

        return Promise.reject(error);
    }
);*/

export default api;