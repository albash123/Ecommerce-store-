import test from 'node:test';
import assert from 'node:assert/strict';
import { addLine, setQuantity, selectVariant } from './cart-core.mjs';
const line = {variantId:'v1',quantity:1,stock:3,price:120000};
test('repeated additions cannot exceed available stock',()=>assert.equal(addLine([line],{...line,quantity:5})[0].quantity,3));
test('a sold out variant cannot be added',()=>assert.deepEqual(addLine([],{...line,stock:0}),[]));
test('zero quantity removes the line',()=>assert.deepEqual(setQuantity([line],'v1',0),[]));
test('quantity is capped to available stock',()=>assert.equal(setQuantity([line],'v1',9)[0].quantity,3));
test('variant selection requires exact size and color and active inventory',()=>{
 const variants=[{id:'1',size:'M',color:'Black',active:true,stock:0},{id:'2',size:'L',color:'Black',active:true,stock:4}];
 assert.equal(selectVariant(variants,'Black','L')?.id,'2');
 assert.equal(selectVariant(variants,'Black','S'),undefined);
});
test('the bag respects the API maximum of 50 units per variant',()=>assert.equal(addLine([],{...line,stock:100,quantity:80})[0].quantity,50));
