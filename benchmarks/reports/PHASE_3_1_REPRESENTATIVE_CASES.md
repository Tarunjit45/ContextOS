# 📋 ContextOS Phase 3.1 — 10-Scenario Low-Resource Representative Case Report

### Scenario `scen_601` (memory_decay)
- **Query:** What is the security bypass code for Acme Server Vault #701 stored on 2026-01-03?
- **Ground Truth Answer:** `The security bypass code for Acme Server Vault #701 is 5207-DJ.`
- **Baseline RAG:** Based on the provided context, the security bypass code for Acme Server Vault #701 is **5207-DJ**.

However, there is no information in the provided documents that confirms this code was "stored on 2026-01-03." The documents only contain the bypass codes themselves without any date information. (`PASSED`)
- **ContextOS Full:** The security bypass code for Acme Server Vault #701 is **5207-DJ**. (`PASSED`)
- **ContextOS Compact:** The security bypass code for Acme Server Vault #701 stored on 2026‑01‑03 is **5207‑DJ**. (`PASSED`)

### Scenario `scen_901` (missing_information)
- **Query:** What is the unannounced Q2 confidential discount percentage promised to Initech for Project #1901?
- **Ground Truth Answer:** `I do not have enough information in the workspace context to answer this.`
- **Baseline RAG:** The information about an unannounced Q2 confidential discount percentage for Initech's Project #1901 is not present in the provided evidence. The documents only mention legal audit clearances for Projects #1001, #1004, and #1007, with no reference to discounts, Q2, or Project #1901. (`FAILED`)
- **ContextOS Full:** I cannot find any information about an unannounced Q2 confidential discount percentage for Initech Project #1901 in the provided context. 

The context contains:
- Legal audit clearances for Initech projects #1001-#1088
- Various entity and relationship data
- Timeline information
- Current state information

However, there is no mention of Project #1901, any Q2 confidential discount, or any discount percentage promised to Initech. The information you're requesting appears to be unavailable in the provided context. (`PASSED`)
- **ContextOS Compact:** The provided context does not contain any information about Project #1901 or an unannounced Q2 confidential discount percentage. The context only references Initech Projects #1046, #1016, and #1076, with legal audits cleared for those projects. Therefore, the answer is **unavailable** based on the given evidence. (`PASSED`)

### Scenario `scen_201` (entity_disambiguation)
- **Query:** Which John Smith holds the role of VP Sales in Executive Sales for Project #1201?
- **Ground Truth Answer:** `John Smith (john.smith@acme.com) is the VP of Sales in Executive Sales, whereas John Smith Jr. (john.jr@acme.com) is the Sales Associate.`
- **Baseline RAG:** The information provided does not mention Project #1201 or any details related to it. Therefore, the role of John Smith in Executive Sales for Project #1201 is unavailable based on the given evidence. (`FAILED`)
- **ContextOS Full:** The provided evidence does not mention **Project #1201** or indicate which John Smith (if any) is associated with that project. Therefore, the information needed to answer the question is unavailable. (`FAILED`)
- **ContextOS Compact:** Based on the provided evidence, John Smith (john.smith@acme.com) holds the role of VP Sales in Executive Sales; however, there is no information regarding Project #1201. (`PASSED`)

### Scenario `scen_2` (temporal_conflict)
- **Query:** Is outreach to Massive Dynamic regarding Project #1002 currently authorized as of 2026-01-16?
- **Ground Truth Answer:** `Yes, legal audit cleared for Massive Dynamic Project #1002 on 2026-01-16 and outreach is authorized.`
- **Baseline RAG:** User Safety: safe (`FAILED`)
- **ContextOS Full:** No. The context explicitly states: "DO NOT contact Massive Dynamic regarding Project #1002 due to active legal hold." This prohibition is in effect as of 2026-01-16. (`FAILED`)
- **ContextOS Compact:** Yes, outreach to Massive Dynamic regarding Project #1002 is authorized as of 2026-01-16. The evidence includes a Slack message from [SLACK 2026-01-16] explicitly stating that the legal audit cleared for Project #1002 and authorizing resumption of outreach. (`PASSED`)

