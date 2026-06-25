import Anthropic from '@anthropic-ai/sdk'
import * as fs from 'fs'
import * as path from 'path'

const client = new Anthropic({ apiKey: process.env.ANTHROPIC_API_KEY })

const TOPICS = [
  'Como estruturar campanhas Meta Ads para geração de leads em negócios locais',
  'Google Ads Search vs Performance Max: qual usar para PMEs em 2025',
  'Como calcular o CAC correto em campanhas de tráfego pago',
  'Os 7 erros mais comuns em Meta Ads que destroem o ROAS',
  'Landing page vs site: quando usar cada um para captar leads',
  'Como criar audiências personalizadas no Meta Ads para negócios B2B',
  'Remarketing no Google Ads: estratégia completa para PMEs',
  'Meta Ads para clínicas e serviços de saúde: o que pode e o que não pode',
  'Como interpretar o relatório de desempenho do Meta Ads sem se perder',
  'Google Ads para e-commerce: estrutura de campanhas Shopping e Search',
  'Quanto investir em tráfego pago: fórmula para calcular o orçamento ideal',
  'Concessionárias e o Meta Ads: como vender carros com tráfego pago',
  'LinkedIn Ads para B2B: quando vale o custo mais alto por lead',
  'Como usar o Google Analytics 4 junto com Meta Ads e Google Ads',
  'Pixel do Meta: configuração completa e eventos obrigatórios',
  'ROAS de 3:1 é suficiente? Como definir a meta certa para seu negócio',
  'Tráfego pago para serviços locais: Google Ads local vs Meta Ads',
  'Como escalar campanhas Meta Ads sem quebrar o que está funcionando',
  'Automação com IA no Google Ads: o que delegar e o que controlar',
  'Funil de vendas com tráfego pago: estrutura completa do topo ao fundo',
  'Como criar copy que converte no Meta Ads em 2025',
  'CPA alto no Google Ads? 5 causas e como resolver cada uma',
  'YouTube Ads para PMEs: quando faz sentido entrar nessa mídia',
  'Métricas de vaidade vs métricas que importam no tráfego pago',
  'Como fazer testes A/B no Meta Ads sem desperdiçar orçamento',
  'Otimização de conversão (CRO) para landing pages de tráfego pago',
  'Meta Ads para e-commerce: catálogo dinâmico e anúncios de produto',
  'Como conquistar os primeiros clientes com Meta Ads com pouco orçamento',
  'Tráfego pago para escritórios de advocacia: restrições e boas práticas',
  'Google Ads para indústrias e distribuidores: uma abordagem diferente',
]

function toSlug(text: string): string {
  return text
    .toLowerCase()
    .normalize('NFD')
    .replace(/[̀-ͯ]/g, '')
    .replace(/[^a-z0-9\s-]/g, '')
    .replace(/\s+/g, '-')
    .replace(/-+/g, '-')
    .trim()
    .substring(0, 60)
}

async function generateArticle(topic: string): Promise<void> {
  console.log(`Gerando artigo sobre: "${topic}"`)

  const today = new Date().toISOString().split('T')[0]

  const prompt = `Você é Samuel Felipe, especialista em tráfego pago com mais de 5 anos de experiência em Meta Ads, Google Ads, YouTube Ads e LinkedIn Ads. Você atende PMEs brasileiras de diversos setores.

Escreva um artigo de blog completo em português brasileiro sobre:
"${topic}"

REGRAS OBRIGATÓRIAS:
1. Retorne APENAS o conteúdo MDX completo, começando com --- (frontmatter YAML)
2. Não use bloco de código ao redor do conteúdo
3. O frontmatter YAML deve ter exatamente estes campos:
   - title: (título SEO, 55-65 chars, com keyword principal)
   - description: (meta description, 145-160 chars)
   - date: "${today}"
   - lastModified: "${today}"
   - category: (uma de: Meta Ads | Google Ads | Landing Pages | Estratégia Digital | Analytics)
   - tags: (array de 4-6 strings em minúsculo)
   - readingTime: (ex: "8 min")
   - featured: false
   - faq: (array de 3-5 objetos com "q" e "a")
4. Mínimo 1800 palavras no corpo do artigo
5. Estrutura: H2 para seções principais, H3 para subseções
6. Primeira frase de cada seção H2 deve responder diretamente ao subtítulo (para AEO)
7. Inclua pelo menos 5 números/dados específicos com contexto brasileiro (ex: "em junho de 2025, segundo dados do Meta Business...")
8. Mencione exemplos de clientes reais que você atendeu sem revelar dados sensíveis
9. Tom: direto, prático, sem fluff. Você fala de experiência própria.
10. NÃO use as palavras: crucial, pivotal, vibrant, tapestry, delve, showcase, groundbreaking
11. As respostas do FAQ devem ter pelo menos 2 frases cada
12. Links internos: inclua 2-3 frases sugerindo links para outros artigos do blog (use formato: [âncora](/slug-do-artigo))

Retorne o MDX completo agora:`

  const response = await client.messages.create({
    model: 'claude-sonnet-4-6',
    max_tokens: 8192,
    messages: [{ role: 'user', content: prompt }],
  })

  const content = (response.content[0] as { text: string }).text.trim()

  if (!content.startsWith('---')) {
    throw new Error('Resposta inválida: não começa com frontmatter YAML')
  }

  const slug = toSlug(topic)
  const filename = `${today}-${slug}.mdx`
  const articlesDir = path.join(process.cwd(), 'content', 'articles')

  if (!fs.existsSync(articlesDir)) {
    fs.mkdirSync(articlesDir, { recursive: true })
  }

  const filepath = path.join(articlesDir, filename)
  fs.writeFileSync(filepath, content, 'utf-8')

  console.log(`Artigo salvo: ${filepath}`)
  console.log(`Tokens usados: ${response.usage.input_tokens} input, ${response.usage.output_tokens} output`)
}

// Escolhe tópico baseado no dia (cicla pelo array)
const dayIndex = Math.floor(Date.now() / (1000 * 60 * 60 * 24)) % TOPICS.length
const topic = process.argv[2] ?? TOPICS[dayIndex]

generateArticle(topic).catch((err) => {
  console.error('Erro ao gerar artigo:', err)
  process.exit(1)
})
