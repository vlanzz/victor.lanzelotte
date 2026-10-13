import { describe, expect, it } from 'vitest';
import { convert, formatMoney } from '@/domain/money';

describe('money', () => {
  it('formata BRL em PT e USD em EN', () => {
    expect(formatMoney(6990, 'BRL', 'pt').replace(/\s/g, ' ')).toBe('R$ 69,90');
    expect(formatMoney(6990, 'USD', 'en')).toBe('$69.90');
    expect(formatMoney(6990, 'USD', 'pt').replace(/\s/g, ' ')).toContain('69,90');
  });
  it('converte BRL→USD pela taxa fixa e arredonda a 10 centavos', () => {
    expect(convert(5500, 'BRL', 'USD')).toBe(1000);
    expect(convert(6990, 'BRL', 'USD')).toBe(1270);
    expect(convert(100, 'BRL', 'BRL')).toBe(100);
  });
  it('converte USD→BRL', () => {
    expect(convert(1000, 'USD', 'BRL')).toBe(5500);
  });
});
