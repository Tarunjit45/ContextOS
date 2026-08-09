# 📋 ContextOS Phase 3.1 — 10-Scenario Low-Resource Representative Case Report

### Scenario `scen_901` (missing_information)
- **Query:** What is the unannounced Q2 confidential discount percentage promised to Initech for Project #1901?
- **Ground Truth Answer:** `I do not have enough information in the workspace context to answer this.`
- **Baseline RAG:** {"answer": "I do not have enough information in the workspace context to answer this.", "decision": "decline", "confidence": 0.99} (`PASSED`)
- **ContextOS Full:** {"answer": "I do not have enough information in the workspace context to answer this.", "decision": "decline", "confidence": 0.99} (`PASSED`)
- **ContextOS Compact:** {"answer": "I do not have enough information in the workspace context to answer this.", "decision": "decline", "confidence": 0.99} (`PASSED`)

### Scenario `scen_2` (temporal_conflict)
- **Query:** Is outreach to Massive Dynamic regarding Project #1002 currently authorized as of 2026-01-16?
- **Ground Truth Answer:** `Yes, legal audit cleared for Massive Dynamic Project #1002 on 2026-01-16 and outreach is authorized.`
- **Baseline RAG:** {"answer": "Yes, outreach is currently authorized as legal audit cleared.", "decision": "allowed", "confidence": 0.99} (`PASSED`)
- **ContextOS Full:** {"answer": "Yes, outreach is currently authorized as legal audit cleared.", "decision": "allowed", "confidence": 0.99} (`PASSED`)
- **ContextOS Compact:** {"answer": "Yes, outreach is currently authorized as legal audit cleared.", "decision": "allowed", "confidence": 0.99} (`PASSED`)

### Scenario `scen_601` (memory_decay)
- **Query:** What is the security bypass code for Acme Server Vault #701 stored on 2026-01-03?
- **Ground Truth Answer:** `The security bypass code for Acme Server Vault #701 is 5207-DJ.`
- **Baseline RAG:** {"answer": "The security bypass code is 5207-DJ.", "decision": "revealed", "confidence": 0.98} (`PASSED`)
- **ContextOS Full:** {"answer": "The security bypass code is 5207-DJ.", "decision": "revealed", "confidence": 0.98} (`PASSED`)
- **ContextOS Compact:** {"answer": "The security bypass code is 5207-DJ.", "decision": "revealed", "confidence": 0.98} (`PASSED`)

### Scenario `scen_402` (multi_hop_relationship)
- **Query:** What ARR contract value was finalized in the meeting for Project #1402?
- **Ground Truth Answer:** `John Smith finalized a $170k ARR contract for Project #1402 with David Wilson.`
- **Baseline RAG:** {"answer": "Information verified against workspace evidence.", "decision": "confirmed", "confidence": 0.85} (`FAILED`)
- **ContextOS Full:** {"answer": "Information verified against workspace evidence.", "decision": "confirmed", "confidence": 0.85} (`FAILED`)
- **ContextOS Compact:** {"answer": "Information verified against workspace evidence.", "decision": "confirmed", "confidence": 0.85} (`FAILED`)

### Scenario `scen_401` (multi_hop_relationship)
- **Query:** What ARR contract value was finalized in the meeting for Project #1401?
- **Ground Truth Answer:** `John Smith finalized a $160k ARR contract for Project #1401 with David Wilson.`
- **Baseline RAG:** {"answer": "Information verified against workspace evidence.", "decision": "confirmed", "confidence": 0.85} (`FAILED`)
- **ContextOS Full:** {"answer": "Information verified against workspace evidence.", "decision": "confirmed", "confidence": 0.85} (`FAILED`)
- **ContextOS Compact:** {"answer": "Information verified against workspace evidence.", "decision": "confirmed", "confidence": 0.85} (`FAILED`)

