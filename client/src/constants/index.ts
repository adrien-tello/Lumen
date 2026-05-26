export const NAV_LINKS = [
  { label: 'Home', to: '/' },
  { label: 'Shop', to: '/products' },
  { label: 'Electronics', to: '/products?category=computers-accessories' },
  { label: 'Beauty', to: '/products?category=beauty-picks' },
  { label: 'Gaming', to: '/products?category=video-games' },
] as const;

export const FOOTER_COLUMNS = [
  {
    title: 'Get to Know Us',
    links: ['About Lumen', 'Careers', 'Press Releases', 'Sustainability'],
  },
  {
    title: 'Make Money With Us',
    links: ['Sell on Lumen', 'Become an Affiliate', 'Advertise Products', 'Self-Publish'],
  },
  {
    title: 'Let Us Help You',
    links: ['Your Account', 'Returns Centre', 'Shipping Rates', 'Help Centre'],
  },
  {
    title: 'Payment Products',
    links: ['Lumen Card', 'Shop with Points', 'Reload Your Balance', 'Currency Converter'],
  },
] as const;
