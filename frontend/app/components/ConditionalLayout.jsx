'use client';
import { usePathname } from 'next/navigation';
import Header from './Header';
import Footer from './Footer';

export default function ConditionalLayout({ children }) {
  const pathname = usePathname();
  
  // Check if current path is an admin page
  const isAdminPage = pathname?.startsWith('/Admin') || 
                      pathname?.startsWith('/admin') ||
                      pathname === '/Admin' ||
                      pathname === '/admin';
  
  return (
    <>
      {!isAdminPage && <Header />}
      <main className={isAdminPage ? 'min-h-screen' : ''}>{children}</main>
      {!isAdminPage && <Footer />}
    </>
  );
}
