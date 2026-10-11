'use client';
import { useCallback, useEffect, useState } from 'react';
import type { Customer, Order } from '@/domain/types';
import { auth, orderRepo } from '@/services';

/** Pedidos e clientes para as telas do admin, com `reload` depois de uma alteração. */
export function useAdminData() {
  const [data, setData] = useState<{ orders: Order[]; customers: Customer[] } | null>(null);
  const load = useCallback(async () => {
    const [orders, customers] = await Promise.all([orderRepo.list(), auth.listCustomers()]);
    setData({ orders, customers });
  }, []);
  useEffect(() => {
    let alive = true;
    void Promise.all([orderRepo.list(), auth.listCustomers()]).then(([orders, customers]) => alive && setData({ orders, customers }));
    return () => { alive = false; };
  }, []);
  return { ...data, loading: data === null, reload: load };
}
