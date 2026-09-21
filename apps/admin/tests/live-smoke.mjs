import 'dotenv/config';
import {chromium} from '@playwright/test';
import assert from 'node:assert/strict';

if(!process.env.SEED_ADMIN_PASSWORD)throw new Error('Set SEED_ADMIN_PASSWORD for live smoke testing.');
const browser=await chromium.launch({channel:'chrome',headless:true});
const page=await browser.newPage({viewport:{width:1440,height:1000}});
const failures=[];
page.on('pageerror',e=>failures.push(e.message));
try{
  await page.goto('http://localhost:3001/admin',{waitUntil:'domcontentloaded'});
  await page.getByLabel('Email address').fill(process.env.SEED_ADMIN_EMAIL||'admin@example.com');
  await page.getByLabel('Password',{exact:true}).fill(process.env.SEED_ADMIN_PASSWORD);
  await page.getByRole('button',{name:'Sign in to workspace'}).click();
  await page.getByRole('heading',{name:'Your store, at a glance.'}).waitFor();
  await page.getByRole('link',{name:'Products',exact:true}).click();
  await page.getByRole('button',{name:'Edit',exact:true}).first().click();
  await page.getByRole('dialog').waitFor();
  const image=page.getByLabel('Image URL',{exact:true}).first();
  await image.waitFor();
  assert.equal(await image.evaluate(el=>el.checkValidity()),true,'Seeded relative images satisfy editor URL validation');
  await page.getByRole('button',{name:'Cancel',exact:true}).click();
  await page.getByRole('link',{name:'Categories',exact:true}).click();
  await page.getByRole('button',{name:/Add categor/}).click();
  const suffix=Date.now();
  await page.getByLabel('Name',{exact:false}).first().fill('UI smoke '+suffix);
  await page.getByLabel('Slug',{exact:false}).fill('ui-smoke-'+suffix);
  await page.getByRole('button',{name:'Save changes',exact:true}).click();
  await page.getByRole('status').waitFor();
  await page.getByRole('textbox',{name:'Search Categories'}).fill('UI smoke '+suffix);
  await page.getByRole('cell',{name:'UI smoke '+suffix,exact:true}).waitFor();
  page.once('dialog',dialog=>dialog.accept());
  await page.getByRole('button',{name:'Delete',exact:true}).click();
  await page.getByRole('heading',{name:'No matching records'}).waitFor();
  for(const resource of ['Homepage sections','Menus','Pages','Site settings']){
    await page.getByRole('link',{name:resource,exact:true}).click();
    await page.getByRole('button',{name:'Edit',exact:true}).first().click();
    await page.getByRole('dialog').waitFor();
    await page.getByRole('button',{name:'Save changes',exact:true}).click();
    await page.getByRole('dialog').waitFor({state:'hidden'});
    await page.getByRole('status').waitFor();
  }
  await page.getByRole('link',{name:'Reports',exact:true}).click();
  await page.getByRole('heading',{name:'Reports & analytics'}).waitFor();
  assert.deepEqual(failures,[]);
  console.log('PASS: live login, dashboard, seeded product editor, relative image validation, category create/delete, homepage/menu/page/settings saves, reports, no browser exceptions');
}finally{await browser.close()}
