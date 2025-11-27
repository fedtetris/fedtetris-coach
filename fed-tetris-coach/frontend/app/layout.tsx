import type { Metadata } from "next";
import "./globals.css";
import '@coinbase/onchainkit/styles.css';
import { Providers } from './providers';
import { MiniAppBootstrap } from './miniapp-bootstrap';

const MINIAPP = {
  name: 'FedTetris Coach',
  description: 'Federated Learning Tetris Coach',
  embedImageUrl: 'https://your-domain.com/og.png', // TODO: Update with actual URL
  homeUrl: 'https://your-domain.com', // TODO: Update with actual URL
};

export const metadata: Metadata = {
  title: MINIAPP.name,
  description: MINIAPP.description,
  other: {
    'fc:miniapp': JSON.stringify({
      version: 'next',
      imageUrl: MINIAPP.embedImageUrl,
      button: {
        title: `Open ${MINIAPP.name}`,
        action: {
          type: 'launch_frame',
          url: MINIAPP.homeUrl,
        },
      },
    }),
  },
};

export default function RootLayout({
  children,
}: Readonly<{
  children: React.ReactNode;
}>) {
  return (
    <html lang="en">
      <body>
        <MiniAppBootstrap>
          <Providers>
            {children}
          </Providers>
        </MiniAppBootstrap>
      </body>
    </html>
  );
}