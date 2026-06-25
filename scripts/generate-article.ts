import Anthropic from '@anthropic-ai/sdk'
import * as fs from 'fs'
import * as path from 'path'

const client = new Anthropic({ apiKey: process.env.ANTHROPIC_API_KEY })

// Tópicos focados em dores reais de empreendedores, desconfiantes de tráfego pago,
// gestores iniciantes e quem quer vender mais sem depender de indicação
const TOPICS = [
  'Investi em tráfego pago e não tive resultado: o que realmente deu errado',
  'Por que você não consegue vender pelo Instagram mesmo tendo muitos seguidores',
  'Como saber se o seu gestor de tráfego está fazendo um bom trabalho ou te enganando',
  'Quanto tempo leva para o tráfego pago começar a gerar resultado de verdade',
  'A verdade sobre as promessas de resultado garantido no marketing digital',
  'Por que sua campanha funcionou bem no início e parou do nada',
  'Como parar de depender 100% de indicação e ter clientes todo dia',
  'O que nenhum gestor de tráfego te conta antes de você fechar contrato',
  'Você precisa de site ou landing page? A resposta que ninguém dá de forma honesta',
  'Por que o seu concorrente aparece mais no Google mesmo gastando menos',
  'Como definir quanto investir em anúncios sem jogar dinheiro fora',
  'O empreendedor que perdeu R$15 mil em tráfego pago e o que aprendi com isso',
  'Tráfego pago para negócio local: o que funciona e o que é mito',
  'Como interpretar os números da sua campanha sem precisar ser especialista',
  'Por que lead barato nem sempre é bom negócio (e quando ele é um problema)',
  'O erro de comunicação que faz a maioria dos anúncios não converterem',
  'Como uma clínica de estética saiu de 3 para 40 agendamentos por mês com tráfego pago',
  'Gestores de tráfego iniciantes: os erros que eu cometi nos primeiros anos',
  'O que realmente importa medir nas suas campanhas (e o que é número de vaidade)',
  'Por que você está pagando caro por clique e como resolver isso',
  'Meta Ads vs Google Ads: qual usar para o seu tipo de negócio',
  'Como criar um anúncio que para o dedo da pessoa no feed e faz ela querer saber mais',
  'Automação e inteligência artificial nos anúncios: o que realmente funciona hoje',
  'O que é funil de vendas e por que ignorar isso está te custando clientes todos os dias',
  'Como vender serviços de alto valor com tráfego pago sem parecer agressivo',
  'Por que sua landing page recebe visitas mas não converte em clientes',
  'Tráfego pago para prestador de serviços: por onde começar sem perder dinheiro',
  'Como uma imobiliária gerou 200 leads qualificados em 30 dias (e o que aprendi)',
  'O que faço antes de criar qualquer campanha (e por que isso muda tudo)',
  'Como turbinar os resultados de quem já faz tráfego pago mas está estagnado',
]

const SAMUEL_PROFILE = `
SOBRE SAMUEL FELIPE (autor do blog — escreva como se fosse ele):
- Especialista em tráfego pago com mais de 6 anos de experiência prática
- Trabalhou com HDI Brasil, Instituto Embelleze (Grupo SMZTO), Porsche Center BH, Mercedes-Benz,
  Grupo Colina, Valem Administradora de Benefícios, Móveis Bechara, FAS Iluminação,
  Ilimit Proteção Veicular, Factorial Imóveis, Paula Reis Fotografia, Inovando Na Sua Obra
  e dezenas de negócios locais
- Certificações Google: Rede de Pesquisa, Display, Criativos, Métricas, Alta Performance com IA
- Domina: Google Ads, Meta Ads, TikTok Ads, Google Tag Manager, GA4, CRO, funis de vendas
- Segmentos de experiência: e-commerce, concessionárias, clínicas, imobiliárias, serviços locais,
  móveis planejados, iluminação, proteção veicular, educação, benefícios corporativos
- Perfil: analítico, direto, responsável. Traduz assuntos complexos em linguagem simples.
  Toma decisões baseadas em dados mas sem perder a visão humana e comercial.
- Não gosta de fazer por fazer: analisa o negócio completo (oferta, posicionamento, funil, processo comercial)
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

  const prompt = `${SAMUEL_PROFILE}

Escreva um artigo de blog completo em português brasileiro sobre:
"${topic}"

TOM E ESTILO OBRIGATÓRIOS:
- Escreva como Samuel falaria com um amigo empreendedor, não como um manual técnico
- Linguagem simples e acessível: quando usar termos técnicos, explique com analogia ou exemplo prático
- Alto conhecimento com didática simples: o leitor precisa entender PROFUNDAMENTE, não superficialmente
- Primeira pessoa ("eu", "vi", "atendi", "aprendi") — você fala de experiência real
- Seja honesto, direto, sem rodeios e sem bajulação ao leitor
- Use exemplos de clientes reais que você atendeu (sem revelar nomes ou dados sensíveis quando necessário, pode mencionar o setor ou o porte)
- Mostre o lado humano e comercial, não só o técnico
- Tom: confiante sem arrogância. Você sabe o que está falando e isso aparece na precisão, não no jargão.
- Estrutura de parágrafo: varie o ritmo. Parágrafos curtos para pontos fortes. Parágrafos mais longos para explicações. Não use bullets em excesso.

PÚBLICO-ALVO (escreva pensando nessas pessoas):
- Empreendedores que já tentaram tráfego pago e não tiveram resultado
- Donos de negócio que desconfiam de agências e gestores de tráfego
- Quem quer aumentar vendas mas não sabe por onde começar no digital
- Gestores de tráfego iniciantes que querem aprender de verdade
- Quem depende de indicação e quer construir um fluxo previsível de clientes

REGRAS TÉCNICAS OBRIGATÓRIAS:
1. Retorne APENAS o conteúdo MDX completo, começando com --- (frontmatter YAML)
2. Não use bloco de código ao redor do conteúdo
3. O frontmatter YAML deve ter exatamente estes campos:
   - title: (título SEO, 55-65 caracteres, com keyword principal, sem aspas duplas internas)
   - description: (meta description, 145-160 caracteres)
   - date: "${today}"
   - lastModified: "${today}"
   - category: (uma de: Meta Ads | Google Ads | Landing Pages | Estratégia Digital | Analytics)
   - tags: (array de 4-6 strings em minúsculo)
   - readingTime: (ex: "8 min")
   - featured: false
   - faq: (array de 3-5 objetos com "q" e "a" — perguntas reais que o leitor teria)
4. Mínimo 1800 palavras no corpo do artigo
5. Estrutura: H2 para seções principais, H3 para subseções quando necessário
6. Primeira frase de cada seção H2 responde diretamente ao subtítulo (para SEO de featured snippets)
7. Inclua pelo menos 4 dados ou números concretos com contexto (pode ser da sua experiência: "de 12 contas que auditei nesse cenário..." ou do mercado)
8. FAQ: perguntas que um empreendedor desconfiante faria, respostas honestas com pelo menos 3 frases
9. NÃO use: crucial, pivotal, vibrant, tapestry, delve, showcase, groundbreaking, nestled, boasts
10. NÃO use travessão longo (—). Use vírgula, ponto ou dois-pontos.
11. Links internos: 2 sugestões naturais no texto para outros artigos do blog (formato: [âncora](/slug))
12. Conclusão: termine com um parágrafo que convida ao contato via WhatsApp de forma natural, sem soar como anúncio

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
