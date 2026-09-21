import {defineConfig} from '@playwright/test';
export default defineConfig({testDir:'tests/e2e',timeout:90000,workers:1,use:{baseURL:'http://localhost:3000',channel:'chrome',headless:true,trace:'retain-on-failure',screenshot:'only-on-failure'},reporter:[['list'],['html',{open:'never'}]]});
