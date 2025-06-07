import React from 'react'
import Link from 'next/link'
import {
  ArrowRight,
  TrendingUp,
  Store,
  ExternalLink,
  Users,
  HelpCircle,
  BookOpen,
  Rocket,
} from 'lucide-react'
import BlockDagBackground from '@/components/MainPage/block-dag-background'
import Image from 'next/image'
import { getPayload } from 'payload'
import configPromise from '@payload-config'
import type { Post } from '@/payload-types'
import { format } from 'date-fns'
import { cs } from 'date-fns/locale'
import { cache } from 'react'

const featureCard = `group flex flex-col h-40 p-5 bg-white/5 backdrop-blur-sm border border-white/10 rounded-lg hover:bg-white/10 transition-all`

const getLatestPosts = cache(async (): Promise<Post[]> => {
  const payload = await getPayload({ config: configPromise })
  const result = await payload.find({
    collection: 'posts',
    where: {
      _status: {
        equals: 'published',
      },
    },
    sort: '-publishedAt',
    limit: 3,
    depth: 2, // We need author data
  })
  return result.docs
})

function calculateReadingTime(content: any): number {
  if (!content?.root?.children) return 1

  const text = content.root.children
    .map((child: any) => child.children?.map((c: any) => c.text).join(' ') || '')
    .join(' ')

  const wordsPerMinute = 200
  const wordCount = text.split(/\s+/).length
  const readingTime = Math.ceil(wordCount / wordsPerMinute)
  return readingTime > 0 ? readingTime : 1
}

