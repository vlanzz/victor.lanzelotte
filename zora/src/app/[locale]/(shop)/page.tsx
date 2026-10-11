import { Leaf, PackageCheck, Palette, Truck } from 'lucide-react';
import { getTranslations } from 'next-intl/server';
import { HeroCollage } from '@/components/domain/home/HeroCollage';
import { Newsletter } from '@/components/domain/home/Newsletter';
import { ProductShelf } from '@/components/domain/home/ProductShelf';
import { ButtonLink } from '@/components/ui/Button';
import { arts } from '@/data/arts';
import { categories } from '@/data/categories';
import { niches } from '@/data/niches';
import { resolveLocale } from '@/i18n/params';
import { Link } from '@/i18n/navigation';

export default async function HomePage({ params }: { params: Promise<{ locale: string }> }) {
  const locale = await resolveLocale(params);
  const t = await getTranslations({ locale, namespace: 'home' });
  const trust = [
    { key: 'demand', icon: Leaf }, { key: 'ship', icon: Truck }, { key: 'quality', icon: PackageCheck }, { key: 'art', icon: Palette },
  ] as const;

  return (
    <>
      <section className="relative overflow-hidden">
        <div className="container-page grid items-center gap-10 py-10 md:grid-cols-2 md:py-20">
          <div className="rise-in">
            <p className="mb-4 inline-block rounded-full bg-honey px-4 py-1.5 text-sm font-bold">{t('eyebrow')}</p>
            <h1 className="text-5xl leading-[1.04] md:text-7xl">{t('heroTitle')}</h1>
            <p className="mt-5 max-w-md text-lg text-ink-soft">{t('heroText')}</p>
            <div className="mt-8 flex flex-wrap gap-3">
              <ButtonLink href="/search" size="lg">{t('ctaExplore')}</ButtonLink>
              <ButtonLink href="/how-it-works" size="lg" variant="secondary">{t('ctaHow')}</ButtonLink>
            </div>
          </div>
          <HeroCollage />
        </div>
      </section>

      <section className="container-page mt-8 md:mt-16" aria-labelledby="collections">
        <h2 id="collections" className="text-3xl md:text-4xl">{t('collectionsTitle')}</h2>
        <p className="mt-2 text-ink-soft">{t('collectionsText')}</p>
        <ul className="mt-8 grid grid-cols-2 gap-3 md:grid-cols-5 md:gap-4">
          {niches.map((n, i) => {
            const art = arts.find((a) => a.nicheIds[0] === n.id);
            return (
              <li key={n.id} className={i === 0 || i === 5 ? 'md:row-span-1' : ''}>
                <Link href={`/n/${n.slug}`} style={{ background: n.color }} className="group relative flex aspect-[4/5] flex-col justify-end overflow-hidden rounded-lg p-4 transition duration-300 hover:-translate-y-1 hover:shadow-lift">
                  {art && (
                    // eslint-disable-next-line @next/next/no-img-element
                    <img src={art.file} alt="" loading="lazy" className="absolute inset-x-3 top-3 h-[62%] w-[calc(100%-1.5rem)] rounded-md object-cover transition duration-500 group-hover:scale-105" />
                  )}
                  <span className="relative font-display text-xl leading-tight font-semibold">{n.name[locale]}</span>
                </Link>
              </li>
            );
          })}
        </ul>
      </section>

      <section className="container-page mt-20" aria-labelledby="categories">
        <h2 id="categories" className="text-3xl md:text-4xl">{t('categoriesTitle')}</h2>
        <ul className="mt-6 flex flex-wrap gap-3">
          {categories.map((c) => (
            <li key={c.id}>
              <Link href={`/c/${c.id}`} style={{ background: c.color }} className="inline-flex min-h-12 items-center rounded-full px-6 text-lg font-semibold transition hover:-translate-y-0.5 hover:shadow-soft">{c.name[locale]}</Link>
            </li>
          ))}
        </ul>
      </section>

      <section className="container-page mt-20" aria-labelledby="featured">
        <div className="mb-8 flex items-end justify-between gap-4">
          <div><h2 id="featured" className="text-3xl md:text-4xl">{t('featuredTitle')}</h2><p className="mt-2 text-ink-soft">{t('featuredText')}</p></div>
          <Link href="/search" className="shrink-0 font-semibold text-sun-dark underline underline-offset-4">{t('seeAll')}</Link>
        </div>
        <ProductShelf kind="featured" />
      </section>

      <section className="mt-20 bg-paper-2 py-16" aria-labelledby="trust">
        <div className="container-page">
          <h2 id="trust" className="max-w-xl text-3xl md:text-4xl">{t('trustTitle')}</h2>
          <ul className="mt-10 grid gap-8 sm:grid-cols-2 lg:grid-cols-4">
            {trust.map(({ key, icon: Icon }) => (
              <li key={key}>
                <span className="mb-4 flex size-12 items-center justify-center rounded-full bg-honey"><Icon aria-hidden size={22} /></span>
                <h3 className="font-sans text-lg font-bold">{t(`trust.${key}.title`)}</h3>
                <p className="mt-1 text-ink-soft">{t(`trust.${key}.text`)}</p>
              </li>
            ))}
          </ul>
        </div>
      </section>

      <section className="container-page mt-20" aria-labelledby="new">
        <div className="mb-8 flex items-end justify-between gap-4">
          <div><h2 id="new" className="text-3xl md:text-4xl">{t('newTitle')}</h2><p className="mt-2 text-ink-soft">{t('newText')}</p></div>
          <Link href="/search?sort=newest" className="shrink-0 font-semibold text-sun-dark underline underline-offset-4">{t('seeAll')}</Link>
        </div>
        <ProductShelf kind="new" />
      </section>

      <div className="mt-20"><Newsletter /></div>
    </>
  );
}
