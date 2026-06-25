import type { Article, FAQItem } from './mdx'

const BASE_URL = 'https://blog.samucads.com.br'
const AUTHOR_URL = 'https://samucads.com.br'
const PROFILE_IMAGE = `${BASE_URL}/samuel-profile.jpg`

export const personSchema = {
  '@context': 'https://schema.org',
  '@type': 'Person',
  name: 'Samuel Felipe',
  url: AUTHOR_URL,
  image: PROFILE_IMAGE,
  jobTitle: 'Especialista em Marketing Digital',
  description: 'Especialista em tráfego pago com mais de 5 anos de experiência em Meta Ads, Google Ads e estratégia digital para PMEs.',
  knowsAbout: ['Meta Ads', 'Google Ads', 'Tráfego Pago', 'Marketing Digital', 'Landing Pages', 'Funis de Conversão', 'SEO'],
  address: { '@type': 'PostalAddress', addressLocality: 'Belo Horizonte', addressRegion: 'MG', addressCountry: 'BR' },
  sameAs: [AUTHOR_URL],
}

export const webSiteSchema = {
  '@context': 'https://schema.org',
  '@type': 'WebSite',
  name: 'Blog | Samuel Felipe',
  url: BASE_URL,
  description: 'Estratégias de tráfego pago, Meta Ads, Google Ads e marketing digital para PMEs brasileiras.',
  inLanguage: 'pt-BR',
  author: personSchema,
}

export function articleSchema(article: Article) {
  return {
    '@context': 'https://schema.org',
    '@type': 'Article',
    headline: article.title,
    description: article.description,
    datePublished: article.date,
    dateModified: article.lastModified ?? article.date,
    inLanguage: 'pt-BR',
    url: `${BASE_URL}/${article.slug}`,
    image: article.image ? `${BASE_URL}${article.image}` : PROFILE_IMAGE,
    author: personSchema,
    publisher: {
      '@type': 'Person',
      name: 'Samuel Felipe',
      url: AUTHOR_URL,
      image: PROFILE_IMAGE,
    },
    mainEntityOfPage: { '@type': 'WebPage', '@id': `${BASE_URL}/${article.slug}` },
    keywords: article.tags?.join(', '),
    articleSection: article.category,
    wordCount: article.content?.split(/\s+/).length ?? 0,
  }
}

export function faqSchema(faqItems: FAQItem[]) {
  return {
    '@context': 'https://schema.org',
    '@type': 'FAQPage',
    mainEntity: faqItems.map((item) => ({
      '@type': 'Question',
      name: item.q,
      acceptedAnswer: { '@type': 'Answer', text: item.a },
    })),
  }
}

export function breadcrumbSchema(slug: string, title: string) {
  return {
    '@context': 'https://schema.org',
    '@type': 'BreadcrumbList',
    itemListElement: [
      { '@type': 'ListItem', position: 1, name: 'Blog', item: BASE_URL },
      { '@type': 'ListItem', position: 2, name: title, item: `${BASE_URL}/${slug}` },
    ],
  }
}
