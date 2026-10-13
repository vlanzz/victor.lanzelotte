import type { Metadata } from 'next';
import { notFound } from 'next/navigation';
import { getTranslations } from 'next-intl/server';
import { ContactForm } from '@/components/domain/pages/ContactForm';
import { Breadcrumbs } from '@/components/ui/Breadcrumbs';
import { ButtonLink } from '@/components/ui/Button';
import { resolveLocale } from '@/i18n/params';
import { routing } from '@/i18n/routing';

/** Páginas institucionais: slug da URL → chave em messages/pages.json */
const PAGES = { about: 'about', 'how-it-works': 'how', shipping: 'shipping', returns: 'returns', faq: 'faq', contact: 'contact', terms: 'terms', privacy: 'privacy' } as const;
type Slug = keyof typeof PAGES;
type Section = { h: string; p: string };

export function generateStaticParams() {
  return routing.locales.flatMap((locale) => (Object.keys(PAGES) as Slug[]).map((page) => ({ locale, page })));
}

type Props = { params: Promise<{ locale: string; page: string }> };

export async function generateMetadata({ params }: Props): Promise<Metadata> {
  const locale = await resolveLocale(params);
  const { page } = await params;
  if (!(page in PAGES)) return {};
  const t = await getTranslations({ locale, namespace: 'pages' });
  return { title: t(`${PAGES[page as Slug]}.title`) };
}

export default async function InfoPage({ params }: Props) {
  const locale = await resolveLocale(params);
  const { page } = await params;
  if (!(page in PAGES)) notFound();
  const key = PAGES[page as Slug];
  const t = await getTranslations({ locale, namespace: 'pages' });
  const tn = await getTranslations({ locale, namespace: 'nav' });
  const sections = (key !== 'how' && key !== 'faq' && key !== 'contact' ? (t.raw(`${key}.sections`) as Section[]) : []);
  const steps = key === 'how' ? (t.raw('how.steps') as Section[]) : [];
  const faq = key === 'faq' ? (t.raw('faq.items') as { q: string; a: string }[]) : [];

  return (
    <div className="container-page py-8 md:py-12">
      <Breadcrumbs label={tn('breadcrumbs')} items={[{ label: tn('home'), href: '/' }, { label: t(`${key}.title`) }]} />
      <div className="mx-auto mt-8 max-w-3xl">
        <h1 className="text-4xl md:text-6xl">{t(`${key}.title`)}</h1>
        <p className="mt-4 text-xl text-ink-soft">{t(`${key}.intro`)}</p>

        {sections.length > 0 && (
          <div className="mt-10 space-y-8">
            {sections.map((s) => <section key={s.h}><h2 className="text-2xl">{s.h}</h2><p className="mt-2 text-lg leading-relaxed">{s.p}</p></section>)}
          </div>
        )}

        {steps.length > 0 && (
          <>
            <ol className="mt-10 grid gap-4 sm:grid-cols-2">
              {steps.map((s, i) => (
                <li key={s.h} className="rounded-xl bg-paper-2 p-6">
                  <span aria-hidden className="mb-3 flex size-10 items-center justify-center rounded-full bg-honey font-display text-lg font-bold">{i + 1}</span>
                  <h2 className="font-sans text-lg font-bold">{s.h.replace(/^\d+\.\s*/, '')}</h2>
                  <p className="mt-2 text-ink-soft">{s.p}</p>
                </li>
              ))}
            </ol>
            <p className="mt-6 rounded-lg bg-honey-soft p-4 text-sm font-semibold">{t('how.note')}</p>
            <ButtonLink href="/search" size="lg" className="mt-8">{tn('allProducts')}</ButtonLink>
          </>
        )}

        {faq.length > 0 && (
          <div className="mt-10 divide-y divide-line border-y border-line">
            {faq.map((f) => (
              <details key={f.q} className="group py-5">
                <summary className="flex cursor-pointer list-none items-center justify-between gap-4 text-lg font-bold">{f.q}<span aria-hidden className="text-2xl transition group-open:rotate-45">+</span></summary>
                <p className="mt-3 text-ink-soft">{f.a}</p>
              </details>
            ))}
          </div>
        )}

        {key === 'contact' && <div className="mt-10"><ContactForm /></div>}
      </div>
    </div>
  );
}
