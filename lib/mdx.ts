import fs from 'fs'
import path from 'path'
import matter from 'gray-matter'

const ARTICLES_DIR = path.join(process.cwd(), 'content', 'articles')

export interface FAQItem {
  q: string
  a: string
}

export interface ArticleFrontmatter {
  title: string
  description: string
  date: string
  lastModified?: string
  category: string
  tags: string[]
  image?: string
  imageAlt?: string
  readingTime?: string
  featured?: boolean
  faq?: FAQItem[]
}

export interface Article extends ArticleFrontmatter {
  slug: string
  content: string
}

export function getAllArticles(): Article[] {
  if (!fs.existsSync(ARTICLES_DIR)) return []

  const files = fs.readdirSync(ARTICLES_DIR)
    .filter((f) => f.endsWith('.mdx') || f.endsWith('.md'))
    .sort()
    .reverse()

  return files.map((filename) => {
    const slug = filename.replace(/^\d{4}-\d{2}-\d{2}-/, '').replace(/\.(mdx|md)$/, '')
    const raw = fs.readFileSync(path.join(ARTICLES_DIR, filename), 'utf-8')
    const { data, content } = matter(raw)
    const words = content.split(/\s+/).length
    const mins = Math.max(1, Math.round(words / 200))
    return {
      slug,
      content,
      ...(data as ArticleFrontmatter),
      readingTime: data.readingTime ?? `${mins} min`,
    }
  })
}

export function getArticleBySlug(slug: string): Article | null {
  const all = getAllArticles()
  return all.find((a) => a.slug === slug) ?? null
}

export function getFeaturedArticles(): Article[] {
  return getAllArticles().filter((a) => a.featured).slice(0, 3)
}

export function getRelatedArticles(current: Article, count = 3): Article[] {
  return getAllArticles()
    .filter((a) => a.slug !== current.slug)
    .filter((a) => a.category === current.category || a.tags?.some((t) => current.tags?.includes(t)))
    .slice(0, count)
}
