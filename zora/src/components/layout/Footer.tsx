import { useLocale, useTranslations } from 'next-intl';
import { categories } from '@/data/categories';
import { Link } from '@/i18n/navigation';
import { Logo } from './Logo';

export function Footer() {
  const t = useTranslations();
  const locale = useLocale();
  const col = 'space-y-2 text-sm';
  const a = 'underline-offset-4 hover:underline';
  return (
    <footer className="mt-24 bg-ink text-paper">
      <div className="container-page grid gap-10 py-14 md:grid-cols-[1.4fr_1fr_1fr_1fr]">
        <div>
          <Logo className="!text-paper [&_svg_path:nth-child(2)]:stroke-[var(--color-paper)]" />
          <p className="mt-4 max-w-xs text-sm text-paper/80">{t('footer.tagline')}</p>
        </div>
        <nav aria-label={t('footer.shop')}>
          <h2 className="font-sans text-sm font-bold tracking-widest uppercase">{t('footer.shop')}</h2>
          <ul className={`mt-4 ${col}`}>
            {categories.map((c) => <li key={c.id}><Link className={a} href={`/c/${c.id}`}>{c.name[locale]}</Link></li>)}
          </ul>
        </nav>
        <nav aria-label={t('footer.help')}>
          <h2 className="font-sans text-sm font-bold tracking-widest uppercase">{t('footer.help')}</h2>
          <ul className={`mt-4 ${col}`}>
            <li><Link className={a} href="/shipping">{t('footer.shipping')}</Link></li>
            <li><Link className={a} href="/returns">{t('footer.returns')}</Link></li>
            <li><Link className={a} href="/faq">{t('footer.faq')}</Link></li>
            <li><Link className={a} href="/contact">{t('footer.contact')}</Link></li>
          </ul>
        </nav>
        <nav aria-label={t('footer.company')}>
          <h2 className="font-sans text-sm font-bold tracking-widest uppercase">{t('footer.company')}</h2>
          <ul className={`mt-4 ${col}`}>
            <li><Link className={a} href="/about">{t('nav.about')}</Link></li>
            <li><Link className={a} href="/how-it-works">{t('nav.howItWorks')}</Link></li>
            <li><Link className={a} href="/terms">{t('footer.terms')}</Link></li>
            <li><Link className={a} href="/privacy">{t('footer.privacy')}</Link></li>
            <li><Link className={a} href="/admin">{t('footer.admin')}</Link></li>
          </ul>
        </nav>
      </div>
      <div className="border-t border-paper/15">
        <div className="container-page flex flex-col gap-1 py-5 text-xs text-paper/70 md:flex-row md:justify-between">
          <p>{t('footer.rights', { year: 2026 })}</p>
          <p>{t('common.demoNotice')}</p>
        </div>
      </div>
    </footer>
  );
}
