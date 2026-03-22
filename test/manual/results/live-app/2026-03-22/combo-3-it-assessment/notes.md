# Test Notes — Combo 3: IT & Digital Transformation Assessment

Date: 2026-03-22
Environment: live-app (https://cosmolab-hcrb.vercel.app)
Tester: Manual run required
Result: NOT RUN (live-app generate timeout — run manually on local app)

## Timing
- Chat response time: works fine on live app
- Document generation time: TIMES OUT on live app (~70–90s needed, 60s limit)

## Documents Generated
- [ ] IT Systems Readiness Assessment
- [ ] Digital Transformation Roadmap
- [ ] AI Build vs. Buy Recommendation
- [ ] Integration Architecture Brief

## Known Issue
The IT Assessment generate endpoint requires ~70–90 seconds to produce 4 detailed
documents. Vercel Hobby plan caps serverless functions at 60 seconds.

**Workaround options:**
1. Run the full session on the local app (`pnpm dev`) — no timeout limit
2. Upgrade to Vercel Pro ($20/month) for 300s function timeout

## Next Step
Run manually using test data in:
`test/manual/test-data/combo-3-it-assessment.md`

Save generated documents here once complete.
