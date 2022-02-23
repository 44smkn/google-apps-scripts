import { calculateAmountPerCapita } from '../src/calc-amount'

test('calc amount per capita', () => {
    const housingCost = 123456;
    const billing = 654321;
    const want = 778000 // 777,777 -> 778,000
    expect(calculateAmountPerCapita(housingCost, billing)).toBe(want);
})