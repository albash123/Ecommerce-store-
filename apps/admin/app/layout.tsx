import './globals.css';
import { Providers } from '../components/providers';
export const metadata = { title: 'Commerce administration', robots: {index:false,follow:false} };
export default function Layout({children}:{children:React.ReactNode}) {return <html lang="en"><body><Providers>{children}</Providers></body></html>}
