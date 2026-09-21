import { notFound } from 'next/navigation';
import { api, ApiError } from './api';
export async function resource<T>(path:string):Promise<T>{try{return await api<T>(path);}catch(error){if(error instanceof ApiError&&error.status===404)notFound();throw error;}}
