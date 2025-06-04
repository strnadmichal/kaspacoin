import React from 'react';
import { ContentNavigation } from './ContentNavigation.client';

// --- NOVÁ STRUKTURA PRO BLOKY ---
export interface ChapterBlockData {
  id: string; // Unikátní ID bloku (Payload CMS ho přidává automaticky)
  blockType: 'chapter'; // Typ bloku, pokud bychom jich měli více
  title: string;
  slug: string; // Pro HTML id atribut a navigační odkazy
  level: 'h2' | 'h3' | 'h4' | 'h5'; // Úroveň nadpisu
  content?: string; // HTML obsah z RichText editoru
  subSections?: ChapterBlockData[]; // Rekurzivní pole pro vnořené sekce (stejného typu)
}

// Typ pro celý layout stránky, může obsahovat různé typy bloků
// Prozatím budeme mít jen ChapterBlockData
export type PageLayoutBlock = ChapterBlockData; // V budoucnu: ChapterBlockData | OtherBlockType | ...

// Nová ukázková data založená na blocích
const samplePageLayout: PageLayoutBlock[] = [
  {
    id: 'block-1',
    blockType: 'chapter',
    title: 'Úvod do Kaspy',
    slug: 'uvod-do-kaspy',
    level: 'h2',
    content: '<p>Kaspa je revoluční kryptoměna, která využívá technologii BlockDAG. Tento úvod vás provede základními koncepty.</p>',
  },
  {
    id: 'block-2',
    blockType: 'chapter',
    title: 'Technologie za Kaspou',
    slug: 'technologie-za-kaspou',
    level: 'h2',
    content: '<p>Pojďme se podrobněji podívat na klíčové technologické inovace.</p>',
    subSections: [
      {
        id: 'block-2-1',
        blockType: 'chapter',
        title: 'BlockDAG vysvětlen',
        slug: 'blockdag-vysvetlen',
        level: 'h3',
        content: '<p>Na rozdíl od lineárního blockchainu umožňuje BlockDAG paralelní bloky.</p>',
        subSections: [
          {
            id: 'block-2-1-1',
            blockType: 'chapter',
            title: 'Výhody Paralelismu',
            slug: 'vyhody-paralelismu',
            level: 'h4',
            content: '<p>Vyšší propustnost a rychlejší potvrzení.</p>'
          }
        ]
      },
      {
        id: 'block-2-2',
        blockType: 'chapter',
        title: 'GhostDAG Protokol',
        slug: 'ghostdag-protokol',
        level: 'h3',
        content: '<p>Konsenzuální mechanismus, který zajišťuje bezpečnost a uspořádání v DAGu.</p>'
      }
    ]
  },
  {
    id: 'block-3',
    blockType: 'chapter',
    title: 'Hlavní výhody Kaspy',
    slug: 'hlavni-vyhody',
    level: 'h2',
    content: '<p>Rychlost, škálovatelnost, nízké poplatky a decentralizace.</p>'
  },
];

// Komponenta pro renderování HTML obsahu (zůstává stejná)
const RichTextRenderer: React.FC<{ content: string }> = ({ content }) => {
  return <div dangerouslySetInnerHTML={{ __html: content }} className="prose prose-invert max-w-none text-gray-300 prose-headings:text-white prose-a:text-teal hover:prose-a:text-teal-400 prose-strong:text-white" />;
};

