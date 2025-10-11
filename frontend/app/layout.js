import './globals.css';
import { AuthProvider } from './context/AuthContext';
import ConditionalLayout from './components/ConditionalLayout';

export const metadata = {
  title: 'FixFinder',
};

export default function RootLayout({ children }) {
  return (
    <html lang="en">
      <body>
        <AuthProvider>
          <ConditionalLayout>
            {children}
          </ConditionalLayout>
        </AuthProvider>
      </body>
    </html>
  );
}
