import axios from 'axios';

export const api = axios.create({
  baseURL: 'http://localhost:3000', // O endereço do seu Backend NestJS
});