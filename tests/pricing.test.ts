import {describe,it,expect} from 'vitest';
import {calculateCoupon,calculateTax,canTransition,mergeQuantities} from '../apps/api/src/commerce/rules';
describe('checkout rules',()=>{
  it('caps a percentage coupon and never discounts excluded lines',()=>{
    expect(calculateCoupon({type:'PERCENTAGE',value:20,minOrder:0,maxDiscount:500,productIds:['a'],excludedProductIds:[],categoryIds:[],collectionIds:[],buyQuantity:0,getQuantity:0},[{productId:'a',categoryId:'c',collectionIds:[],price:3000,quantity:2},{productId:'b',categoryId:'c',collectionIds:[],price:9000,quantity:1}])).toEqual({discount:500,freeShipping:false});
  });
  it('rejects a coupon below its minimum',()=>{expect(()=>calculateCoupon({type:'FIXED',value:500,minOrder:5000,maxDiscount:null,productIds:[],excludedProductIds:[],categoryIds:[],collectionIds:[],buyQuantity:0,getQuantity:0},[{productId:'a',categoryId:'c',collectionIds:[],price:4000,quantity:1}])).toThrow('minimum');});
  it('fixed discounts cannot create a negative total',()=>{expect(calculateCoupon({type:'FIXED',value:5000,minOrder:0,maxDiscount:null,productIds:[],excludedProductIds:[],categoryIds:[],collectionIds:[],buyQuantity:0,getQuantity:0},[{productId:'a',categoryId:'c',collectionIds:[],price:1000,quantity:1}]).discount).toBe(1000);});
  it('buy two get one discounts cheapest eligible unit once per complete group',()=>{expect(calculateCoupon({type:'BUY_X_GET_Y',value:0,minOrder:0,maxDiscount:null,productIds:[],excludedProductIds:[],categoryIds:[],collectionIds:[],buyQuantity:2,getQuantity:1},[{productId:'a',categoryId:'c',collectionIds:[],price:1000,quantity:2},{productId:'b',categoryId:'c',collectionIds:[],price:600,quantity:2}]).discount).toBe(600);});
  it('included tax is reported without adding it twice',()=>{expect(calculateTax(11800,1800,true)).toEqual({tax:1800,additional:0});expect(calculateTax(10000,1800,false)).toEqual({tax:1800,additional:1800});});
  it('blocks cancelling delivered orders and reviving cancelled orders',()=>{expect(canTransition('DELIVERED','CANCELLED')).toBe(false);expect(canTransition('CANCELLED','PROCESSING')).toBe(false);expect(canTransition('PENDING','CONFIRMED')).toBe(true);});
  it('combines duplicate variants before checking stock',()=>{expect(mergeQuantities([{variantId:'a',quantity:2},{variantId:'a',quantity:3},{variantId:'b',quantity:1}])).toEqual([{variantId:'a',quantity:5},{variantId:'b',quantity:1}]);});
});
