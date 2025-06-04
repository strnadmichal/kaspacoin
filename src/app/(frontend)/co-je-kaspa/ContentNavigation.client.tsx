'use client'

import React, { useState, useEffect, useRef } from 'react';

// Typ pro navigační blok, odvozený z ChapterBlockData
export interface NavBlock {
  id: string; // Unikátní ID bloku
  title: string;
  slug: string; // Pro HTML id a odkazy
  level: 'h2' | 'h3' | 'h4' | 'h5'; // Pro styling/odsazení v navigaci
  subSections?: NavBlock[]; // Rekurzivní vnořené sekce
}

interface ContentNavigationProps {
  blocks: NavBlock[]; // Komponenta nyní očekává pole bloků
}

// Pomocná funkce pro "zploštění" hierarchie bloků pro IntersectionObserver
const flattenBlocksForObserver = (blocks: NavBlock[]): Omit<NavBlock, 'subSections' | 'level'>[] => {
  const allSections: Omit<NavBlock, 'subSections' | 'level'>[] = [];
  const stack: NavBlock[] = [...blocks];
  while (stack.length > 0) {
    const block = stack.pop();
    if (block) {
      allSections.push({ id: block.id, title: block.title, slug: block.slug });
      if (block.subSections) {
        for (let i = block.subSections.length - 1; i >= 0; i--) {
          const subSection = block.subSections[i];
          if (subSection) stack.push(subSection);
        }
      }
    }
  }
  return allSections;
};

// Rekurzivní komponenta pro vykreslení jedné navigační položky a jejích podpoložek
const RecursiveNavItem: React.FC<{
  block: NavBlock;
  activeTopicSlug: string | null;
  onLinkClick: (slug: string, event: React.MouseEvent<HTMLAnchorElement>) => void;
}> = ({ block, activeTopicSlug, onLinkClick }) => {
  // Určení odsazení na základě úrovně nadpisu
  let paddingLeft = 'pl-3'; // Výchozí pro h2
  if (block.level === 'h3') paddingLeft = 'pl-6';
  else if (block.level === 'h4') paddingLeft = 'pl-9';
  else if (block.level === 'h5') paddingLeft = 'pl-12';

  return (
    <li>
      <a
        href={`#${block.slug}`}
        onClick={(e) => onLinkClick(block.slug, e)}
        className={`block py-1.5 pr-3 ${paddingLeft} rounded-md text-sm transition-colors duration-150 ease-in-out 
                    ${activeTopicSlug === block.slug
                      ? 'bg-teal-600 text-white font-medium'
                      : 'text-gray-300 hover:bg-gray-700 hover:text-teal-300'}`}
      >
        {block.title}
      </a>
      {block.subSections && block.subSections.length > 0 && (
        <ul className="space-y-1 mt-1">
          {block.subSections.map(subBlock => (
            subBlock && <RecursiveNavItem 
              key={subBlock.id} 
              block={subBlock} 
              activeTopicSlug={activeTopicSlug} 
              onLinkClick={onLinkClick} 
            />
          ))}
        </ul>
      )}
    </li>
  );
};

export const ContentNavigation: React.FC<ContentNavigationProps> = ({ blocks }) => {
  const [activeTopicSlug, setActiveTopicSlug] = useState<string | null>(null);
  const observerRef = useRef<IntersectionObserver | null>(null);

  useEffect(() => {
    if (!blocks || blocks.length === 0) return;

    const allObservableSections = flattenBlocksForObserver(blocks);

    const callback: IntersectionObserverCallback = (entries) => {
      const intersectingEntries = entries.filter(entry => entry.isIntersecting);
      if (intersectingEntries.length > 0) {
        intersectingEntries.sort((a, b) => {
          if (a.intersectionRatio !== b.intersectionRatio) {
            return b.intersectionRatio - a.intersectionRatio;
          }
          return (a.target.getBoundingClientRect().top) - (b.target.getBoundingClientRect().top);
        });
        if (intersectingEntries[0] && intersectingEntries[0].target) {
            setActiveTopicSlug(intersectingEntries[0].target.id);
        }
      }
    };

    observerRef.current = new IntersectionObserver(callback, {
      rootMargin: '-20% 0px -65% 0px',
      threshold: [0, 0.1, 0.25, 0.5, 0.75, 1.0],
    });

    allObservableSections.forEach(section => {
      const element = document.getElementById(section.slug);
      if (element) {
        observerRef.current?.observe(element);
      }
    });

    return () => {
      allObservableSections.forEach(section => {
        const element = document.getElementById(section.slug);
        if (element && observerRef.current) {
            observerRef.current.unobserve(element);
        }
      });
      if (observerRef.current) {
        observerRef.current.disconnect();
      }
    };
  }, [blocks]); // Závislost na blocích

  const handleLinkClick = (slug: string, event: React.MouseEvent<HTMLAnchorElement>) => {
    event.preventDefault();
    const element = document.getElementById(slug);
    if (element) {
      element.scrollIntoView({
        behavior: 'smooth',
        block: 'start'
      });
    }
  };

  if (!blocks || blocks.length === 0) {
    return null;
  }

  return (
    <aside className="w-full lg:w-1/4 lg:sticky lg:top-24 self-start p-6 bg-gray-800 border border-gray-700 rounded-lg shadow-md max-h-[calc(100vh-7rem)] overflow-y-auto">
      <h2 className="text-xl font-semibold mb-4 text-teal-400">Obsah stránky</h2>
      <nav>
        <ul className="space-y-1">
          {blocks.map((block) => (
            block && <RecursiveNavItem 
              key={block.id} 
              block={block} 
              activeTopicSlug={activeTopicSlug} 
              onLinkClick={handleLinkClick} 
            />
          ))}
        </ul>
      </nav>
    </aside>
  );
}; 