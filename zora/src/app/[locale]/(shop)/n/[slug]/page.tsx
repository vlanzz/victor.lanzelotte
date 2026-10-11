import { notFound } from 'next/navigation';
import { getTranslations } from 'next-intl/server';
import { Suspense } from 'react';
import { BrowseSkeleton } from '@/components/domain/catalog/BrowseSkeleton';
import { CatalogBrowser } from '@/components/domain/catalog/CatalogBrowser';
import { Breadcrumbs } from '@/components/ui/Breadcrumbs';
import { arts } from '@/data/arts';
import { niches } from '@/data/niches';
import { resolveLocale } from '@/i18n/params';
import { routing } from '@/i18n/routing';
import { Link } from '@/i18n/navigation';

export function generateStaticParams() {
  return routing.locales.flatMap((locale) => niches.map((n) => ({ locale, slug: n.slug })));
}

export default async function NichePage({ params }: { params: Promise<{ locale: string; slug: string }> }) {
  const locale = await resolveLocale(params);
  const { slug } = await params;
  const niche = niches.find((n) => n.slug === slug);
  if (!niche) notFound();
  const t = await getTranslations({ locale });
  const nicheArts = arts.filter((a) => a.nicheIds.includes(niche.id) && a.status === 'active').slice(0, 3);
  return (
    <>
      <section style={{ background: niche.color, color: niche.onColor }} className="overflow-hidden">
        <div className="container-page grid items-center gap-8 py-10 md:grid-cols-[1.2fr_1fr] md:py-14">
          <div>
            <Breadcrumbs label={t('nav.breadcrumbs')} items={[{ label: t('nav.home'), href: '/' }, { label: t('browse.collection') }, { label: niche.name[locale] }]} />
            <h1 className="mt-4 text-4xl md:text-6xl">{niche.name[locale]}</h1>
            <p className="mt-3 max-w-lg text-lg">{niche.blurb[locale]}</p>
          </div>
          <div aria-hidden className="relative hidden h-56 md:block">
            {nicheArts.map((a, i) => (
              // eslint-disable-next-line @next/next/no-img-element
              <img key={a.id} src={a.file} alt="" loading="lazy" className="absolute h-44 w-44 rounded-lg object-cover shadow-lift" style={{ right: `${i * 28}%`, top: `${i % 2 ? 24 : 0}px`, transform: `rotate(${(i - 1) * 7}deg)` }} />
            ))}
          </div>
        </div>
      </section>
      <div className="container-page py-8">
        <Suspense fallback={<BrowseSkeleton />}><CatalogBrowser fixed={{ nicheId: niche.id }} /></Suspense>
        <section className="mt-20" aria-labelledby="other-niches">
          <h2 id="other-niches" className="mb-5 text-2xl">{t('browse.otherCollections')}</h2>
          <ul className="flex flex-wrap gap-2">
            {niches.filter((n) => n.id !== niche.id).map((n) => (
              <li key={n.id}><Link href={`/n/${n.slug}`} style={{ background: n.color }} className="inline-flex min-h-10 items-center rounded-full px-4 text-sm font-semibold transition hover:-translate-y-0.5 hover:shadow-soft">{n.name[locale]}</Link></li>
            ))}
          </ul>
        </section>
      </div>
    </>
  );
}
