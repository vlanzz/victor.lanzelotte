import { arts } from '@/data/arts';
import { productTypes, products } from '@/data/products';
import { MockupLab } from '@/components/domain/mockup/MockupLab';
import { resolveLocale } from '@/i18n/params';

export const metadata = { title: 'Mockup lab', robots: { index: false } };

export default async function LabPage({ params }: { params: Promise<{ locale: string }> }) {
  await resolveLocale(params);
  const rows = productTypes.flatMap((type, i) => {
    const product = products.find((p) => p.typeId === type.id);
    const compatible = arts.filter((a) => type.orientations.includes(a.orientation));
    const art = compatible[(i * 5) % Math.max(1, compatible.length)];
    return product && art ? [{ type, product, art }] : [];
  });
  return <MockupLab rows={rows} />;
}
