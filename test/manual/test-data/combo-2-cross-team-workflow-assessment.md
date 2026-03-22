# Test Data — Combo 2: Cross-Team Workflow Assessment

**App URL:** `/assessment`
**Module:** Phase 1.5 — Cross-Team Workflow Assessment
**Documents generated:** Handoff Tightness Assessment, Automation Opportunity Report, 90-Day Implementation Roadmap, Executive Summary

---

## How to use this script

The AI will work through 9 cross-team handoffs in order. Paste the user response for each
handoff when the AI asks about it. The AI may ask follow-up questions — if so, use the
follow-up response provided, or elaborate naturally based on the scenario.

---

## Company Scenario

**Company:** Mid-size cosmetic contract manufacturer, ~150 employees
**Systems:** Basic ERP, no MES, paper batch records, email-based handoffs
**Pain points:** Rework on formula handoffs, missed production windows, CAPA tracking gaps

---

## Conversation Script

---

**[AI — Turn 1]**
> Welcome. I'm CosmoLab AI conducting a Cross-Team Workflow Assessment.
> Let's start with Handoff 1: Sales → R&D / Formulation.
> When a new client brief comes in, how does that information get from your Sales team
> to your R&D or Formulation team?

**USER RESPONSE — paste this:**
```
Sales sends an email with a Word doc brief. Quality varies a lot by rep — sometimes it's detailed, sometimes just a few bullet points. R&D usually has to follow up for missing details. It takes 3–5 days before R&D can actually start working.
```

---

**[AI — Follow-up on Handoff 1]**
> Is there a documented template for what Sales must include, or does it depend on who wrote it?

**USER RESPONSE — paste this:**
```
No standard template. It depends entirely on the sales rep. Some are thorough, others skip key details like target actives or regulatory market.
```

---

**[AI — Turn 2]**
> Moving to Handoff 2: Sales → Demand Planning.
> How does committed volume and timeline get communicated from Sales to your planning team?

**USER RESPONSE — paste this:**
```
Sales updates a shared Excel forecast file once a week. Demand Planning pulls from that. But the file has version control issues — we've had people working off old copies. No formal SLA — mostly verbal. We've missed production windows because of late volume confirmations.
```

---

**[AI — Turn 3]**
> Handoff 3: R&D → Manufacturing.
> When R&D locks a formula and hands it to Manufacturing for scale-up, what does that look like?

**USER RESPONSE — paste this:**
```
R&D emails the batch sheet and formula card. There's a handoff meeting for complex products but not always for simpler ones. Manufacturing sometimes gets incomplete packaging specs. About 30% rework rate on first handoff — it's a known bottleneck, adds a week or more of delay.
```

---

**[AI — Turn 4]**
> Handoff 4: R&D → Engineering.
> How do new equipment or line requirements get communicated when R&D develops a new format?

**USER RESPONSE — paste this:**
```
Usually informal — R&D mentions it in a project meeting and Engineering takes notes. There's no formal specification document.
```

---

**[AI — Turn 5]**
> Handoff 5: R&D → Quality.
> How do formula and testing requirements move from R&D to your QA/QC team?

**USER RESPONSE — paste this:**
```
R&D submits a stability plan and a quality spec sheet. QA reviews it and signs off. This one is actually fairly structured — we have a template for it.
```

---

**[AI — Turn 6]**
> Handoff 6: Manufacturing → Quality.
> Walk me through how in-process controls and batch record sign-off work.

**USER RESPONSE — paste this:**
```
Paper batch records still. QA checks them after production. We've had compliance findings during audits because of incomplete entries on the floor.
```

---

**[AI — Turn 7]**
> Handoff 7: Demand Planning → Manufacturing.
> How are production runs scheduled and communicated?

**USER RESPONSE — paste this:**
```
Demand Planning sends a weekly production schedule via email. Manufacturing confirms or pushes back verbally. No system-to-system integration.
```

---

**[AI — Turn 8]**
> Handoff 8: Demand Planning → Procurement.
> How does a confirmed production schedule trigger purchase orders?

**USER RESPONSE — paste this:**
```
Procurement gets the schedule and manually creates POs in the ERP. Lead times are tracked in a separate spreadsheet. We've had stockouts due to miscommunication.
```

---

**[AI — Turn 9]**
> Final handoff — Quality → All Teams.
> How do deviations and CAPAs get communicated and tracked across departments?

**USER RESPONSE — paste this:**
```
QA emails a deviation report. Follow-up is manual — QA has to chase teams for corrective actions. We have a QMS but it's only used for document storage, not active CAPA tracking.
```

---

**[AI — Final message]**
> I have everything I need. Type 'generate' to create your assessment reports.

**USER RESPONSE — paste this:**
```
generate
```

---

## Expected Documents

| # | Document Title | Key Content to Check |
|---|---|---|
| 1 | Handoff Tightness Assessment | Scores for all 9 handoffs (1–5 scale), identifies Sales→R&D and R&D→Mfg as weakest |
| 2 | Automation Opportunity Report | Top automation opportunities: formula handoff, CAPA tracking, production scheduling |
| 3 | 90-Day Implementation Roadmap | Specific actions with timelines, prioritized by impact |
| 4 | Executive Summary | High-level findings suitable for leadership presentation |

## Pass Criteria
- ✅ All 9 handoffs scored and described
- ✅ Automation opportunities are specific (not generic)
- ✅ 90-day roadmap has actionable items
- ✅ No "[To be confirmed]" placeholders
- ✅ Word (.docx) download works
