import {spawn} from 'node:child_process';
import {resolve} from 'node:path';
import {run} from './run.mjs';
const root=resolve(import.meta.dirname,'..');
await run(['node_modules/typescript/bin/tsc','-p','packages/validation/tsconfig.json']);
await run(['node_modules/typescript/bin/tsc','-p','apps/api/tsconfig.json']);
const tasks=[['node_modules/typescript/bin/tsc',['-p','apps/api/tsconfig.json','--watch'],root],['apps/api/dist/main.js',[],root],['apps/storefront/node_modules/next/dist/bin/next',['dev','-p','3000'],resolve(root,'apps/storefront')],['apps/admin/node_modules/next/dist/bin/next',['dev','-p','3001'],resolve(root,'apps/admin')]];
const children=tasks.map(([file,args,cwd])=>spawn(process.execPath,[...(String(file).endsWith('main.js')?['--watch']:[]),resolve(root,file),...args],{cwd,stdio:'inherit',windowsHide:true}));
for(const signal of ['SIGINT','SIGTERM'])process.on(signal,()=>{for(const child of children)child.kill();process.exit(0);});
