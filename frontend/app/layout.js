import './globals.css';
import { AuthProvider } from './context/AuthContext';
import Navbar from './components/Navbar';
import Header from './components/Header';
import Footer from './components/Footer';

export const metadata = {
  title: 'FixFinder',
};

export default function RootLayout({ children }) {
  return (
    <html lang="en">
      <body>
        <AuthProvider>
          <Header />
          <main>{children}</main>
          <Footer />
        </AuthProvider>
      </body>
    </html>
  );
}
