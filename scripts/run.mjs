import {spawn} from 'node:child_process';
import {resolve} from 'node:path';
const root=resolve(import.meta.dirname,'..');
const commands={
 'db:generate':['node_modules/prisma/build/index.js','generate'],
 'db:migrate':['node_modules/prisma/build/index.js','migrate','deploy'],
 'db:seed':['--experimental-strip-types','prisma/seed.ts'],
 'test':['node_modules/vitest/vitest.mjs','run','--configLoader','native'],
 'test:e2e':['node_modules/@playwright/test/cli.js','test'],
 'lint':['node_modules/eslint/bin/eslint.js','apps','packages','prisma','tests']
};
export function run(args,cwd=root){return new Promise((resolve,reject)=>{const child=spawn(process.execPath,args,{cwd,stdio:'inherit',env:process.env,windowsHide:true});child.on('error',reject);child.on('exit',code=>code===0?resolve():reject(new Error(`Command failed (${code}): ${args.join(' ')}`)));});}
const action=process.argv[2];
if(commands[action])await run([...commands[action],...process.argv.slice(3)]);
else if(action==='build'||action==='typecheck'){
 await run(['node_modules/typescript/bin/tsc','-p','packages/validation/tsconfig.json']);
 await run(['node_modules/typescript/bin/tsc','-p','apps/api/tsconfig.json',...(action==='typecheck'?['--noEmit']:[])]);
 for(const app of ['storefront','admin'])await run(action==='typecheck'?[resolve(root,'node_modules/typescript/bin/tsc'),'--noEmit']:[resolve(root,`apps/${app}/node_modules/next/dist/bin/next`),'build'],resolve(root,`apps/${app}`));
}else if(action)throw new Error(`Unknown action: ${action}`);
