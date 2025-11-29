# Domain Migration: dealscale.io → dealscale.io

## ⚠️ IMPORTANT: Domain Change

**Effective Date:** [Current Date]

This document tracks the migration from `dealscale.io` to `dealscale.io` across the entire codebase.

## Overview

Deal Scale has migrated from the `dealscale.io` domain to `dealscale.io`. This change affects:

- **Primary Domain:** `dealscale.io` (was `dealscale.io`)
- **App Domain:** `app.dealscale.io` (was `app.dealscale.io`)
- **API Domain:** `api.dealscale.io` (was `api.dealscale.io`)
- **Email Domain:** `@dealscale.io` (was `@dealscale.io`)

## Email Address Changes

All email addresses have been updated to use the `@dealscale.io` domain:

| Old Email | New Email |
|-----------|-----------|
| `sam.scaler@dealscale.io` | `sam.scaler@dealscale.io` |
| `legal@dealscale.io` | `legal@dealscale.io` |
| `privacy@dealscale.io` | `privacy@dealscale.io` |
| `dpo@dealscale.io` | `dpo@dealscale.io` |
| `security@dealscale.io` | `security@dealscale.io` |
| `support@dealscale.io` | `support@dealscale.io` |

## URL Changes

### Canonical URLs
All canonical URLs in SEO metadata have been updated:
- `https://dealscale.io/*` → `https://dealscale.io/*`
- `https://app.dealscale.io/*` → `https://app.dealscale.io/*`
- `https://api.dealscale.io/*` → `https://api.dealscale.io/*`

### RSS Feeds
RSS feed URLs have been updated:
- `https://dealscale.io/rss.xml` → `https://dealscale.io/rss.xml`
- `https://dealscale.io/rss/hybrid.xml` → `https://dealscale.io/rss/hybrid.xml`
- `https://dealscale.io/rss/youtube.xml` → `https://dealscale.io/rss/youtube.xml`

## Files Updated

### Core Configuration
- ✅ `src/data/company.ts` - Contact email updated
- ✅ `src/data/constants/seo.ts` - All canonical URLs updated
- ✅ `src/utils/seo/staticSeo.ts` - Canonical URLs updated
- ✅ `src/app/page.tsx` - Homepage canonical fallback updated
- ✅ `src/middleware.ts` - App domain URLs updated
- ✅ `src/app/api/affiliates/payment-setup/route.ts` - API base URL updated

### Legal Documents
- ✅ `src/data/constants/legal/terms.ts` - Legal email updated
- ✅ `src/data/constants/legal/privacy.ts` - Privacy email updated
- ✅ `src/data/constants/legal/PII.ts` - DPO email updated
- ✅ `src/data/constants/legal/hippa.ts` - Security email updated
- ✅ `src/data/constants/legal/GDPR.ts` - DPO email updated
- ✅ `src/data/constants/legal/cookies.ts` - Privacy email updated

### Documentation
- ✅ `README.md` - Email addresses and RSS feed URLs updated
- ✅ `content/strapi-export/company_companyData.json` - Contact email updated

## Remaining Updates Needed

The following files may still contain references to `dealscale.io` and should be reviewed:

1. **Test Files** - Update test fixtures and snapshots
2. **Documentation Files** - Update `_docs/` directory references
3. **Environment Variables** - Update `.env` examples and documentation
4. **Package.json** - Update lighthouse performance test URLs
5. **Strapi Exports** - Update exported content files

## Action Items

- [ ] Review and update all test files
- [ ] Update documentation in `_docs/` directory
- [ ] Update environment variable documentation
- [ ] Verify all external integrations use new domain
- [ ] Update DNS and hosting configurations
- [ ] Set up redirects from old domain to new domain
- [ ] Update social media profiles and external listings
- [ ] Notify partners and integrations of domain change

## Notes

- **This is NOT Lead Orchestra** - Deal Scale is a separate entity and brand
- All references to `dealscale.io` should be replaced with `dealscale.io`
- Email addresses must use `@dealscale.io` domain
- Canonical URLs must point to `dealscale.io` for SEO purposes
- API endpoints should use `api.dealscale.io`
- App URLs should use `app.dealscale.io`

## Verification

To verify all changes have been applied, run:

```bash
# Find remaining references
grep -r "dealscale.io" --exclude-dir=node_modules --exclude-dir=.git

# Find remaining email references
grep -r "@leadorchestra" --exclude-dir=node_modules --exclude-dir=.git
```

## Related Documentation

- See `_docs/ENVIRONMENT_VARIABLES.md` for environment variable updates
- See `docs/rss-feeds.md` for RSS feed URL updates

