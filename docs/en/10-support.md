---
title: Support and maintenance
slug: support
order: 10
summary: Which versions are supported, how Angular releases are followed and how the package is kept up to date.
---

# Support and maintenance

Perpetuum Analytics is maintained for the long run. This page says what you can count on, so you can plan your own upgrades.

## Supported versions

| Version                               | Support                                        |
| ------------------------------------- | ---------------------------------------------- |
| 3.x, `@triliumhr/perpetuum-analytics` | active: new features, fixes and security fixes |
| 2.x, `perpetuum-analytics`            | security fixes only, until 30 April 2027       |
| older than 2.0                        | not supported                                  |

2.x gets no new features and no new Angular versions. The [migration guide](migrating-from-2) shows how to move to 3.x, and 3.x keeps everything 2.x did for GA4 and Tag Manager.

## Angular versions

- **The two newest Angular majors are supported, now 21 and 22.** Every spec runs on both, on every pull request.
- **A new Angular major is supported within 30 days of its stable release,** in a minor release of the package.
- **An older Angular major is removed only in a new major of the package,** announced in the changelog and the roadmap when the new Angular major arrives, and at least 6 months before the removal. Until then, three majors can be supported at once.

## Maintenance rhythm

- **Every week:** dependency updates, all checks on `main` against the latest releases, security alerts and `npm audit`.
- **Every month:** new Angular, TypeScript and Node.js releases are checked against this policy, and open issues and pull requests are answered.
- **Every quarter:** a security review of the code, the release workflow and npm publishing, and a review of the [roadmap](roadmap).

Every change, from maintenance too, comes as a pull request with the same checks: 100 % coverage, a real SSR render and an end-to-end run in Chromium. See [How it is tested](testing).

## Versions and deprecation

- The package follows [semantic versioning](https://semver.org): a patch fixes, a minor adds, and only a major asks you to change your code. Every major comes with a migration guide.
- Before something is removed, it is first marked as deprecated: in the changelog, in the docs and in the types, so your editor shows it. It keeps working for at least 6 months and is removed only in the next major.
- Security fixes come first, as a patch release of every supported version.

Security issues are reported privately, as described in [SECURITY.md](https://github.com/triliumhr/perpetuum-analytics/blob/main/SECURITY.md).
