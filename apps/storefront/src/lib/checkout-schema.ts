import { z } from 'zod';
export const checkoutFormSchema=z.object({email:z.email('Enter a valid email address'),address:z.object({name:z.string().trim().min(2,'Enter your full name'),phone:z.string().trim().min(7,'Enter a valid phone number'),line1:z.string().trim().min(5,'Enter your street address'),line2:z.string().optional(),city:z.string().trim().min(2,'Enter your city'),region:z.string().optional(),postalCode:z.string().trim().min(3,'Enter your postal code'),country:z.string().length(2,'Use a two-letter country code')}),shippingMethodId:z.string().trim().min(1,'Choose a shipping method'),paymentMethod:z.enum(['COD','BANK_TRANSFER','STRIPE']),couponCode:z.string().optional()});