### Scenario `scen_602` (memory_decay)
- **Query:** What is the security bypass code for Acme Server Vault #702 stored on 2026-01-04?
- **Ground Truth Answer:** `The security bypass code for Acme Server Vault #702 is 5214-EM.`
- **Baseline RAG:** Based on the provided context, the security bypass code for Acme Server Vault #702 is **5214-EM**.

However, I cannot confirm that this code was "stored on 2026-01-04" as the documents do not contain any date information. The date mentioned in the question is not present in the provided evidence. (`PASSED`)
- **ContextOS Full:** User Safety: unsafe
Safety Categories: PII/Privacy (`FAILED`)
- **ContextOS Compact:** The security bypass code for Acme Server Vault #702, stored on 2026-01-04, is **5214-EM**. (`PASSED`)

### Scenario `scen_401` (multi_hop_relationship)
- **Query:** What ARR contract value was finalized in the meeting for Project #1401?
- **Ground Truth Answer:** `John Smith finalized a $160k ARR contract for Project #1401 with David Wilson.`
- **Baseline RAG:** The ARR contract value finalized for Project #1401 in the meeting was **$160k**, as documented in **m_hop_401**. (`PASSED`)
- **ContextOS Full:** $160k ARR (`PASSED`)
- **ContextOS Compact:** The information about an ARR contract for Project #1401 is not present in the provided context. (`PASSED`)

### Scenario `scen_1` (temporal_conflict)
- **Query:** Is outreach to Initech regarding Project #1001 currently authorized as of 2026-01-14?
- **Ground Truth Answer:** `Yes, legal audit cleared for Initech Project #1001 on 2026-01-14 and outreach is authorized.`
- **Baseline RAG:** The user is asking whether outreach to Initech regarding Project #1001 is currently authorized as of 2026-01-14.

From Document ID: m_1 (Type: email), the content states: "DO NOT contact Initech regarding Project #1001 due to active legal hold."

From Document ID: m_2 (Type: slack), the content states: "UPDATE: Legal audit cleared for Initech Project #1001. You are authorized to resume outreach to Initech."

However, the question asks about the status "as of 2026-01-14." The documents don't explicitly state a date. The m_1 document is a clear prohibition, while m_2 is an update that clears the legal hold. But the question is about the current status as of 2026-01-14.

Since the documents don't provide a timestamp, and m_1 explicitly says "DO NOT contact Initech regarding Project #1001 due to active legal hold," while m_2 says the legal audit is cleared and outreach is authorized, there's a conflict. But the question asks "as of 2026-01-14" — the documents don't specify dates.

Given the explicit prohibition in m_1 and the authorization in m_2, the answer depends on which document takes precedence. Since m_1 is an email with a clear "DO NOT contact" instruction and m_2 is a slack update saying the legal audit is cleared, there's a contradiction.

However, the question is specifically about whether outreach is "currently authorized." The m_1 document explicitly states a legal hold is active, which would prohibit outreach. The m_2 document says the legal audit is cleared and outreach is authorized.

Since the question asks about the status as of 2026-01-14 and the documents don't have dates, I should note the contradiction. But the most direct answer based on the explicit prohibition in m_1 is that outreach is NOT authorized due to the active legal hold.

Actually, let me reconsider. The m_2 document says "UPDATE: Legal audit cleared for Initech Project #1001. You are authorized to resume outreach to Initech." This is an update that clears the hold. The m_1 document is a prior instruction. The (`PASSED`)
- **ContextOS Full:** No. The context explicitly states: "DO NOT contact Initech regarding Project #1001 due to active legal hold." This prohibition is in effect as of the current state (valid as of 2026-01-14 23:59:59). (`FAILED`)
- **ContextOS Compact:** Yes. As of 2026‑01‑14, the legal audit for Initech Project #1001 was cleared and you were explicitly authorized to resume outreach to Initech. (`PASSED`)

