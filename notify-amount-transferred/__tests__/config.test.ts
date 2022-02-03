import { AppConfig } from '../src/config';
import { PropertyStore } from '../src/property';

class InMemoryPropetryStore implements PropertyStore {
    constructor(private props: Map<string, string>) {}
    get(key: string): string | undefined{
        return this.props.get(key)
    }
}

test('calc housing cost', () => {
    const rent = 1000000;
    const maitenainceFee = 80000;
    const props = new InMemoryPropetryStore(new Map<string, string>([
        ['shared-credit-billing-mail-address', 'hoge@fuga.jp'],
        ['shared-credit-billing-mail-subject', 'Amazon Web Services Billing Statement Available'],
        ['shared-credit-billing-extract-regexp', 'Total: [0-9]*$'],
        ['notification-provider', 'line'],
        ['line-notify-token', 'tokenstrings...'],
        ['email-recipients', 'hogefufa@gmail.com,foobar@gmail.com'],
        ['rent', rent.toString()],
        ['maintenance-fee', maitenainceFee.toString()],
    ]))
    const config = new AppConfig(props);
    expect(config.housingCost.sum()).toBe(rent + maitenainceFee);
})