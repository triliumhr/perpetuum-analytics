---
title: Vlastiti eventi
slug: dogadaji
order: 3
summary: Pošalji add_to_cart, sign_up i bilo koji drugi GA4 event iz predloška ili iz koda.
---

# Vlastiti eventi

Prikazi stranica ne traže kod. Za sve ostalo pošalji event s imenom i parametrima onako kako ih imenuje Google Analytics 4.

## Iz predloška

```ts
import { TrackEvent } from '@triliumhr/perpetuum-analytics'

@Component({
    imports: [TrackEvent],
    template: `
        <button type="button" perpetuumTrack="add_to_cart" [perpetuumTrackParams]="{ currency: 'EUR', value: product.price }">
            Dodaj u košaricu
        </button>
    `,
})
export class ProductCard {}
```

Event se šalje na klik. Svaki klik šalje jedan event, a dvoklik dva.

## Iz koda

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

## Webshop

GA4 eventi webshopa nose `currency`, `value` i `items`:

```ts
this.analytics.event('purchase', {
    transaction_id: order.number,
    currency: 'EUR',
    value: order.total,
    items: order.lines.map((line) => ({ item_id: line.sku, item_name: line.name, price: line.price, quantity: line.quantity })),
})
```

Popis [preporučenih evenata](https://support.google.com/analytics/answer/9267735) i njihovih parametara vodi Google.

## Što ostaje izvan evenata

Google Analytics ne prima osobne podatke: imena, e-mail adrese, brojeve telefona, adrese. Umjesto njih koristi ID-jeve, npr. broj narudžbe.
