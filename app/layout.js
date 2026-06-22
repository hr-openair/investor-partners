import './globals.css';
import Header from '../components/ui/Header';
import Footer from '../components/ui/Footer';

export const metadata = {
  title: 'Investor Partners',
  description: 'General Atlantic & Lotus Investment GmbH',
};

export default function RootLayout({ children }) {
  return (
    <html lang="de">
      <body>
        <Header />
        <main className="container" style={{ flex: 1, paddingTop: '2rem', paddingBottom: '2rem' }}>
          {children}
        </main>
        <Footer />
      </body>
    </html>
  );
}