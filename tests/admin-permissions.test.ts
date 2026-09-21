import {describe,expect,it,vi} from 'vitest';
import {AdminService} from '../apps/api/src/admin/admin.service';
import type {PrismaService} from '../apps/api/src/common/prisma.service';
import type {ContentService} from '../apps/api/src/content/content.service';
import type {ProductsAdminService} from '../apps/api/src/admin/products.service';
import type {Principal} from '../apps/api/src/common/security';

describe('administrator deletion boundaries',()=>{
 const actor={id:'limited',permissions:['users.manage']} as Principal;
 function fixture(kind='ADMIN',permissions=['users.manage','settings.manage']){
  const remove=vi.fn();
  const tx={user:{findUniqueOrThrow:vi.fn().mockResolvedValue({kind,role:{permissions}}),delete:remove},role:{findUniqueOrThrow:vi.fn().mockResolvedValue({permissions}),delete:remove}};
  const db={user:{count:vi.fn().mockResolvedValue(0)},$transaction:async(fn:(value:typeof tx)=>unknown)=>fn(tx)};
  const service=new AdminService(db as unknown as PrismaService,{} as ContentService,{} as ProductsAdminService);
  return{service,remove};
 }
 it('rejects deleting an administrator with permissions the actor lacks',async()=>{
  const{service,remove}=fixture();await expect(service.remove('users','privileged',actor)).rejects.toThrow('more privileged');expect(remove).not.toHaveBeenCalled();
 });
 it('rejects deleting a customer through the administrator endpoint',async()=>{
  const{service,remove}=fixture('CUSTOMER',[]);await expect(service.remove('users','customer',actor)).rejects.toThrow('Administrator not found');expect(remove).not.toHaveBeenCalled();
 });
 it('rejects deleting an unassigned role with permissions the actor lacks',async()=>{
  const{service,remove}=fixture();await expect(service.remove('roles','privileged-role',actor)).rejects.toThrow('more privileged');expect(remove).not.toHaveBeenCalled();
 });
});
