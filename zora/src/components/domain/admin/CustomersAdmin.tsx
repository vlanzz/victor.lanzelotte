'use client';
import { useLocale, useTranslations } from 'next-intl';
import type { Locale } from '@/domain/types';
import { formatMoney } from '@/domain/money';
import { orderBRL } from '@/domain/stats';
import { useAdminData } from '@/hooks/useAdminData';
import { Badge } from '@/components/ui/Badge';
import { Skeleton } from '@/components/ui/Skeleton';
import { Table, Td, Th } from '@/components/ui/Table';
import { AdminHeader } from './AdminShell';

export function CustomersAdmin() {
  const t = useTranslations('admin.customers');
  const locale = useLocale() as Locale;
  const { orders, customers, loading } = useAdminData();
  if (loading || !orders || !customers) return <Skeleton className="h-64" />;
  return (
    <div>
      <AdminHeader title={t('title')} />
      <Table caption={t('title')}>
        <thead><tr><Th>{t('col.name')}</Th><Th>{t('col.email')}</Th><Th>{t('col.orders')}</Th><Th>{t('col.spent')}</Th><Th>{t('col.since')}</Th><Th>{t('col.role')}</Th></tr></thead>
        <tbody>
          {customers.map((c) => {
            const mine = orders.filter((o) => o.customerId === c.id && o.status !== 'cancelled');
            return (
              <tr key={c.id}>
                <Td className="font-semibold">{c.name}</Td><Td>{c.email}</Td><Td>{mine.length}</Td>
                <Td>{formatMoney(mine.reduce((s, o) => s + orderBRL(o), 0), 'BRL', locale)}</Td>
                <Td>{new Date(c.createdAt).toLocaleDateString(locale === 'pt' ? 'pt-BR' : 'en-US')}</Td>
                <Td><Badge tone={c.role === 'admin' ? 'ink' : 'neutral'}>{t(`role.${c.role}`)}</Badge></Td>
              </tr>
            );
          })}
        </tbody>
      </Table>
    </div>
  );
}
