import {existsSync,mkdirSync,writeFileSync,unlinkSync} from 'node:fs';
import {resolve,dirname} from 'node:path';
import {createRequire} from 'node:module';
import {pathToFileURL} from 'node:url';
import {spawn} from 'node:child_process';
import postgres from 'pg';
const databaseDir=resolve('.local/postgres');
mkdirSync(resolve('.local'),{recursive:true});
mkdirSync(databaseDir,{recursive:true});
const require=createRequire(import.meta.url);
const binaryModule=require.resolve('embedded-postgres').replace(/index\.js$/,'binary.js');
const {default:getBinaries}=await import(pathToFileURL(binaryModule).href);
const binaries=await getBinaries();
function run(file,args){return new Promise((resolve,reject)=>{const child=spawn(file,args,{stdio:'inherit',windowsHide:true});child.once('error',reject);child.once('exit',code=>code===0?resolve():reject(new Error(`PostgreSQL command failed: ${code}`)));});}
if(!existsSync(resolve(databaseDir,'PG_VERSION'))){const pass=resolve('.local/pg-init-password');writeFileSync(pass,'vanta_local_only\n');try{await run(binaries.initdb,['-D',databaseDir,'-U','vanta','--pwfile='+pass,'--auth=scram-sha-256','--encoding=UTF8','--no-locale']);}finally{unlinkSync(pass);}}
const server=spawn(binaries.postgres,['-D',databaseDir,'-p','54329','-h','127.0.0.1'],{stdio:['ignore','inherit','inherit'],windowsHide:true});
server.on('error',error=>{console.error(error);process.exitCode=1;});
let client;
for(let attempt=0;attempt<60;attempt++){const candidate=new postgres.Client({host:'127.0.0.1',port:54329,user:'vanta',password:'vanta_local_only',database:'postgres'});try{await candidate.connect();client=candidate;break;}catch{await candidate.end().catch(()=>{});await new Promise(r=>setTimeout(r,500));}}
if(!client)throw new Error('PostgreSQL did not become ready');
if(!(await client.query("SELECT 1 FROM pg_database WHERE datname = 'vanta'")).rowCount)await client.query('CREATE DATABASE vanta');
await client.end();
console.log('PostgreSQL ready on 127.0.0.1:54329; database vanta. Ctrl+C to stop.');
for(const signal of ['SIGINT','SIGTERM'])process.on(signal,()=>{server.kill('SIGINT');process.exit(0);});
setInterval(()=>{},60000);
