import { notFound } from 'next/navigation'
import type { Metadata } from 'next'
import { MDXRemote } from 'next-mdx-remote/rsc'
import { getAllArticles, getArticleBySlug, getRelatedArticles } from '@/lib/mdx'
import { articleSchema, faqSchema, breadcrumbSchema } from '@/lib/schema'
import Link from 'next/link'

interface Props {
  params: { slug: string }
}

export async function generateStaticParams() {
  return getAllArticles().map((a) => ({ slug: a.slug }))
}

export async function generateMetadata({ params }: Props): Promise<Metadata> {
  const article = getArticleBySlug(params.slug)
  if (!article) return {}
  const ogImage = article.coverImage ?? article.image
  return {
    title: article.title,
    description: article.description,
    openGraph: {
      type: 'article',
      title: article.title,
      description: article.description,
      publishedTime: article.date,
      modifiedTime: article.lastModified ?? article.date,
      authors: ['Samuel Felipe'],
      tags: article.tags,
      images: ogImage ? [{ url: ogImage, alt: article.coverImageAlt ?? article.title }] : undefined,
    },
    alternates: { canonical: `https://blog.samucads.com.br/${article.slug}` },
  }
}

export default function ArticlePage({ params }: Props) {
  const article = getArticleBySlug(params.slug)
  if (!article) notFound()

  const all = getAllArticles()
  const idx = all.findIndex((a) => a.slug === article.slug)
  const prev = idx < all.length - 1 ? all[idx + 1] : null
  const next = idx > 0 ? all[idx - 1] : null
  const related = getRelatedArticles(article, 3)

  const schemas = [
    articleSchema(article),
    article.faq?.length ? faqSchema(article.faq) : null,
    breadcrumbSchema(article.slug, article.title),
  ].filter(Boolean)

  return (
    <div className="min-h-screen bg-[#050505] text-white">
      {schemas.map((s, i) => (
        <script key={i} type="application/ld+json" dangerouslySetInnerHTML={{ __html: JSON.stringify(s) }} />
      ))}

      {/* Hero do artigo */}
      <section className="px-6 md:px-12 pt-20 pb-12">
        <div className="max-w-3xl mx-auto">

          {/* Breadcrumb */}
          <nav className="flex items-center gap-2 text-[10px] tracking-widest uppercase text-white/20 mb-10">
            <Link href="/" className="hover:text-white/50 transition-colors">Blog</Link>
            <span>/</span>
            <span>{article.category}</span>
          </nav>

          {/* Título */}
          <h1 className="playfair text-[clamp(1.9rem,4.5vw,3rem)] font-bold leading-tight mb-6">
            {article.title}
          </h1>

          {/* Descrição */}
          <p className="text-white/45 text-base md:text-lg leading-relaxed mb-8 max-w-2xl">
            {article.description}
          </p>

          {/* Meta */}
          <div className="flex flex-wrap items-center gap-x-5 gap-y-2">
            <span className="text-[11px] text-white/25">
              {new Date(article.date).toLocaleDateString('pt-BR', { day: '2-digit', month: 'long', year: 'numeric' })}
            </span>
            {article.readingTime && (
              <span className="text-[11px] text-white/20">{article.readingTime} de leitura</span>
            )}
            <span className="text-[10px] tracking-[0.2em] uppercase text-white/20">{article.category}</span>
          </div>
        </div>
      </section>

      {/* Imagem de capa */}
      {article.coverImage && (
        <div className="px-6 md:px-12 pb-2">
          <div className="max-w-3xl mx-auto">
            <div className="w-full aspect-video overflow-hidden">
              <img
                src={article.coverImage}
                alt={article.coverImageAlt ?? article.title}
                className="w-full h-full object-cover grayscale opacity-60"
              />
            </div>
          </div>
        </div>
      )}

      {/* Divisor */}
      <div className="max-w-3xl mx-auto px-6 md:px-12 mt-10">
        <div className="h-px bg-white/[0.06]" />
      </div>

      {/* Conteúdo MDX */}
      <article className="px-6 md:px-12 py-14">
        <div className="max-w-3xl mx-auto prose prose-invert prose-lg">
          <MDXRemote source={article.content} />
        </div>
      </article>

      {/* FAQ */}
      {article.faq && article.faq.length > 0 && (
        <>
          <div className="max-w-3xl mx-auto px-6 md:px-12">
            <div className="h-px bg-white/[0.06]" />
          </div>
          <section className="px-6 md:px-12 py-14">
            <div className="max-w-3xl mx-auto">
              <p className="text-[10px] tracking-[0.3em] uppercase text-white/20 mb-8">Perguntas Frequentes</p>
              <div className="space-y-8">
                {article.faq.map((item, i) => (
                  <div key={i}>
                    <h3 className="playfair text-base font-semibold text-white/80 mb-3">{item.q}</h3>
                    <p className="text-[14px] text-white/50 leading-loose">{item.a}</p>
                  </div>
                ))}
              </div>
            </div>
          </section>
        </>
      )}

      {/* Divisor */}
      <div className="max-w-3xl mx-auto px-6 md:px-12">
        <div className="h-px bg-white/[0.06]" />
      </div>

      {/* Autor */}
      <section className="px-6 md:px-12 py-12">
        <div className="max-w-3xl mx-auto flex items-center gap-6">
          <img src="/samuel-profile.jpg" alt="Samuel Felipe" className="w-14 h-14 object-cover object-top grayscale flex-shrink-0" />
          <div>
            <p className="text-[11px] tracking-[0.2em] uppercase text-white/20 mb-1">Autor</p>
            <p className="text-sm font-semibold text-white/80">Samuel Felipe</p>
            <p className="text-[12px] text-white/35 mt-0.5">Especialista em tráfego pago com 6 anos de experiência. Já atendeu desde negócios locais até marcas nacionais como HDI Brasil, Mercedes-Benz e Porsche Center BH.</p>
          </div>
        </div>
      </section>

      {/* CTA */}
      <div className="max-w-3xl mx-auto px-6 md:px-12">
        <div className="h-px bg-white/[0.06]" />
      </div>

      <section className="px-6 md:px-12 py-16">
        <div className="max-w-3xl mx-auto flex flex-col md:flex-row items-start md:items-end justify-between gap-8">
          <div>
            <p className="text-[10px] tracking-[0.3em] uppercase text-white/20 mb-4">Precisa de ajuda?</p>
            <h3 className="playfair text-2xl md:text-3xl font-bold leading-snug">
              Aplique isso no<br />seu negócio agora.
            </h3>
          </div>
          <a
            href={`https://wa.me/5531992976990?text=Oi%20Samuel%2C%20li%20o%20artigo%20sobre%20${encodeURIComponent(article.title)}%20e%20quero%20conversar`}
            target="_blank"
            rel="noopener noreferrer"
            className="shrink-0 bg-white text-black text-[12px] font-semibold tracking-[0.15em] uppercase px-8 py-4 hover:bg-white/90 transition-colors"
          >
            Falar com Samuel
          </a>
        </div>
      </section>

      {/* Artigos relacionados */}
      {related.length > 0 && (
        <>
          <div className="border-t border-white/[0.05] px-6 md:px-12 py-14">
            <div className="max-w-6xl mx-auto">
              <p className="text-[10px] tracking-[0.3em] uppercase text-white/20 mb-8">Continue lendo</p>
              <div className="grid grid-cols-1 md:grid-cols-3">
                {related.map((rel) => (
                  <Link key={rel.slug} href={`/${rel.slug}`}
                    className="group border border-white/[0.05] -mt-px -ml-px flex flex-col hover:bg-white/[0.02] transition-colors overflow-hidden">
                    {rel.coverImage && (
                      <div className="w-full aspect-video overflow-hidden">
                        <img src={rel.coverImage} alt={rel.title} className="w-full h-full object-cover grayscale opacity-40 group-hover:opacity-55 transition-opacity" />
                      </div>
                    )}
                    <div className="p-7 flex flex-col gap-4 flex-1">
                      <span className="text-[10px] tracking-[0.2em] uppercase text-white/20">{rel.category}</span>
                      <h4 className="playfair text-[14px] font-semibold text-white/70 group-hover:text-white leading-snug transition-colors line-clamp-3">{rel.title}</h4>
                      <span className="text-white/15 group-hover:text-white/40 transition-colors text-sm mt-auto">→</span>
                    </div>
                  </Link>
                ))}
              </div>
            </div>
          </div>
        </>
      )}

      {/* Prev / Next */}
      {(prev || next) && (
        <nav className="border-t border-white/[0.05] px-6 md:px-12 py-10">
          <div className="max-w-3xl mx-auto flex justify-between gap-6">
            {prev ? (
              <Link href={`/${prev.slug}`} className="group">
                <p className="text-[9px] tracking-[0.3em] uppercase text-white/20 mb-2">Anterior</p>
                <p className="text-[13px] font-medium text-white/35 group-hover:text-white transition-colors line-clamp-2 max-w-xs">{prev.title}</p>
              </Link>
            ) : <div />}
            {next ? (
              <Link href={`/${next.slug}`} className="group text-right ml-auto">
                <p className="text-[9px] tracking-[0.3em] uppercase text-white/20 mb-2">Próximo</p>
                <p className="text-[13px] font-medium text-white/35 group-hover:text-white transition-colors line-clamp-2 max-w-xs">{next.title}</p>
              </Link>
            ) : <div />}
          </div>
        </nav>
      )}
    </div>
  )
}
