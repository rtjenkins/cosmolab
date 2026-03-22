# Test Data — Combo 3: IT & Digital Transformation Assessment

**App URL:** `/it-assessment`
**Module:** Phase 1.5 — IT & Digital Transformation Assessment
**Documents generated:** IT Systems Readiness Assessment, Digital Transformation Roadmap, AI Build vs. Buy Recommendation, Integration Architecture Brief

> ⚠️ **Note on timing:** This combo generates 4 very detailed documents and requires
> 70–90 seconds of AI generation time. It consistently times out on the live app
> (Vercel Hobby plan, 60s limit). It works correctly on the **local app** (`pnpm dev`).
> For live app testing, the chat phase works fine — only document generation times out.
> Recommended: run this combo locally.

---

## How to use this script

The AI will cover 10 IT dimensions. Paste the user response when prompted.
The AI may ask follow-up questions — elaborate naturally or use the follow-up responses provided.

---

## Company Scenario

**Company:** Mid-size cosmetic contract manufacturer, ~150 employees
**IT team:** 2 staff (1 generalist, 1 SYSPRO-focused)
**Budget:** $400–600K for capital projects this year
**Key pain:** FDA 483 observation for lab data integrity; formula versioning errors; manual scheduling

---

## Conversation Script

---

**[AI — Turn 1]**
> Hello, I'm CosmoLab AI — your senior IT and digital transformation advisor.
> Can you walk me through your current core systems? Specifically, what platforms are you
> running for ERP, formulation/PLM, shop floor or MES, and quality management —
> and roughly how long have you been on each of them?

**USER RESPONSE — paste this:**
```
We're on SYSPRO for ERP — about 8 years. No PLM; we manage formulas in Excel and a shared drive. No MES — paper batch records on the floor. We have MasterControl for QMS document storage only. No LIMS — all lab data is in Excel.
```

---

**[AI — Turn 2]**
> That's a significant spreadsheet dependency. On the formulation side — have you evaluated
> Coptis or Ithos for PLM, or is that not on your roadmap yet?

**USER RESPONSE — paste this:**
```
We evaluated Coptis two years ago but didn't proceed due to budget. It's back on the radar now. The formula versioning problem is getting painful — we had a production batch made from an outdated formula last quarter. R&D updated the Excel master but the shared drive copy wasn't replaced.
```

---

**[AI — Turn 3]**
> On the shop floor — are your batch records fully paper-based, or have you digitized any
> part of the process? And are you tracking OEE at all?

**USER RESPONSE — paste this:**
```
Fully paper. OEE is not formally tracked — we know roughly what our downtime looks like but it's not measured systematically. Operators log issues in a paper logbook.
```

---

**[AI — Follow-up on batch records]**
> What's your right-first-time rate on batch record completion, and how long after
> production does QA sign off?

**USER RESPONSE — paste this:**
```
Right-first-time on batch records is maybe 60–70%. We get a lot of incomplete entries, missing signatures, and incorrect batch sizes. QA review takes 3–5 days post-production.
```

---

**[AI — Turn 4]**
> On LIMS — with all lab data in Excel, how are you managing stability studies and
> generating CoAs for customers?

**USER RESPONSE — paste this:**
```
Stability is tracked in a master Excel file. CoAs are generated manually from a Word template. It's slow and error-prone — we've sent incorrect CoAs twice in the last year. Our last FDA audit issued a 483 observation for lack of audit trail on lab data.
```

---

**[AI — Follow-up on FDA finding]**
> What was the specific finding — audit trail, contemporaneous recording, or something else?

**USER RESPONSE — paste this:**
```
Lack of audit trail on lab data. The investigator noted that Excel files don't provide adequate traceability for data changes. We got a 483 observation and are under pressure to remediate before the next inspection.
```

---

**[AI — Turn 5]**
> On the QMS — you mentioned MasterControl for document storage. Are you using it for
> deviation management and CAPA tracking, or is that still manual?

**USER RESPONSE — paste this:**
```
Document storage only. Deviations are managed in Excel, CAPAs are tracked in a shared Word document. It came up in our last internal audit as a gap.
```

---

**[AI — Turn 6]**
> Where are the biggest data integration gaps in SYSPRO — what falls through to
> spreadsheets outside the system?

**USER RESPONSE — paste this:**
```
Demand planning and forecasting are entirely in Excel. Production scheduling is in a separate spreadsheet. Raw material lead times are in yet another file. SYSPRO holds financials and POs but nothing talks to anything else.
```

---

**[AI — Turn 7]**
> Are you using any AI tools today — vendor-provided or tools your team has adopted on their own?

**USER RESPONSE — paste this:**
```
A few people use ChatGPT for drafting emails and SOPs. Nothing structured or enterprise-wide. There's interest from leadership but no formal AI strategy.
```

---

**[AI — Turn 8]**
> What's your IT team size and budget range for transformation this year?

**USER RESPONSE — paste this:**
```
Two IT staff — one generalist, one focused on SYSPRO. Budget is approximately $400–600K for capital projects this year. Leadership wants to prioritize the FDA data integrity issue first.
```

---

**[AI — Turn 9]**
> What are your top 3 priorities as you see them?

**USER RESPONSE — paste this:**
```
One — fix the LIMS and data integrity issue before the next FDA inspection. Two — get formula version control under control before we have another production error. Three — reduce the manual scheduling spreadsheets so we stop missing production windows.
```

---

**[AI — Final message]**
> I have everything I need. Type 'generate' to create your IT transformation documents.

**USER RESPONSE — paste this:**
```
generate
```

> ⏱️ **Wait up to 90 seconds** for document generation. On the local app this will
> complete successfully. On the live app it may time out — this is a known limitation
> of the Vercel Hobby plan (60s function timeout).

---

## Expected Documents

| # | Document Title | Key Content to Check |
|---|---|---|
| 1 | IT Systems Readiness Assessment | Scores for PLM, MES, LIMS, QMS, ERP; FDA 483 observation mentioned; SYSPRO named |
| 2 | Digital Transformation Roadmap | 90-day / 6-month / 12-month phases; LIMS as top priority; Coptis evaluation path |
| 3 | AI Build vs. Buy Recommendation | 8–10 AI use cases; prioritized by pain points stated (LIMS, formula versioning, scheduling) |
| 4 | Integration Architecture Brief | Current state (no integrations); recommended sequence; data governance principles |

## Pass Criteria
- ✅ Documents reference SYSPRO, MasterControl, Coptis by name
- ✅ FDA 483 observation and LIMS priority appear in the roadmap
- ✅ Budget range ($400–600K) informs recommendations
- ✅ AI use cases are specific to cosmetic CM operations
- ✅ No "[To be confirmed]" placeholders
- ✅ Word (.docx) download works
