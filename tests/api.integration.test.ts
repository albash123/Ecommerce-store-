import {describe,it,expect} from 'vitest';
const base=process.env.TEST_API_URL||'http://localhost:4000/api';
const run=process.env.RUN_INTEGRATION==='1'?describe:describe.skip;
run('database-backed API',()=>{
 it('does not expose admin data to unauthenticated requests',async()=>{const r=await fetch(base+'/admin/orders');expect(r.status).toBe(401);});
 it('serves a persisted catalog with variants and stock',async()=>{const r=await fetch(base+'/products');const j=await r.json();expect(r.status).toBe(200);expect(j.data.total).toBeGreaterThanOrEqual(24);expect(j.data.items[0].variants[0].stock).toBeGreaterThanOrEqual(0);});
 it('rejects client-supplied checkout prices',async()=>{const r=await fetch(base+'/checkout/quote',{method:'POST',headers:{'Content-Type':'application/json'},body:JSON.stringify({email:'test@example.com',price:1})});expect(r.status).toBe(400);});
 it('normalizes invalid authentication without leaking internal details',async()=>{const r=await fetch(base+'/auth/login',{method:'POST',headers:{'Content-Type':'application/json'},body:JSON.stringify({email:'not-existing@example.com',password:'WrongPassword123!'})});expect(r.status).toBe(401);const j=await r.json();expect(j.success).toBe(false);expect(j.stack).toBeUndefined();});
});
