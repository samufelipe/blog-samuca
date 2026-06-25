import { getAllArticles } from '@/lib/mdx'
import { NextResponse } from 'next/server'

const BASE = 'https://blog.samucads.com.br'

export async function GET() {
  const articles = getAllArticles()

  const items = articles.map((a) => `
    <item>
      <title><![CDATA[${a.title}]]></title>
      <link>${BASE}/${a.slug}</link>
      <guid isPermaLink="true">${BASE}/${a.slug}</guid>
      <description><![CDATA[${a.description}]]></description>
      <content:encoded><![CDATA[${a.content}]]></content:encoded>
      <pubDate>${new Date(a.date).toUTCString()}</pubDate>
      <category><![CDATA[${a.category}]]></category>
      <author>samucafe01@gmail.com (Samuel Felipe)</author>
    </item>`).join('')

  const rss = `<?xml version="1.0" encoding="UTF-8"?>
<rss version="2.0" xmlns:content="http://purl.org/rss/1.0/modules/content/" xmlns:atom="http://www.w3.org/2005/Atom">
  <channel>
    <title>Blog | Samuel Felipe</title>
    <link>${BASE}</link>
    <description>Estratégias de Meta Ads, Google Ads e marketing digital para PMEs brasileiras.</description>
    <language>pt-BR</language>
    <atom:link href="${BASE}/feed.xml" rel="self" type="application/rss+xml"/>
    <lastBuildDate>${new Date().toUTCString()}</lastBuildDate>
    <image>
      <url>${BASE}/samuel-profile.jpg</url>
      <title>Blog Samuel Felipe</title>
      <link>${BASE}</link>
    </image>
    ${items}
  </channel>
</rss>`

  return new NextResponse(rss, {
    headers: { 'Content-Type': 'application/rss+xml; charset=utf-8', 'Cache-Control': 'public, max-age=3600' },
  })
}
