---
title: Custom events
slug: events
order: 3
summary: Send add_to_cart, sign_up and any other GA4 event from a template or from code.
---

# Custom events

Page views need no code. For everything else, send an event with a name and parameters as Google Analytics 4 names them.

## From a template

```ts
import { TrackEvent } from '@triliumhr/perpetuum-analytics'

@Component({
    imports: [TrackEvent],
    template: `
        <button type="button" perpetuumTrack="add_to_cart" [perpetuumTrackParams]="{ currency: 'EUR', value: product.price }">
            Add to cart
        </button>
    `,
})
export class ProductCard {}
```

The event is sent when the element is clicked. Every click sends one event, a double click sends two.

## From code

```ts
import { Analytics } from '@triliumhr/perpetuum-analytics'

export class SignUpForm {
    private readonly analytics = inject(Analytics)

    protected async signUp(): Promise<void> {
        await this.account.create()
        this.analytics.event('sign_up', { method: 'email' })
    }
}
```

## Ecommerce

GA4 ecommerce events carry `currency`, `value` and `items`:

```ts
this.analytics.event('purchase', {
    transaction_id: order.number,
    currency: 'EUR',
    value: order.total,
    items: order.lines.map((line) => ({ item_id: line.sku, item_name: line.name, price: line.price, quantity: line.quantity })),
})
```

Google keeps the list of [recommended events](https://support.google.com/analytics/answer/9267735) and their parameters.

## What not to send

Google Analytics does not accept personal data: names, e-mail addresses, phone numbers, addresses. Use ids such as an order number instead.
