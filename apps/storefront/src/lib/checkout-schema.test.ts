import { describe, expect, it } from 'vitest';
import { checkoutFormSchema } from './checkout-schema';
const valid = {email:'buyer@example.com',address:{name:'Test Buyer',phone:'03001234567',line1:'12 Studio Road',city:'Lahore',postalCode:'54000',country:'PK'},shippingMethodId:'standard',paymentMethod:'COD'};
describe('customer checkout validation',()=>{
  it('accepts complete guest COD details',()=>expect(checkoutFormSchema.safeParse(valid).success).toBe(true));
  it('rejects missing shipping selection before quote',()=>expect(checkoutFormSchema.safeParse({...valid,shippingMethodId:''}).success).toBe(false));
  it('rejects invalid contact information',()=>expect(checkoutFormSchema.safeParse({...valid,email:'not-an-email'}).success).toBe(false));
  it('rejects unsupported payment values',()=>expect(checkoutFormSchema.safeParse({...valid,paymentMethod:'FAKE'}).success).toBe(false));
  it('rejects whitespace-only required address fields',()=>expect(checkoutFormSchema.safeParse({...valid,address:{...valid.address,name:'  ',line1:'     ',city:'  '}}).success).toBe(false));
});