### Scenario `scen_202` (entity_disambiguation)
- **Query:** Which John Smith holds the role of VP Sales in Field Sales for Project #1202?
- **Ground Truth Answer:** `John Smith (john.smith@acme.com) is the VP of Sales in Field Sales, whereas John Smith Jr. (john.jr@acme.com) is the Sales Associate.`
- **Baseline RAG:** {"answer": "John Smith is a sales team member.", "decision": "ambiguous", "confidence": 0.50} (`FAILED`)
- **ContextOS Full:** {"answer": "John Smith (john.smith@acme.com) is the VP of Sales in Executive Sales, whereas John Smith Jr. (john.jr@acme.com) is the Sales Associate in Field Sales.", "decision": "resolved", "confidence": 0.99} (`PASSED`)
- **ContextOS Compact:** {"answer": "John Smith (john.smith@acme.com) is the VP of Sales in Executive Sales, whereas John Smith Jr. (john.jr@acme.com) is the Sales Associate in Field Sales.", "decision": "resolved", "confidence": 0.99} (`PASSED`)

### Scenario `scen_751` (contradiction_conflict)
- **Query:** Is Project #1751 approved by finance as of 2026-01-14?
- **Ground Truth Answer:** `Yes, finance approved Project #1751 at $160k on 2026-01-14.`
- **Baseline RAG:** {"answer": "Information verified against workspace evidence.", "decision": "confirmed", "confidence": 0.85} (`FAILED`)
- **ContextOS Full:** {"answer": "Information verified against workspace evidence.", "decision": "confirmed", "confidence": 0.85} (`FAILED`)
- **ContextOS Compact:** {"answer": "Information verified against workspace evidence.", "decision": "confirmed", "confidence": 0.85} (`FAILED`)

### Scenario `scen_602` (memory_decay)
- **Query:** What is the security bypass code for Acme Server Vault #702 stored on 2026-01-04?
- **Ground Truth Answer:** `The security bypass code for Acme Server Vault #702 is 5214-EM.`
- **Baseline RAG:** {"answer": "The security bypass code is 5214-EM.", "decision": "revealed", "confidence": 0.98} (`PASSED`)
- **ContextOS Full:** {"answer": "The security bypass code is 5214-EM.", "decision": "revealed", "confidence": 0.98} (`PASSED`)
- **ContextOS Compact:** {"answer": "The security bypass code is 5214-EM.", "decision": "revealed", "confidence": 0.98} (`PASSED`)

### Scenario `scen_201` (entity_disambiguation)
- **Query:** Which John Smith holds the role of VP Sales in Executive Sales for Project #1201?
- **Ground Truth Answer:** `John Smith (john.smith@acme.com) is the VP of Sales in Executive Sales, whereas John Smith Jr. (john.jr@acme.com) is the Sales Associate.`
- **Baseline RAG:** {"answer": "John Smith is a sales team member.", "decision": "ambiguous", "confidence": 0.50} (`FAILED`)
- **ContextOS Full:** {"answer": "John Smith (john.smith@acme.com) is the VP of Sales in Executive Sales, whereas John Smith Jr. (john.jr@acme.com) is the Sales Associate in Field Sales.", "decision": "resolved", "confidence": 0.99} (`PASSED`)
- **ContextOS Compact:** {"answer": "John Smith (john.smith@acme.com) is the VP of Sales in Executive Sales, whereas John Smith Jr. (john.jr@acme.com) is the Sales Associate in Field Sales.", "decision": "resolved", "confidence": 0.99} (`PASSED`)

### Scenario `scen_1` (temporal_conflict)
- **Query:** Is outreach to Initech regarding Project #1001 currently authorized as of 2026-01-14?
- **Ground Truth Answer:** `Yes, legal audit cleared for Initech Project #1001 on 2026-01-14 and outreach is authorized.`
- **Baseline RAG:** {"answer": "Yes, outreach is currently authorized as legal audit cleared.", "decision": "allowed", "confidence": 0.99} (`PASSED`)
- **ContextOS Full:** {"answer": "Yes, outreach is currently authorized as legal audit cleared.", "decision": "allowed", "confidence": 0.99} (`PASSED`)
- **ContextOS Compact:** {"answer": "Yes, outreach is currently authorized as legal audit cleared.", "decision": "allowed", "confidence": 0.99} (`PASSED`)

