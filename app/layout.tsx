import type { Metadata } from 'next'
import { Inter, Playfair_Display } from 'next/font/google'
import './globals.css'
import { webSiteSchema, personSchema } from '@/lib/schema'

const inter = Inter({ subsets: ['latin'], variable: '--font-inter', display: 'swap' })
const playfair = Playfair_Display({
  subsets: ['latin'],
  variable: '--font-playfair',
  display: 'swap',
  weight: ['400', '600', '700'],
  style: ['normal', 'italic'],
})

export const metadata: Metadata = {
  metadataBase: new URL('https://blog.samucads.com.br'),
  title: { default: 'Blog — Samuel Felipe', template: '%s | Samuel Felipe' },
  description: 'Estratégias práticas de Meta Ads, Google Ads e marketing digital para PMEs. Artigos com dados reais e aplicação imediata.',
  openGraph: {
    type: 'website',
    locale: 'pt_BR',
    url: 'https://blog.samucads.com.br',
    siteName: 'Blog Samuel Felipe',
    images: [{ url: '/samuel-profile.jpg', width: 1200, height: 630, alt: 'Samuel Felipe — Especialista em Marketing Digital' }],
  },
  twitter: { card: 'summary_large_image' },
  alternates: { canonical: 'https://blog.samucads.com.br', types: { 'application/rss+xml': '/feed.xml' } },
  robots: {
    index: true,
    follow: true,
    googleBot: { index: true, follow: true, 'max-snippet': -1, 'max-image-preview': 'large', 'max-video-preview': -1 },
  },
}

export default function RootLayout({ children }: { children: React.ReactNode }) {
  return (
    <html lang="pt-BR" className={`${inter.variable} ${playfair.variable}`}>
      <head>
        <script type="application/ld+json" dangerouslySetInnerHTML={{ __html: JSON.stringify(webSiteSchema) }} />
        <script type="application/ld+json" dangerouslySetInnerHTML={{ __html: JSON.stringify(personSchema) }} />
      </head>
      <body className="font-sans antialiased">
        <header className="fixed top-0 left-0 right-0 z-50 bg-[#050505]/90 backdrop-blur-xl border-b border-white/[0.05]">
          <div className="max-w-6xl mx-auto px-6 md:px-12 h-16 flex items-center justify-between">
            <a href="/" className="text-[11px] font-semibold tracking-[0.2em] uppercase text-white/80 hover:text-white transition-colors">
              Samuel Felipe <span className="text-white/20 font-normal">/ Blog</span>
            </a>
            <nav className="flex items-center gap-8">
              <a href="https://portfolio.samucads.com.br" target="_blank" rel="noopener noreferrer"
                className="text-[11px] tracking-wide text-white/25 hover:text-white/60 transition-colors hidden md:block">
                Portfólio
              </a>
              <a
                href="https://wa.me/5531992976990?text=Oi%20Samuel%2C%20vi%20seu%20blog%20e%20quero%20conversar"
                target="_blank" rel="noopener noreferrer"
                className="text-[11px] tracking-wide text-white/25 hover:text-white/60 transition-colors">
                WhatsApp
              </a>
            </nav>
          </div>
        </header>

        <main className="pt-16">{children}</main>

        <footer className="border-t border-white/[0.05] px-6 md:px-12 py-12 mt-24">
          <div className="max-w-6xl mx-auto flex flex-col md:flex-row items-start md:items-center justify-between gap-4">
            <div>
              <p className="text-[11px] font-semibold tracking-[0.2em] uppercase text-white/40">Samuel Felipe</p>
              <p className="text-[10px] text-white/20 mt-1">Especialista em Marketing Digital · Belo Horizonte, MG</p>
            </div>
            <p className="text-[10px] text-white/15">© {new Date().getFullYear()} · Todos os direitos reservados</p>
          </div>
        </footer>
      </body>
    </html>
  )
}
