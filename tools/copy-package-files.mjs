// The README, licence and changelog live once, at the repository root, where GitHub shows them.
// ng-packagr only copies files from inside the library folder, so they join the package here.
import { copyFileSync } from 'node:fs'

const packageFolder = 'dist/perpetuum-analytics'

for (const file of ['README.md', 'LICENSE.md', 'CHANGELOG.md']) {
    copyFileSync(file, `${packageFolder}/${file}`)
}
