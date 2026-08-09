import json

with open("scratch_audit_samples.json", "r") as f:
    data = json.load(f)

for i, sample in enumerate(data, 1):
    s = sample["scenario"]
    b = sample["baseline"]
    c = sample["contextos"]
    print(f"=== SAMPLE #{i}: [{s['scenario_id']} | Category: {s['category']}] ===")
    print(f"Query: {s['query']}")
    print(f"Ground Truth Answer: {s['expected_answer']}")
    print(f"Ground Truth Action: {s['expected_action']}")
    print(f"Ground Truth Evidence IDs: {s['expected_evidence_ids']}")
    print(f"Baseline Retrieved Evidence: {b['out']['retrieved_evidence']}")
    print(f"Baseline Answer: {b['out']['response']}")
    print(f"Baseline Evaluator Status: {b['eval']['status']} | Failure Class: {b['eval']['failure_class']}")
    print(f"ContextOS Retrieved Evidence: {c['out']['retrieved_evidence']}")
    print(f"ContextOS Answer: {c['out']['response']}")
    print(f"ContextOS Evaluator Status: {c['eval']['status']} | Failure Class: {c['eval']['failure_class']}")
    print("=" * 80)
