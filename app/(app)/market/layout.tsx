import type { Metadata } from 'next';

export const metadata: Metadata = {
  title: 'CitroMarket - Citronela',
  description: 'El mercado cannábico más grande de la red.',
};

export default function MarketLayout({
  children,
}: {
  children: React.ReactNode;
}) {
  return <>{children}</>;
}
