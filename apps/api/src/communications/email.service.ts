import {Inject,Injectable} from '@nestjs/common';
import {Interval} from '@nestjs/schedule';
import {PrismaService} from '../common/prisma.service';
@Injectable()
export class EmailService {
 private running=false;
 constructor(@Inject(PrismaService) private db:PrismaService){}
 async enqueue(to:string,key:string,values:Record<string,string>){const template=await this.db.emailTemplate.findUnique({where:{key}});const replace=(text:string)=>text.replace(/\{\{(\w+)\}\}/g,(_,name:string)=>values[name]||'');return this.db.emailOutbox.create({data:{to,subject:replace(template?.subject||key.replaceAll('_',' ')),body:replace(template?.body||'{{message}}')}});}
 @Interval(30000)
 async sendPending(){if(this.running||process.env.EMAIL_PROVIDER!=='resend'||!process.env.EMAIL_API_KEY)return;this.running=true;try{const mails=await this.db.emailOutbox.findMany({where:{status:'PENDING',attempts:{lt:5}},take:20,orderBy:{createdAt:'asc'}});for(const mail of mails){const claim=await this.db.emailOutbox.updateMany({where:{id:mail.id,status:'PENDING'},data:{status:'SENDING',attempts:{increment:1}}});if(!claim.count)continue;try{const res=await fetch('https://api.resend.com/emails',{method:'POST',headers:{Authorization:`Bearer ${process.env.EMAIL_API_KEY}`,'Content-Type':'application/json','Idempotency-Key':mail.id},body:JSON.stringify({from:process.env.EMAIL_FROM,to:mail.to,subject:mail.subject,text:mail.body})});if(!res.ok)throw new Error(`Email provider returned ${res.status}`);await this.db.emailOutbox.update({where:{id:mail.id},data:{status:'SENT',sentAt:new Date()}});}catch(error){await this.db.emailOutbox.update({where:{id:mail.id},data:{status:mail.attempts>=4?'FAILED':'PENDING',lastError:error instanceof Error?error.message:'Provider error'}});}}}finally{this.running=false;}}
}
