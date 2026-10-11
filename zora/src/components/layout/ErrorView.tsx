'use client';
import { SearchX, TriangleAlert } from 'lucide-react';
import { useTranslations } from 'next-intl';
import { ButtonLink, Button } from '../ui/Button';
import { EmptyState } from '../ui/EmptyState';

export function NotFoundView() {
  const t = useTranslations('errors');
  return (
    <div className="container-page py-16">
      <EmptyState icon={<SearchX aria-hidden size={30} />} title={t('notFoundTitle')} text={t('notFoundText')} action={<ButtonLink href="/">{t('goHome')}</ButtonLink>} />
    </div>
  );
}

export function ErrorView({ reset }: { reset?: () => void }) {
  const t = useTranslations();
  return (
    <div className="container-page py-16">
      <EmptyState
        tone="error"
        icon={<TriangleAlert aria-hidden size={30} />}
        title={t('errors.genericTitle')}
        text={t('errors.genericText')}
        action={
          <div className="flex gap-3">
            {reset && <Button onClick={reset}>{t('common.retry')}</Button>}
            <ButtonLink href="/" variant="secondary">{t('errors.goHome')}</ButtonLink>
          </div>
        }
      />
    </div>
  );
}
