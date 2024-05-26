import axios from 'axios';

export const apiCall = axios.create({
    baseURL: `https://vmat-api.vercel.app/api`,
})