export default async function Home() {
  const latestPosts = await getLatestPosts()

  return (
    <div className="flex flex-col min-h-full relative overflow-hidden">
      {/* Animated BlockDAG Background - adjusted opacity */}
      <div className="absolute inset-0 z-0 opacity-25">
        <BlockDagBackground />
      </div>

      {/* Content with relative positioning to appear above the background */}
      <div className="relative z-10">
        {/* Main content with consistent spacing */}
        <main className="container mx-auto px-6 py-12 flex-1">
          <div className="grid grid-cols-1 md:grid-cols-2 gap-8 items-start">
            {/* Left column */}
            <div className="space-y-10">
              {/* Hero section - expanded with more spacing */}
              <div className="space-y-6">
                <h1 className="text-5xl font-bold leading-tight">
                  Kompletní zdroj <br />o <span className="text-teal">Kaspa</span> v češtině
                </h1>
                <p className="text-gray-400 max-w-md text-lg">
                  Průvodce, články, novinky a vše, co potřebujete vědět o této revoluční kryptoměně
                  založené na BlockDAG technologii.
                </p>

                {/* CTA buttons with consistent spacing */}
                <div className="flex flex-wrap gap-4 pt-4">
                  <Link
                    href="/co-je-kaspa"
                    className="inline-flex items-center px-5 py-3 rounded-md bg-white text-black font-medium hover:bg-white/90 transition-colors"
                  >
                    <span>Co je Kaspa?</span>
                    <ArrowRight className="ml-2 w-4 h-4" />
                  </Link>
                </div>
              </div>

              {/* Feature cards grid with consistent spacing and equal heights */}
              <div className="grid grid-cols-2 sm:grid-cols-3 gap-3 text-center">
                {/* Card 1 */}
                <Link href="/slovnik" className={featureCard}>
                  <BookOpen className="w-5 h-5 text-teal mb-3" />
                  <h3 className="font-medium text-sm">Slovník Pojmů</h3>
                  <p className="text-xs text-gray-400 mt-2">Vysvětlení krypto terminologie</p>
                </Link>

                {/* Card 2 */}
                <Link href="#" className={featureCard}>
                  <Rocket className="w-5 h-5 text-teal mb-3" />
                  <h3 className="font-medium text-sm">Jak začít</h3>
                  <p className="text-xs text-gray-400 mt-2">První kroky s Kaspa</p>
                </Link>

                {/* Card 3 */}
                <Link href="/obchodnici" className={featureCard}>
                  <Store className="w-5 h-5 text-teal mb-3" />
                  <h3 className="font-medium text-sm">Kde utratit</h3>
                  <p className="text-xs text-gray-400 mt-2">Obchodníci přijímající Kaspa</p>
                </Link>

                {/* Card 4 */}
                <Link href="#" className={featureCard}>
                  <Users className="w-5 h-5 text-teal mb-3" />
                  <h3 className="font-medium text-sm">Komunita</h3>
                  <p className="text-xs text-gray-400 mt-2">Připojte se k ostatním</p>
                </Link>

                {/* Card 5 */}
                <Link href="/faq" className={featureCard}>
                  <HelpCircle className="w-5 h-5 text-teal mb-3" />
                  <h3 className="font-medium text-sm">FAQ</h3>
                  <p className="text-xs text-gray-400 mt-2">Často kladené dotazy</p>
                </Link>

                {/* Discord card */}
                <div className={featureCard}>
                  <Users className="w-5 h-5 text-teal mb-3" />
                  <h3 className="font-medium text-sm">Discord Chat</h3>
                  <p className="text-xs text-gray-400 mt-2 mb-3">Připoj se k živé diskuzi</p>
                  <Link
                    href="#"
                    className="mt-auto flex items-center justify-center gap-2 text-xs text-white bg-white/10 hover:bg-white/20 transition-colors py-2 px-3 rounded-md"
                  >
                    <svg
                      width="16"
                      height="16"
                      viewBox="0 0 71 55"
                      fill="none"
                      xmlns="http://www.w3.org/2000/svg"
                    >
                      <path
                        d="M60.1045 4.8978C55.5792 2.8214 50.7265 1.2916 45.6527 0.41542C45.5603 0.39851 45.468 0.440769 45.4204 0.525289C44.7963 1.6353 44.105 3.0834 43.6209 4.2216C38.1637 3.4046 32.7345 3.4046 27.3892 4.2216C26.905 3.0581 26.1886 1.6353 25.5617 0.525289C25.5141 0.443589 25.4218 0.40133 25.3294 0.41542C20.2584 1.2888 15.4057 2.8186 10.8776 4.8978C10.8384 4.9147 10.8048 4.9429 10.7825 4.9795C1.57795 18.7309 -0.943561 32.1443 0.293408 45.3914C0.299005 45.4562 0.335386 45.5182 0.385761 45.5576C6.45866 50.0174 12.3413 52.7249 18.1147 54.5195C18.2071 54.5477 18.305 54.5139 18.3638 54.4378C19.7295 52.5728 20.9469 50.6063 21.9907 48.5383C22.0523 48.4172 21.9935 48.2735 21.8676 48.2256C19.9366 47.4931 18.0979 46.6 16.3292 45.5858C16.1893 45.5041 16.1781 45.304 16.3068 45.2082C16.679 44.9293 17.0513 44.6391 17.4067 44.3461C17.471 44.2926 17.5606 44.2813 17.6362 44.3151C29.2558 49.6202 41.8354 49.6202 53.3179 44.3151C53.3935 44.2785 53.4831 44.2898 53.5502 44.3433C53.9057 44.6363 54.2779 44.9293 54.6529 45.2082C54.7816 45.304 54.7732 45.5041 54.6333 45.5858C52.8646 46.6197 51.0259 47.4931 49.0921 48.2228C48.9662 48.2707 48.9102 48.4172 48.9718 48.5383C50.038 50.6034 51.2554 52.5699 52.5959 54.435C52.6519 54.5139 52.7526 54.5477 52.845 54.5195C58.6464 52.7249 64.529 50.0174 70.6019 45.5576C70.6551 45.5182 70.6887 45.459 70.6943 45.3942C72.1747 30.0791 68.2147 16.7757 60.1968 4.9823C60.1772 4.9429 60.1437 4.9147 60.1045 4.8978ZM23.7259 37.3253C20.2276 37.3253 17.3451 34.1136 17.3451 30.1693C17.3451 26.225 20.1717 23.0133 23.7259 23.0133C27.308 23.0133 30.1626 26.2532 30.1066 30.1693C30.1066 34.1136 27.28 37.3253 23.7259 37.3253ZM47.3178 37.3253C43.8196 37.3253 40.9371 34.1136 40.9371 30.1693C40.9371 26.225 43.7636 23.0133 47.3178 23.0133C50.9 23.0133 53.7545 26.2532 53.6986 30.1693C53.6986 34.1136 50.9 37.3253 47.3178 37.3253Z"
                        fill="#ffffff"
                      />
                    </svg>
                    <span>Připojit se</span>
                  </Link>
                </div>
              </div>
            </div>

            {/* Right column */}
            <div className="flex flex-col justify-between h-full">
              {/* Articles card */}
              <div className="bg-white/5 backdrop-blur-sm rounded-xl p-6 border border-white/10 flex-grow mb-4 flex flex-col">
                <div className="flex justify-between items-center mb-6">
                  <h2 className="font-medium text-xl">Nejnovější články</h2>
                  <Link
                    href="/clanky"
                    className="text-teal text-sm hover:underline flex items-center"
                  >
                    <span>Všechny články</span>
                    <ArrowRight className="w-3 h-3 ml-1" />
                  </Link>
                </div>

                <div className="flex flex-col flex-grow justify-between">
                  {latestPosts.map((post, i) => (
                    <React.Fragment key={post.id}>
                      <Link href={`/clanky/${post.slug}`} className="block group py-2">
                        <h3 className="font-medium text-base group-hover:text-teal transition-colors">
                          {post.title}
                        </h3>
                        <p className="text-sm text-gray-400 mt-2 line-clamp-2">
                          {post.meta?.description || 'Přečtěte si více...'}
                        </p>
                        <div className="flex items-center mt-3 text-xs text-gray-500">
                          {post.publishedAt && (
                            <span>
                              {format(new Date(post.publishedAt), 'd. M. yyyy', { locale: cs })}
                            </span>
                          )}
                          {post.populatedAuthors && post.populatedAuthors.length > 0 && (
                            <>
                              <span className="mx-2">•</span>
                              <span>
                                {post.populatedAuthors
                                  .map((author) => author.name || '')
                                  .join(', ')}
                              </span>
                            </>
                          )}
                          <span className="mx-2">•</span>
                          <span>{calculateReadingTime(post.content)} min čtení</span>
                        </div>
                      </Link>
                      {i < latestPosts.length - 1 && <div className="h-px bg-white/10 my-2" />}
                    </React.Fragment>
                  ))}
                </div>
              </div>

              {/* Price card */}
              <div className="bg-white/5 backdrop-blur-sm rounded-xl p-4 border border-white/10 h-40">
                <div className="flex justify-between items-center mb-3">
                  <h2 className="font-medium text-base">Aktuální cena</h2>
                  <span className="text-xs text-gray-400">Aktualizováno před 5 min</span>
                </div>

                <div className="flex items-center gap-3 mb-3">
                  <div className="size-5 rounded-full bg-white flex items-center justify-center">
                    <Image
                      src="/logo.svg"
                      alt="Kaspacoin.cz Logo"
                      width={20}
                      height={20}
                      className="w-5 h-5"
                      priority
                    />
                  </div>
                  <div className="flex items-center gap-2">
                    <div className="text-lg font-bold">$0.1247</div>
                    <div className="flex items-center text-teal text-xs px-1.5 py-0.5 bg-teal/10 rounded-full">
                      <TrendingUp className="w-2.5 h-2.5 mr-1" />
                      <span>+5.8%</span>
                    </div>
                  </div>
                </div>

                <div className="grid grid-cols-4 gap-2 text-xs">
                  <div>
                    <div className="text-gray-400 text-xs mb-0.5">Market Cap</div>
                    <div className="font-medium text-xs">$1.45B</div>
                  </div>
                  <div>
                    <div className="text-gray-400 text-xs mb-0.5">Volume</div>
                    <div className="font-medium text-xs">$87.2M</div>
                  </div>
                  <div>
                    <div className="text-gray-400 text-xs mb-0.5">Rank</div>
                    <div className="font-medium text-xs">#42</div>
                  </div>
                  <div>
                    <div className="text-gray-400 text-xs mb-0.5">Hashrate</div>
                    <div className="font-medium text-xs">1.2 EH/s</div>
                  </div>
                </div>
              </div>
            </div>
          </div>
        </main>
      </div>
    </div>
  )
}
