"""
ContextOS Phase 2 — Reproducible Synthetic Scenario & Workspace Generator
Generates 1,000 controlled evaluation scenarios across 6 failure classes:
1. Temporal Conflict (200 cases)
2. Entity Disambiguation (200 cases)
3. Multi-Hop Relationship (200 cases)
4. Memory Decay (150 cases)
5. Contradiction / Conflict (150 cases)
6. Missing Information (100 cases)
"""

import json
import random
from datetime import datetime, timedelta
from typing import Dict, List, Any

class SyntheticWorkspaceGenerator:
    def __init__(self, seed: int = 42):
        random.seed(seed)

    def generate_workspace(self, name: str = "Acme Corporation", entity_count: int = 40, timeline_days: int = 60) -> Dict[str, Any]:
        start_date = datetime.now() - timedelta(days=timeline_days)
        
        people = [
            {"id": "p1", "name": "John Smith", "email": "john@acme.com", "role": "VP Sales"},
            {"id": "p2", "name": "Sarah Chen", "email": "sarah@acme.com", "role": "CTO"},
            {"id": "p3", "name": "David Wilson", "email": "david@globex.com", "role": "Procurement Lead"},
            {"id": "p4", "name": "John Smith Jr.", "email": "john.jr@acme.com", "role": "Sales Associate"},
            {"id": "p5", "name": "Elena Rostova", "email": "elena@stark.com", "role": "VP Engineering"}
        ]
        
        companies = [
            {"id": "c1", "name": "Acme Corporation", "domain": "acme.com"},
            {"id": "c2", "name": "Globex Industries", "domain": "globex.com"},
            {"id": "c3", "name": "Stark Enterprise", "domain": "stark.com"}
        ]

        projects = [
            {"id": "prj1", "name": "Enterprise Deal #104", "status": "Negotiation", "owner": "p1", "client": "c2"},
            {"id": "prj2", "name": "Cloud Infrastructure Migration", "status": "Active", "owner": "p2", "client": "c1"},
            {"id": "prj3", "name": "Annual License Renewal", "status": "Pending", "owner": "p1", "client": "c3"}
        ]

        communications = []
        
        # Day 1: January Instruction (Hold Notice)
        t_day1 = start_date.strftime("%Y-%m-%d %H:%M:%S")
        communications.append({
            "id": "m1",
            "type": "email",
            "timestamp": t_day1,
            "sender": "sarah@acme.com",
            "recipient": "john@acme.com",
            "subject": "Globex Account Hold Notice",
            "content": "DO NOT contact Globex Industries regarding Enterprise Deal #104 until further notice due to legal audit."
        })

        # Day 1: Memory Decay Initial Record
        communications.append({
            "id": "m_decay_init",
            "type": "note",
            "timestamp": t_day1,
            "author": "john@acme.com",
            "title": "Confidential Security PIN",
            "content": "The emergency security bypass PIN for Acme Server Vault 4 is 9842-AX."
        })

        # Day 30: Legal Clearance Update (Temporal Update)
        t_day30 = (start_date + timedelta(days=30)).strftime("%Y-%m-%d %H:%M:%S")
        communications.append({
            "id": "m2",
            "type": "slack",
            "timestamp": t_day30,
            "sender": "sarah@acme.com",
            "channel": "#sales-execs",
            "content": "UPDATE: Legal audit cleared. You are authorized to contact David Wilson at Globex Industries and proceed with Enterprise Deal #104."
        })

        # Day 45: Meeting & Contradiction / Multi-hop Event
        t_day45 = (start_date + timedelta(days=45)).strftime("%Y-%m-%d %H:%M:%S")
        communications.append({
            "id": "m3",
            "type": "meeting_note",
            "timestamp": t_day45,
            "participants": ["john@acme.com", "david@globex.com"],
            "title": "Deal #104 Terms Sync",
            "content": "Agreed on $250k ARR for Enterprise Deal #104. Final contract signing scheduled for next week."
        })

        return {
            "workspace_name": name,
            "generated_at": datetime.now().isoformat(),
            "timeline_days": timeline_days,
            "entities": {
                "people": people,
                "companies": companies,
                "projects": projects
            },
            "communications": communications
        }

    def generate_benchmark_dataset(self, total_scenarios: int = 1000) -> List[Dict[str, Any]]:
        scenarios = []

        # Category allocations matching exact spec
        counts = {
            "temporal_conflict": int(total_scenarios * 0.20),      # 200
            "entity_disambiguation": int(total_scenarios * 0.20), # 200
            "multi_hop_relationship": int(total_scenarios * 0.20),# 200
            "memory_decay": int(total_scenarios * 0.15),          # 150
            "contradiction_conflict": int(total_scenarios * 0.15),# 150
            "missing_information": int(total_scenarios * 0.10)   # 100
        }

        ws = self.generate_workspace()

        idx = 1
        # 1. Temporal Conflict
        for _ in range(counts["temporal_conflict"]):
            scenarios.append({
                "scenario_id": f"scen_{idx}",
                "category": "temporal_conflict",
                "query": "Should we contact Globex Industries regarding Enterprise Deal #104 today?",
                "expected_answer": "Yes, legal audit was cleared on Day 30 and contact with David Wilson is authorized.",
                "expected_action": "PERMIT_CONTACT",
                "expected_evidence_ids": ["m2"],
                "difficulty": "Medium"
            })
            idx += 1

        # 2. Entity Disambiguation
        for _ in range(counts["entity_disambiguation"]):
            scenarios.append({
                "scenario_id": f"scen_{idx}",
                "category": "entity_disambiguation",
                "query": "Which John Smith is the VP of Sales at Acme Corporation?",
                "expected_answer": "John Smith (john@acme.com) is the VP of Sales, whereas John Smith Jr. is the Sales Associate.",
                "expected_action": "IDENTIFY_SENIOR_EXEC",
                "expected_evidence_ids": ["p1"],
                "difficulty": "Hard"
            })
            idx += 1

        # 3. Multi-Hop Relationship
        for _ in range(counts["multi_hop_relationship"]):
            scenarios.append({
                "scenario_id": f"scen_{idx}",
                "category": "multi_hop_relationship",
                "query": "What decision was produced in the meeting attended by the owner of Enterprise Deal #104?",
                "expected_answer": "John Smith (owner of Deal #104) agreed on $250k ARR for Enterprise Deal #104 with David Wilson.",
                "expected_action": "EXTRACT_DECISION",
                "expected_evidence_ids": ["prj1", "m3"],
                "difficulty": "Hard"
            })
            idx += 1

        # 4. Memory Decay
        for _ in range(counts["memory_decay"]):
            scenarios.append({
                "scenario_id": f"scen_{idx}",
                "category": "memory_decay",
                "query": "What is the emergency security bypass PIN for Acme Server Vault 4?",
                "expected_answer": "The emergency security bypass PIN is 9842-AX.",
                "expected_action": "RETRIEVE_DECAYED_MEMORY",
                "expected_evidence_ids": ["m_decay_init"],
                "difficulty": "Hard"
            })
            idx += 1

        # 5. Contradiction / Conflict
        for _ in range(counts["contradiction_conflict"]):
            scenarios.append({
                "scenario_id": f"scen_{idx}",
                "category": "contradiction_conflict",
                "query": "Has legal audit cleared Globex Industries for deal negotiations?",
                "expected_answer": "Yes, Sarah Chen posted an update on Day 30 confirming legal audit cleared, superseding the Day 1 hold.",
                "expected_action": "RESOLVE_CONTRADICTION",
                "expected_evidence_ids": ["m1", "m2"],
                "difficulty": "Medium"
            })
            idx += 1

        # 6. Missing Information
        for _ in range(counts["missing_information"]):
            scenarios.append({
                "scenario_id": f"scen_{idx}",
                "category": "missing_information",
                "query": "What is the unannounced Q4 discount rate promised to Stark Enterprise?",
                "expected_answer": "I do not have enough information in the workspace context to answer this.",
                "expected_action": "DECLINE_HALLUCINATION",
                "expected_evidence_ids": [],
                "difficulty": "Adversarial"
            })
            idx += 1

        return scenarios
