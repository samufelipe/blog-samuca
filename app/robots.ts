import type { MetadataRoute } from 'next'

export default function robots(): MetadataRoute.Robots {
  return {
    rules: { userAgent: '*', allow: '/' },
    sitemap: 'https://blog.samucads.com.br/sitemap.xml',
    host: 'https://blog.samucads.com.br',
  }
}
