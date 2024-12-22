import axios from "axios";

const inTouchIoApi = axios.create({
    /* baseURL: 'http://localhost:3002/api'*/
    baseURL: 'https://in-touch-io.onrender.com/api'
});

inTouchIoApi.interceptors.request.use(config => {
    const token = localStorage.getItem('token');

    if (token) {
        config.headers.Authorization = `Bearer ${token}`;
    } else {
        config.headers.Authorization = '';
    }

    return config;
}, error => {
    return Promise.reject(error);
});

export default inTouchIoApi;