import { z } from 'zod';
export const addressSchema = z.object({name:z.string().trim().min(2).max(100),phone:z.string().trim().min(7).max(30),line1:z.string().trim().min(5).max(200),line2:z.string().max(200).optional(),city:z.string().trim().min(2).max(100),region:z.string().max(100).optional(),postalCode:z.string().trim().min(3).max(20),country:z.string().length(2).transform(v=>v.toUpperCase())});
export const cartItemsSchema = z.array(z.object({variantId:z.string().min(1),quantity:z.number().int().min(1).max(50)})).min(1).max(100);
export const checkoutSchema = z.object({email:z.email().max(254).transform(v=>v.toLowerCase()),address:addressSchema,shippingMethodId:z.string().min(1),paymentMethod:z.enum(['COD','BANK_TRANSFER','STRIPE']),couponCode:z.string().trim().max(60).optional(),items:cartItemsSchema,idempotencyKey:z.uuid().optional()}).strict();
export const loginSchema=z.object({email:z.email().transform(v=>v.toLowerCase()),password:z.string().min(1).max(128)}).strict();
export const passwordSchema=z.string().min(12,'Use at least 12 characters').max(128).regex(/[A-Z]/,'Include an uppercase letter').regex(/[a-z]/,'Include a lowercase letter').regex(/[0-9]/,'Include a number');
export const registerSchema=loginSchema.extend({name:z.string().trim().min(2).max(100),password:passwordSchema});
