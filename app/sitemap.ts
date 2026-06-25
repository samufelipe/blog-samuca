import type { MetadataRoute } from 'next'
import { getAllArticles } from '@/lib/mdx'

const BASE = 'https://blog.samucads.com.br'

export default function sitemap(): MetadataRoute.Sitemap {
  const articles = getAllArticles()

  const articleUrls: MetadataRoute.Sitemap = articles.map((a) => ({
    url: `${BASE}/${a.slug}`,
    lastModified: new Date(a.lastModified ?? a.date),
    changeFrequency: 'monthly',
    priority: 0.8,
  }))

  return [
    { url: BASE, lastModified: new Date(), changeFrequency: 'daily', priority: 1 },
    ...articleUrls,
  ]
}
