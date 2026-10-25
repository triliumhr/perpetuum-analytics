import { Routes } from '@angular/router'

import { Home, Shop } from './pages'

export const routes: Routes = [
    { path: '', component: Home, title: 'Home' },
    { path: 'shop', component: Shop, title: 'Shop' },
]