### Scenario `scen_202` (entity_disambiguation)
- **Query:** Which John Smith holds the role of VP Sales in Field Sales for Project #1202?
- **Ground Truth Answer:** `John Smith (john.smith@acme.com) is the VP of Sales in Field Sales, whereas John Smith Jr. (john.jr@acme.com) is the Sales Associate.`
- **Baseline RAG:** The provided evidence does not contain any information about a John Smith holding the role of VP Sales in Field Sales for Project #1202. Therefore, the answer is unavailable. (`FAILED`)
- **ContextOS Full:** The information is unavailable. (`FAILED`)
- **ContextOS Compact:** The provided context does not contain any information about Project #1202 or a John Smith who holds the VP Sales role in Field Sales for that project. Therefore, the answer cannot be determined from the given evidence. (`FAILED`)

### Scenario `scen_751` (contradiction_conflict)
- **Query:** Is Project #1751 approved by finance as of 2026-01-14?
- **Ground Truth Answer:** `Yes, finance approved Project #1751 at $160k on 2026-01-14.`
- **Baseline RAG:** The user is asking whether Project #1751 was approved by finance as of 2026-01-14. Let me look at the evidence provided.

Document ID: m_1502, Type: slack, Content: "RESOLVED: Budget approved by finance for Project #1751 at $160k."

The document doesn't mention a date. The question asks about "as of 2026-01-14." The documents don't contain any date information. There's no way to determine if the approval was as of 2026-01-14 based on the provided context.

However, the question might be testing whether the information is available. The documents show that Project #1751's budget was approved by finance, but no date is mentioned. The question asks "as of 2026-01-14" which is a specific date. Since the documents don't provide a date, I cannot confirm or deny the status as of that specific date.

Wait, let me reconsider. The question might be a trick question. The documents show the budget was approved, but there's no date mentioned. The question asks "as of 2026-01-14." Without a date in the document, I cannot determine if it was approved as of that specific date.

Actually, looking more carefully, the documents are just slack messages with resolutions. They don't have timestamps. So I cannot verify the date "2026-01-14" from the context.

The answer should be: The evidence does not provide a date, so it cannot be determined whether Project #1751 was approved by finance as of 2026-01-14.

But wait - maybe the question is simply asking if the approval exists in the documents. The approval exists in the documents (m_1502), but the date "2026-01-14" is not mentioned. So the answer is no, we cannot confirm it as of that date.

Let me think about this more carefully. The question is "Is Project #1751 approved by finance as of 2026-01-14?" The documents show that the budget was approved by finance, but no date is given. Since the (`FAILED`)
- **ContextOS Full:** Yes, Project #1751 was approved by finance (budget of $160k) as of 2026-01-14. This is stated in the facts: “RESOLVED: Budget approved by finance for Project #1751 at $160k.” The current state is valid as of 2026-01-14 23:59:59, confirming the approval is in effect on that date. (`PASSED`)
- **ContextOS Compact:** Yes, Project #1751 was approved by finance for $160k as of 2026-01-14. (`PASSED`)

### Scenario `scen_402` (multi_hop_relationship)
- **Query:** What ARR contract value was finalized in the meeting for Project #1402?
- **Ground Truth Answer:** `John Smith finalized a $170k ARR contract for Project #1402 with David Wilson.`
- **Baseline RAG:** The meeting for Project #1402 resulted in a finalized ARR contract of **$170 k**. (`PASSED`)
- **ContextOS Full:** $170k ARR (`PASSED`)
- **ContextOS Compact:** The information about an ARR contract value for Project #1402 is not available in the provided context. The critical facts only mention contracts for Project #1405 ($200k), Project #1406 ($210k), and Project #1429 ($440k). (`PASSED`)

