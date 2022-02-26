import { calculateAmountPerCapita } from '../src/calc-amount'

test('calc amount per capita', () => {
    const housingCost = 123456;
    const billing = 654321;
    const want = 389000 // 777,777 / 2 -> 388888.5 -> 389000
    expect(calculateAmountPerCapita(housingCost, billing)).toBe(want);
})