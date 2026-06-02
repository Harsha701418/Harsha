import './globals.css';

export const metadata = {
  title: 'AirDosa - AI-Powered Instant Dosa Drone Delivery',
  description: 'Get hot, golden-crisp South Indian dosas delivered straight to your balcony via AI-guided autonomous drones in under 5 minutes. No soggy food, just pure crispy magic.',
};

export default function RootLayout({ children }) {
  return (
    <html lang="en">
      <head>
        <link rel="preconnect" href="https://fonts.googleapis.com" />
        <link rel="preconnect" href="https://fonts.gstatic.com" crossOrigin="anonymous" />
        <link href="https://fonts.googleapis.com/css2?family=Inter:wght@300;400;500;600;700&family=Outfit:wght@400;500;600;700;800;900&display=swap" rel="stylesheet" />
      </head>
      <body>
        {children}
      </body>
    </html>
  );
}
