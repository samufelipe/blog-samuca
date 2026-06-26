import Anthropic from '@anthropic-ai/sdk'
import * as fs from 'fs'
import * as path from 'path'

const client = new Anthropic({ apiKey: process.env.ANTHROPIC_API_KEY })

// Tópicos focados em dores reais: empreendedor desconfiante, quem quer escalar,
// gestores iniciantes, temas em alta no mercado digital atual
const TOPICS = [
  'Investi em tráfego pago e não tive resultado: o que realmente deu errado',
  'Por que você não consegue vender pelo Instagram mesmo tendo muitos seguidores',
  'Como saber se o seu gestor de tráfego está fazendo um bom trabalho ou te enganando',
  'Quanto tempo leva para o tráfego pago começar a gerar resultado de verdade',
  'A verdade sobre as promessas de resultado garantido no marketing digital',
  'Por que sua campanha funcionou bem no início e parou do nada',
  'Como parar de depender 100% de indicação e ter clientes todo dia',
  'O que nenhum gestor de tráfego te conta antes de você fechar contrato',
  'Você precisa de site ou landing page? A resposta honesta que ninguém dá',
  'Por que o seu concorrente aparece mais no Google mesmo gastando menos',
  'Como definir quanto investir em anúncios sem jogar dinheiro fora',
  'Tráfego pago para negócio local: o que funciona e o que é mito',
  'Como interpretar os números da sua campanha sem precisar ser especialista',
  'Por que lead barato nem sempre é bom negócio e quando ele é um problema',
  'O erro de comunicação que faz a maioria dos anúncios não converterem',
  'Gestores de tráfego iniciantes: os erros que cometi nos primeiros anos',
  'O que realmente importa medir nas suas campanhas (e o que é número de vaidade)',
  'Por que você está pagando caro por clique e como resolver isso',
  'Como criar um anúncio que para o dedo da pessoa no feed',
  'Inteligência artificial nos anúncios: o que realmente funciona e o que é hype',
  'O que é funil de vendas e por que ignorar isso está te custando clientes',
  'Como vender serviços de alto valor com tráfego pago sem parecer agressivo',
  'Por que sua landing page recebe visitas mas não converte em clientes',
  'Tráfego pago para prestador de serviços: por onde começar sem perder dinheiro',
  'Como turbinar os resultados de quem já faz tráfego pago mas está estagnado',
  'Primeira campanha no Meta Ads: o passo a passo que eu seguiria hoje',
  'Como escalar vendas digitais sem aumentar o custo por cliente',
  'O que mudou no Meta Ads em 2025 e o que você precisa adaptar agora',
  'Como uma empresa de serviços pode usar tráfego pago para crescer de forma previsível',
  'TikTok Ads vale a pena para o seu negócio? Resposta honesta com dados reais',
]

// Catálogo de imagens com descrição do conteúdo visual.
// O modelo escolhe a mais coerente com o TEMA do artigo, não só a categoria.
const IMAGE_CATALOG = [
  {
    url: 'https://images.unsplash.com/photo-1551288049-bebda4e38f71?w=1200&h=630&fit=crop&q=80',
    alt: 'Dashboard de analytics com gráficos e métricas de performance',
    topics: ['roas', 'métricas', 'analytics', 'performance', 'resultados', 'dados', 'relatório', 'números'],
  },
  {
    url: 'https://images.unsplash.com/photo-1460925895917-afdab827c52f?w=1200&h=630&fit=crop&q=80',
    alt: 'Laptop aberto com gráficos de campanhas digitais na tela',
    topics: ['campanha', 'google ads', 'search', 'performance max', 'anúncios', 'investimento', 'orçamento'],
  },
  {
    url: 'https://images.unsplash.com/photo-1553484771-371a605b060b?w=1200&h=630&fit=crop&q=80',
    alt: 'Equipe reunida analisando estratégia de marketing em quadro branco',
    topics: ['estratégia', 'funil', 'planejamento', 'escalar', 'crescimento', 'vendas', 'processo'],
  },
  {
    url: 'https://images.unsplash.com/photo-1432888622747-4eb9a8efeb07?w=1200&h=630&fit=crop&q=80',
    alt: 'Pessoa digitando em laptop em ambiente de trabalho moderno',
    topics: ['trabalho', 'gestão', 'operação', 'gestor', 'iniciante', 'rotina', 'execução'],
  },
  {
    url: 'https://images.unsplash.com/photo-1467232004584-a241de8bcf5d?w=1200&h=630&fit=crop&q=80',
    alt: 'Tela de computador mostrando design de site e wireframes',
    topics: ['landing page', 'site', 'design', 'conversão', 'página', 'cro', 'usabilidade'],
  },
  {
    url: 'https://images.unsplash.com/photo-1552664730-d307ca884978?w=1200&h=630&fit=crop&q=80',
    alt: 'Reunião de negócios com profissionais discutindo resultados',
    topics: ['negócio', 'cliente', 'reunião', 'proposta', 'contrato', 'parceria', 'b2b'],
  },
  {
    url: 'https://images.unsplash.com/photo-1504868584819-f8e8b4b6d7e3?w=1200&h=630&fit=crop&q=80',
    alt: 'Gráficos e tabelas de dados sendo analisados profissionalmente',
    topics: ['leads', 'cpl', 'cpa', 'custo', 'retorno', 'roi', 'investimento', 'meta'],
  },
  {
    url: 'https://images.unsplash.com/photo-1611162617474-5b21e879e113?w=1200&h=630&fit=crop&q=80',
    alt: 'Pessoa navegando em redes sociais no smartphone',
    topics: ['instagram', 'facebook', 'social media', 'engajamento', 'seguidores', 'conteúdo', 'tiktok'],
  },
  {
    url: 'https://images.unsplash.com/photo-1556761175-4b46a572b786?w=1200&h=630&fit=crop&q=80',
    alt: 'Profissionais de marketing discutindo campanha em ambiente corporativo',
    topics: ['agência', 'time', 'marketing', 'briefing', 'campanha', 'criativo', 'copy'],
  },
  {
    url: 'https://images.unsplash.com/photo-1543286386-713bdd548da4?w=1200&h=630&fit=crop&q=80',
    alt: 'Múltiplas telas mostrando dados e dashboards de marketing',
    topics: ['pixel', 'tag manager', 'rastreamento', 'configuração', 'tracking', 'evento', 'ga4'],
  },
]

