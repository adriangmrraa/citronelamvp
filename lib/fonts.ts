import localFont from 'next/font/local';

export const avigea = localFont({
  src: [
    {
      path: '../public/fonts/avigea/Avigea.woff2',
      weight: '400',
      style: 'normal',
    },
    {
      path: '../public/fonts/avigea/Avigea Italic.woff2',
      weight: '400',
      style: 'italic',
    },
  ],
  variable: '--font-avigea',
});
