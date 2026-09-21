import { Admin } from '../../../components/admin';
import { Suspense } from 'react';
export default function Page(){return <Suspense fallback={<div className="center">Loading workspace…</div>}><Admin/></Suspense>}
