// If is prod use https://api.appsyncroniza.cl/ else use http://localhost:8000
export const BASE_URL = import.meta.env.MODE === 'production' ? 'https://api.appsyncroniza.cl' : 'http://localhost:8000';