// Rekurzivní komponenta pro vykreslení jednoho ChapterBlocku
const RenderChapterBlock: React.FC<{ block: ChapterBlockData }> = ({ block }) => {
  const HeadingTag = block.level; // 'h2', 'h3', atd. - přímo použitelné jako JSX tag

  // Styly pro nadpisy na základě úrovně - můžete rozšířit
  let headingClassName = "font-bold mb-4 text-white";
  if (HeadingTag === 'h2') headingClassName += " text-4xl md:text-5xl";
  else if (HeadingTag === 'h3') headingClassName += " text-3xl md:text-4xl mt-8 border-t border-gray-700 pt-8";
  else if (HeadingTag === 'h4') headingClassName += " text-2xl md:text-3xl mt-6 border-t border-gray-600 pt-6";
  else if (HeadingTag === 'h5') headingClassName += " text-xl md:text-2xl mt-6 border-t border-gray-500 pt-5";
  
  return (
    <section id={block.slug} className="scroll-mt-24"> {/* scroll-mt-24 pro offset kvůli fixní hlavičce */}
      <HeadingTag className={headingClassName}>
        {block.title}
      </HeadingTag>
      {block.content && <RichTextRenderer content={block.content} />}
      {/* Rekurzivní renderování vnořených sekcí */}
      {block.subSections && block.subSections.length > 0 && (
        <div className={`ml-4 md:ml-6 ${HeadingTag === 'h2' ? 'space-y-8' : 'space-y-6'}`}> 
          {block.subSections.map(subBlock => (
            <RenderChapterBlock key={subBlock.id} block={subBlock} />
          ))}
        </div>
      )}
    </section>
  );
};

// Hlavní komponenta stránky
export default async function CoJeKaspaPage() {
  // Zde by v budoucnu bylo načítání dat z Payload CMS
  // const pageDataFromCMS = await fetchFromCMS('co-je-kaspa'); // Načte stránku z kolekce Pages
  // const layoutBlocks = pageDataFromCMS.layout; // Předpokládáme, že stránka má pole 'layout' s bloky
  const layoutBlocks: PageLayoutBlock[] = samplePageLayout; // Použití ukázkových dat

  // Příprava dat pro ContentNavigation - zjednodušená struktura
  const navBlocks = layoutBlocks.map(block => {
    // Tato funkce by měla být rekurzivní, aby zahrnula subSections
    // Prozatím jen nejvyšší úroveň pro jednoduchost, bude upraveno v ContentNavigation
    return {
      id: block.id,
      title: block.title,
      slug: block.slug,
      level: block.level, // Předáme úroveň pro možné odsazení v navigaci
      subSections: block.subSections // Předáme pro rekurzivní stavbu navigace
    };
  });

  return (
    <div className="flex flex-col min-h-full bg-gray-900 text-white">
      <div className="relative z-10">
        <main className="container mx-auto px-4 sm:px-6 lg:px-8 py-12 flex-1">
          <div className="flex flex-col lg:flex-row gap-8 lg:gap-12">
            {/* Navigace bude potřebovat upravená data */}
            <ContentNavigation blocks={navBlocks} />

            {/* Hlavní obsah renderovaný z bloků */}
            <article className="w-full lg:w-3/4 space-y-12">
              {layoutBlocks && layoutBlocks.length > 0 ? (
                layoutBlocks.map((block) => (
                  // Předpokládáme, že všechny bloky nejvyšší úrovně jsou ChapterBlockData
                  <RenderChapterBlock key={block.id} block={block as ChapterBlockData} />
                ))
              ) : (
                <section>
                  {/* Titulek stránky, pokud nejsou bloky - nebo by H1 měl být fixní součástí layoutu */}
                  <h1 className="text-4xl md:text-5xl font-bold mb-6 text-white">Co je Kaspa?</h1>
                  <p className="text-lg text-gray-400 mb-4">
                    Obsah se připravuje. Brzy zde najdete detailní informace o Kaspa.
                  </p>
                </section>
              )}
            </article>
          </div>
        </main>
      </div>
    </div>
  );
}

// Funkce pro načítání dat z CMS by vypadala zhruba takto:
// async function fetchFromCMS(pageSlug: string) {
//   const response = await fetch(`${process.env.PAYLOAD_PUBLIC_SERVER_URL}/api/pages?where[slug][equals]=${pageSlug}&depth=5`); // depth=5 pro hluboké vnoření bloků
//   if (!response.ok) throw new Error('Failed to fetch page data from CMS');
//   const data = await response.json();
//   if (data.docs && data.docs.length > 0) {
//     return data.docs[0]; // Vrátí celý objekt stránky, včetně pole 'layout'
//   } else {
//     throw new Error(`Page with slug "${pageSlug}" not found.`);
//   }
// } 