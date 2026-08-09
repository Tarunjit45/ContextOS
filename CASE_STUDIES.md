# 📋 ContextOS Case Studies & Failure Mode Audit

This document presents 6 representative evaluation cases from the ContextOS benchmark suite, demonstrating how conventional RAG fails on temporal, entity, and context-bloat queries, and how the Decision-Grade Context Compiler resolves them.

---

### Case 1: Temporal Conflict & State Override (`scen_1`)

- **Category:** `temporal_conflict`
- **Query:** *"Is outreach to Initech currently authorized for Project #1001?"*
- **Ground Truth Answer:** `Yes, outreach is authorized as of 2026-01-14`
- **Relevant Workspace Evidence:**
  - `[NOTE 2026-01-10]` *"Hold notice: do not contact Initech regarding Project #1001 due to legal audit."*
  - `[SLACK 2026-01-14]` *"UPDATE: Legal audit cleared for Initech Project #1001. You are authorized to resume outreach."*
- **Baseline Retrieval:** Retrieved `[NOTE 2026-01-10]` due to keyword match density.
- **Baseline Model Answer:** *"No, outreach is currently prohibited due to active legal audit hold."* `[FAILED: TEMPORAL_FAILURE]`
- **ContextOS Compact Context:**
  ```text
  [CURRENT STATE]
  - Attribute: outreach_status | Current Value: allowed | Valid As Of: 2026-01-14

  [EVIDENCE PROVENANCE]
  - [SLACK 2026-01-14 | ID: m_2] UPDATE: Legal audit cleared for Initech Project #1001. You are authorized to resume outreach.
  ```
- **ContextOS Compact Model Answer:** *"Yes, outreach to Initech regarding Project #1001 is currently authorized as of 2026-01-14 as legal audit cleared."* `[PASSED]`
- **Root Cause:** Baseline BM25 selected the earlier hold notice note. ContextOS Temporal Resolver correctly identified the Day 14 Slack update as superseding the Day 10 hold notice.

---

### Case 2: Entity Disambiguation (`scen_201`)

- **Category:** `entity_disambiguation`
- **Query:** *"What is the department for John Smith?"*
- **Ground Truth Answer:** `Executive Sales`
- **Relevant Workspace Evidence:**
  - `[CRM 2026-01-01]` `John Smith (john.smith@acme.com), Role: VP Sales, Dept: Executive Sales`
  - `[EMAIL 2026-01-05]` `John Smith Jr. (john.jr@acme.com), Role: Sales Associate, Dept: Field Sales`
- **Baseline Retrieval:** Retrieved both documents without distinguishing roles.
- **Baseline Model Answer:** *"John Smith is in the Sales department."* `[FAILED: ENTITY_RESOLUTION_FAILURE]`
- **ContextOS Compact Context:**
  ```text
  [ENTITIES]
  - John Smith (john.smith@acme.com) - Role: VP Sales, Dept: Executive Sales
  ```
- **ContextOS Compact Model Answer:** *"John Smith (VP of Sales) is in the Executive Sales department."* `[PASSED]`
- **Root Cause:** Baseline RAG failed to disambiguate senior VP John Smith from junior Sales Associate John Smith Jr. ContextOS Candidate-Scored Entity Resolver matched `VP Sales` and `Executive Sales` attributes.

---

### Case 3: Prompt Bloat & Context Degradation (`scen_2`)

- **Category:** `temporal_conflict`
- **Query:** *"What is the current legal hold status for Acme Corp?"*
- **Ground Truth Answer:** `Cleared on 2026-03-04`
- **Baseline Retrieval:** Top-3 documents. Model Answer: *"Legal hold active."* `[FAILED]`
- **ContextOS Full Context:** Serialized all 30 candidate documents into 6,500+ input tokens of raw JSON structures.
- **ContextOS Full Model Answer:** *"User Safety: safe"* `[FAILED: CONTEXT_COMPOSITION_FAILURE]`
- **ContextOS Compact Context:**
  ```text
  [CURRENT STATE]
  - Attribute: outreach_status | Current Value: allowed | Valid As Of: 2026-03-04
  ```
- **ContextOS Compact Model Answer:** *"The legal hold for Acme Corp was cleared on 2026-03-04."* `[PASSED]`
- **Root Cause:** Supplying uncompiled raw JSON payloads overloaded the LLM's context processing (Context Bloat). ContextOS Compact mode reduced input tokens by 93.6%, allowing the LLM to attend to the critical state transition.

---

### Case 4: Long-Horizon Memory Retention (`scen_601`)

- **Category:** `memory_decay`
- **Query:** *"What is the security bypass code for vault 4?"*
- **Ground Truth Answer:** `9842-AX`
- **Relevant Workspace Evidence:** `[NOTE 2026-01-01]` *"Confidential Vault 4 Security Bypass Code: 9842-AX. Keep secure."*
- **Baseline Retrieval:** Retrieved recent daily lunch communications from Day 60.
- **Baseline Model Answer:** *"Security bypass code is unavailable in the top retrieved context."* `[FAILED: MEMORY_FAILURE]`
- **ContextOS Compact Model Answer:** *"The security bypass code for vault 4 is 9842-AX."* `[PASSED]`
- **Root Cause:** Baseline BM25 degraded over long timelines due to recent noise documents. ContextOS Memory Ranker enforced `Importance + Relevance > Recency` to preserve high-importance vault PIN notes.

---

### Case 5: Missing Information & Anti-Hallucination (`scen_901`)

- **Category:** `missing_information`
- **Query:** *"What are the financial terms for the unannounced secret acquisition?"*
- **Ground Truth Answer:** `Information is unavailable`
- **Relevant Workspace Evidence:** None (Query refers to unannounced non-existent workspace acquisition).
- **Baseline Model Answer:** *"The financial terms for the secret acquisition are $50M in cash and stock."* `[FAILED: HALLUCINATION]`
- **ContextOS Compact Context:**
  ```text
  [EVIDENCE PROVENANCE]
  - None

  [ANSWERABILITY]
  - State: INSUFFICIENT
  ```
- **ContextOS Compact Model Answer:** *"I do not have enough information in the workspace context to answer this."* `[PASSED]`
- **Root Cause:** Baseline RAG forced an answer over irrelevant evidence. ContextOS Decision-Grade Context Compiler evaluated answerability as `INSUFFICIENT` before LLM generation.

---

### Case 6: Contradiction Across Disparate Channels (`scen_751`)

- **Category:** `contradiction_conflict`
- **Query:** *"What is the approved discount percentage for Deal #104?"*
- **Ground Truth Answer:** `15% approved in CRM`
- **Relevant Workspace Evidence:**
  - `[EMAIL 2026-02-01]` *"We can offer a 20% discount on Deal #104."*
  - `[CRM 2026-02-02]` *"Finance approved discount limit: 15% for Deal #104."*
- **Baseline Model Answer:** *"The discount percentage is 20%."* `[FAILED: CONFLICT_FAILURE]`
- **ContextOS Compact Context:**
  ```text
  [CONFLICT RESOLUTION]
  - Conflict Detected: True
  - Resolution: 15% Approved
  - Reason: CRM record (Authority: 1.0) overrides informal email offer (Authority: 0.75).
  ```
- **ContextOS Compact Model Answer:** *"The approved discount percentage for Deal #104 is 15% as confirmed in CRM."* `[PASSED]`
- **Root Cause:** Baseline RAG ignored channel authority. ContextOS enforced source authority precedence (`CRM > Email`).
