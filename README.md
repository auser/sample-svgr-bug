## Bug for svgr

Regarding https://github.com/gregberge/svgr/issues/423

To bootstrap:

```bash
lerna bootstrap
```

## The issue:

```bash
npm run build:icons
```

Does _not_ use the custom plugin :(
