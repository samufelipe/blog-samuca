import type { Config } from 'tailwindcss'

const config: Config = {
  content: [
    './pages/**/*.{js,ts,jsx,tsx,mdx}',
    './components/**/*.{js,ts,jsx,tsx,mdx}',
    './app/**/*.{js,ts,jsx,tsx,mdx}',
  ],
  theme: {
    extend: {
      fontFamily: {
        playfair: ['"Playfair Display"', 'serif'],
        sans: ['Inter', 'system-ui', '-apple-system', 'sans-serif'],
      },
      typography: {
        DEFAULT: {
          css: {
            '--tw-prose-body': 'rgba(255,255,255,0.65)',
            '--tw-prose-headings': 'rgba(255,255,255,0.90)',
            '--tw-prose-lead': 'rgba(255,255,255,0.55)',
            '--tw-prose-links': 'rgba(255,255,255,0.85)',
            '--tw-prose-bold': 'rgba(255,255,255,0.90)',
            '--tw-prose-counters': 'rgba(255,255,255,0.30)',
            '--tw-prose-bullets': 'rgba(255,255,255,0.20)',
            '--tw-prose-hr': 'rgba(255,255,255,0.08)',
            '--tw-prose-quotes': 'rgba(255,255,255,0.65)',
            '--tw-prose-quote-borders': 'rgba(255,255,255,0.10)',
            '--tw-prose-captions': 'rgba(255,255,255,0.35)',
            '--tw-prose-code': 'rgba(255,255,255,0.85)',
            '--tw-prose-pre-code': 'rgba(255,255,255,0.80)',
            '--tw-prose-pre-bg': 'rgba(255,255,255,0.04)',
            '--tw-prose-th-borders': 'rgba(255,255,255,0.08)',
            '--tw-prose-td-borders': 'rgba(255,255,255,0.05)',
            maxWidth: 'none',
            h1: { fontFamily: '"Playfair Display", serif', fontWeight: '700' },
            h2: { fontFamily: '"Playfair Display", serif', fontWeight: '600', marginTop: '2.5em' },
            h3: { fontWeight: '600' },
            p: { lineHeight: '1.9' },
            a: { textDecoration: 'none', '&:hover': { textDecoration: 'underline' } },
            'code::before': { content: '""' },
            'code::after': { content: '""' },
          },
        },
      },
    },
  },
  plugins: [require('@tailwindcss/typography')],
}

export default config
