import './globals.css';
import { AuthProvider } from './context/AuthContext';
import Navbar from './components/Navbar';

export const metadata = {
  title: 'Next Auth App',
};

export default function RootLayout({ children }) {
  return (
    <html lang="en">
      <body>
        <AuthProvider>
          <Navbar />
          <main>{children}</main>
        </AuthProvider>
      </body>
    </html>
  );
}
