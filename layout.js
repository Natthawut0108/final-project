import './globals.css';

export const metadata = {
  title: 'คำนวณค่ารถเมล์',
  description: 'ประมาณค่ารถเมล์กรุงเทพฯ จากต้นทางไปปลายทาง',
};

export default function RootLayout({ children }) {
  return (
    <html lang="th">
      <body>{children}</body>
    </html>
  );
}
