import { getAllArticles } from '@/lib/mdx'
import Link from 'next/link'

const CATEGORIES = ['Todos', 'Meta Ads', 'Google Ads', 'Landing Pages', 'Estratégia Digital', 'Analytics']

export default function BlogHome() {
  const articles = getAllArticles()

  return (
    <div className="min-h-screen bg-[#050505] text-white">

      {/* Hero */}
      <section className="px-6 md:px-12 pt-20 pb-16">
        <div className="max-w-6xl mx-auto">
          <p className="text-[10px] tracking-[0.35em] uppercase text-white/20 mb-6">
            Estratégia Digital · Marketing Pago · PMEs Brasileiras
          </p>
          <h1 className="playfair text-[clamp(2.8rem,7vw,5.5rem)] font-bold leading-[1.05] tracking-tight mb-6">
            Tráfego que<br /><em>converte.</em>
          </h1>
          <p className="text-white/40 text-base md:text-lg max-w-xl leading-relaxed">
            Artigos práticos sobre Meta Ads, Google Ads e estratégia digital. Sem teoria vaga — só o que funciona para negócios reais no Brasil.
          </p>
        </div>
      </section>

      {/* Divisor */}
      <div className="max-w-6xl mx-auto px-6 md:px-12">
        <div className="h-px bg-white/[0.06]" />
      </div>

      {/* Filtros por categoria */}
      <div className="sticky top-16 z-40 bg-[#050505]/90 backdrop-blur-xl border-b border-white/[0.05] px-6 md:px-12">
        <div className="max-w-6xl mx-auto">
          <div className="flex gap-7 overflow-x-auto scrollbar-hide py-4">
            {CATEGORIES.map((cat) => (
              <span key={cat} className="whitespace-nowrap text-[11px] tracking-wide text-white/30 cursor-default">
                {cat}
              </span>
            ))}
          </div>
        </div>
      </div>

      {/* Grid de artigos */}
      <section className="px-6 md:px-12 py-16">
        <div className="max-w-6xl mx-auto">
          {articles.length === 0 ? (
            <div className="py-32 text-center">
              <p className="text-white/20 text-sm">Primeiros artigos em breve.</p>
            </div>
          ) : (
            <div className="grid grid-cols-1 md:grid-cols-2 lg:grid-cols-3">
              {articles.map((article, i) => (
                <Link
                  key={article.slug}
                  href={`/${article.slug}`}
                  className="group border border-white/[0.05] -mt-px -ml-px p-8 md:p-10 flex flex-col gap-5 hover:bg-white/[0.02] transition-colors"
                >
                  {/* Categoria + data */}
                  <div className="flex items-center justify-between">
                    <span className="text-[10px] tracking-[0.25em] uppercase text-white/25">{article.category}</span>
                    <span className="text-[10px] text-white/15 tabular-nums">{String(i + 1).padStart(2, '0')}</span>
                  </div>

                  {/* Título */}
                  <h2 className="playfair text-[15px] md:text-base font-semibold text-white/80 group-hover:text-white leading-snug transition-colors line-clamp-3">
                    {article.title}
                  </h2>

                  {/* Descrição */}
                  <p className="text-[13px] text-white/35 leading-relaxed line-clamp-2 flex-1">
                    {article.description}
                  </p>

                  {/* Meta */}
                  <div className="flex items-center justify-between mt-auto pt-2">
                    <span className="text-[11px] text-white/20">
                      {new Date(article.date).toLocaleDateString('pt-BR', { day: '2-digit', month: 'short', year: 'numeric' })}
                      {article.readingTime && ` · ${article.readingTime}`}
                    </span>
                    <span className="text-white/15 group-hover:text-white/50 transition-colors">→</span>
                  </div>
                </Link>
              ))}
            </div>
          )}
        </div>
      </section>

      {/* CTA Footer */}
      <section className="border-t border-white/[0.05] px-6 md:px-12 py-24">
        <div className="max-w-6xl mx-auto grid grid-cols-1 md:grid-cols-2 gap-12 items-end">
          <div>
            <p className="text-[10px] tracking-[0.3em] uppercase text-white/20 mb-5">Trabalhe comigo</p>
            <h2 className="playfair text-3xl md:text-4xl font-bold leading-snug">
              Precisa de tráfego<br />que gera resultado?
            </h2>
          </div>
          <div className="flex flex-col items-start md:items-end gap-4">
            <p className="text-[13px] text-white/30 leading-relaxed md:text-right max-w-xs">
              Diagnóstico gratuito. Conversa de 5 minutos para entender se faz sentido trabalharmos juntos.
            </p>
            <a
              href="https://wa.me/5531992976990?text=Oi%20Samuel%2C%20li%20seu%20blog%20e%20quero%20um%20diagn%C3%B3stico%20gratuito"
              target="_blank"
              rel="noopener noreferrer"
              className="inline-block bg-white text-black text-[12px] font-semibold tracking-[0.15em] uppercase px-8 py-4 hover:bg-white/90 transition-colors"
            >
              Falar com Samuel
            </a>
          </div>
        </div>
      </section>
    </div>
  )
}
