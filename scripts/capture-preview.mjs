import {chromium} from '@playwright/test';
import {mkdir} from 'node:fs/promises';
import {resolve} from 'node:path';
const output=resolve(import.meta.dirname,'../docs/previews');
await mkdir(output,{recursive:true});
const browser=await chromium.launch({channel:'chrome',headless:true});
try{
 const page=await browser.newPage({viewport:{width:1440,height:1000},reducedMotion:'reduce'});
 await page.goto('http://localhost:3000/',{waitUntil:'networkidle'});
 await page.screenshot({path:resolve(output,'storefront-desktop.png'),fullPage:true});
 await page.setViewportSize({width:375,height:812});
 await page.goto('http://localhost:3000/shop',{waitUntil:'networkidle'});
 await page.screenshot({path:resolve(output,'storefront-mobile.png'),fullPage:true});
 await page.setViewportSize({width:1440,height:1000});
 await page.goto('http://localhost:3001/admin',{waitUntil:'networkidle'});
 await page.screenshot({path:resolve(output,'admin-login.png'),fullPage:true});
 console.log('Preview screenshots saved to docs/previews.');
}finally{await browser.close();}