function getCoverImageForTopic(topic: string): { url: string; alt: string } {
  const topicLower = topic.toLowerCase()
  let bestMatch = IMAGE_CATALOG[0]
  let bestScore = 0
  for (const img of IMAGE_CATALOG) {
    const score = img.topics.filter((t) => topicLower.includes(t)).length
    if (score > bestScore) {
      bestScore = score
      bestMatch = img
    }
  }
  return bestMatch
}

const SAMUEL_PROFILE = `
SOBRE SAMUEL FELIPE (autor do blog : escreva na voz dele, em primeira pessoa):
- Especialista em tráfego pago com mais de 6 anos de experiência prática
- Já atendeu desde negócios locais até grandes marcas: HDI Brasil, Instituto Embelleze (Grupo SMZTO),
  Porsche Center BH, Mercedes-Benz, Grupo Colina, Valem Administradora de Benefícios,
  Móveis Bechara, FAS Iluminação, Ilimit Proteção Veicular, Factorial Imóveis, Paula Reis Fotografia,
  Inovando Na Sua Obra, entre outros
- Certificações Google: Rede de Pesquisa, Display, Criativos, Métricas e Alta Performance com IA
- Domina: Google Ads, Meta Ads, TikTok Ads, Pinterest Ads, Google Tag Manager, GA4, CRO, funis de vendas,
  automações de marketing
- Segmentos de experiência: e-commerce, concessionárias, clínicas, imobiliárias, serviços locais,
  móveis planejados, iluminação, proteção veicular, educação, benefícios corporativos, jurídico
- Perfil: analítico, direto, sem rodeios. Traduz assuntos complexos em linguagem simples.
  Não se limita a campanhas: analisa oferta, posicionamento, funil, processo comercial.
- Valores: honestidade intelectual, transparência, excelência sem arrogância
`

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
  const dayIndex = Math.floor(Date.now() / (1000 * 60 * 60 * 24))

  const prompt = `${SAMUEL_PROFILE}

Escreva um artigo de blog completo em português brasileiro sobre:
"${topic}"

TOM E ESTILO OBRIGATÓRIOS:
- Escreva como Samuel falaria com um empreendedor ou gestor que ele respeita, não como um manual técnico
- Linguagem simples e acessível: quando usar termos técnicos, explique com analogia ou exemplo concreto
- Alto conhecimento com didática simples: o leitor precisa ENTENDER DE VERDADE, não só ler
- Primeira pessoa ("eu", "vi", "atendi", "aprendi") : você fala de experiência real
- Seja honesto, direto, sem rodeios e sem bajulação ao leitor
- Use exemplos de clientes reais que você atendeu (pode mencionar o setor ou porte sem revelar dados sensíveis)
- Mostre o lado humano e comercial, não só o técnico
- Tom: confiante sem arrogância. A precisão dos exemplos e dados é o que mostra autoridade, não o jargão.
- Varie o ritmo dos parágrafos. Parágrafos curtos para pontos fortes. Mais longos para explicações. Não abuse de bullets.

PÚBLICO-ALVO (escreva pensando nessas pessoas):
- Empreendedores que já tentaram tráfego pago e não tiveram resultado esperado
- Donos de negócio que desconfiam de agências e gestores de tráfego
- Empresas que já faturam e querem aumentar e escalar vendas de forma previsível
- Gestores de marketing que querem ir além do básico
- Gestores de tráfego iniciantes que querem aprender de verdade, não de teoria

REGRAS TÉCNICAS:
1. Retorne APENAS o conteúdo MDX completo, começando com --- (frontmatter YAML)
2. Não use bloco de código ao redor do conteúdo
3. O frontmatter YAML deve ter EXATAMENTE estes campos (sem outros):
   - title: string (55-65 chars, com keyword principal, SEM aspas duplas internas)
   - description: string (145-160 chars)
   - date: "${today}"
   - lastModified: "${today}"
   - category: string (uma de: Meta Ads | Google Ads | Landing Pages | Estratégia Digital | Analytics)
   - tags: array de 4-6 strings em minúsculo
   - coverImage: string (escolha a URL mais coerente com o TEMA do artigo, não apenas a categoria. Opções disponíveis:
       [analytics/métricas/roas/performance] → https://images.unsplash.com/photo-1551288049-bebda4e38f71?w=1200&h=630&fit=crop&q=80
       [laptop/campanhas/google ads/orçamento] → https://images.unsplash.com/photo-1460925895917-afdab827c52f?w=1200&h=630&fit=crop&q=80
       [estratégia/funil/planejamento/vendas] → https://images.unsplash.com/photo-1553484771-371a605b060b?w=1200&h=630&fit=crop&q=80
       [trabalho/gestão/operação/gestor] → https://images.unsplash.com/photo-1432888622747-4eb9a8efeb07?w=1200&h=630&fit=crop&q=80
       [landing page/site/design/conversão] → https://images.unsplash.com/photo-1467232004584-a241de8bcf5d?w=1200&h=630&fit=crop&q=80
       [reunião/cliente/negócio/b2b] → https://images.unsplash.com/photo-1552664730-d307ca884978?w=1200&h=630&fit=crop&q=80
       [leads/cpl/cpa/custo/roi] → https://images.unsplash.com/photo-1504868584819-f8e8b4b6d7e3?w=1200&h=630&fit=crop&q=80
       [instagram/redes sociais/celular/conteúdo] → https://images.unsplash.com/photo-1611162617474-5b21e879e113?w=1200&h=630&fit=crop&q=80
       [pixel/rastreamento/tracking/tag] → https://images.unsplash.com/photo-1543286386-713bdd548da4?w=1200&h=630&fit=crop&q=80)
   - coverImageAlt: string (descrição visual precisa da imagem escolhida, em português)
   - readingTime: string (ex: "8 min")
   - featured: false
   - faq: array de 3-5 objetos {q: string, a: string}
4. Mínimo 1800 palavras no corpo do artigo
5. Estrutura: H2 para seções principais, H3 para subseções quando necessário
6. Primeira frase de cada seção H2 responde diretamente ao subtítulo
7. Inclua pelo menos 4 dados ou números concretos com contexto real
8. FAQ: perguntas honestas que um empreendedor desconfiante faria, respostas com pelo menos 3 frases
9. NÃO use: crucial, pivotal, vibrant, tapestry, delve, showcase, groundbreaking, nestled, boasts
10. NÃO use travessão longo (:). Use vírgula, ponto ou dois-pontos.
11. Links internos: 2 sugestões naturais no texto (formato: [texto âncora](/slug-provavel))
12. Conclusão: termine convidando ao contato via WhatsApp de forma natural, sem soar como anúncio

Retorne o MDX completo agora:`

  const response = await client.messages.create({
    model: 'claude-sonnet-4-6',
    max_tokens: 8192,
    messages: [{ role: 'user', content: prompt }],
  })

  let content = (response.content[0] as { text: string }).text.trim()

  if (!content.startsWith('---')) {
    throw new Error('Resposta inválida: não começa com frontmatter YAML')
  }

  // Fallback: injeta coverImage baseada no tópico se o modelo não incluiu
  if (!content.includes('coverImage:')) {
    const { url, alt } = getCoverImageForTopic(topic)
    content = content.replace(/^(---\n)/, `$1coverImage: "${url}"\ncoverImageAlt: "${alt}"\n`)
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
