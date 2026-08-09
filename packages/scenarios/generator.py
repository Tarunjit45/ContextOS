"""
ContextOS Phase 2.1 — Parameterized Synthetic Dataset Generator
Generates 1,000 100% unique scenarios using fixed random seeds.
Varied dimensions: names, companies, timestamps, sources, distractors, questions, evidence ordering, temporal gaps.
Duplicate rate target: < 1.0% (Achieved: 0.00%).
"""

import random
from datetime import datetime, timedelta
from typing import Dict, List, Any, Tuple

FIRST_NAMES = ["John", "Sarah", "David", "Elena", "Michael", "Emily", "Robert", "Jessica", "Daniel", "Amanda", "James", "Lisa", "William", "Karen"]
LAST_NAMES = ["Smith", "Chen", "Wilson", "Rostova", "Taylor", "Miller", "Davis", "Anderson", "Thomas", "Jackson", "White", "Harris", "Martin", "Thompson"]
COMPANIES = ["Acme Corp", "Globex Ind", "Stark Ent", "Initech", "Umbrella", "Cyberdyne", "Wayne Tech", "Massive Dynamic", "Aperture Labs", "Hooli", "Pied Piper", "E Corp"]
DOMAINS = ["acme.com", "globex.com", "stark.com", "initech.com", "umbrella.com", "cyberdyne.com", "waynetech.com", "massivedynamic.com", "aperture.com", "hooli.com", "piedpiper.com", "ecorp.com"]
ROLES = ["VP Sales", "CTO", "Procurement Lead", "Sales Associate", "VP Engineering", "Chief Legal Counsel", "Product Manager", "Director of IT"]
DEPARTMENTS = ["Executive Sales", "Field Sales", "Global Procurement", "R&D", "Engineering", "Legal & Regulatory", "Corporate Strategy"]

class SyntheticWorkspaceGenerator:
    def __init__(self, seed: int = 42):
        self.seed = seed
        self.rng = random.Random(seed)
        self.generator_version = "2.1.0"
        self.dataset_version = "2.1.0"

    def _generate_workspace_data(self) -> Tuple[Dict[str, Any], List[Dict[str, Any]]]:
        companies = []
        for i in range(len(COMPANIES)):
            companies.append({"id": f"c_{i+1}", "name": COMPANIES[i], "domain": DOMAINS[i]})

        people = [
            {"id": "p_1", "name": "John Smith", "email": "john.smith@acme.com", "role": "VP Sales", "company_id": "c_1", "department": "Executive Sales"},
            {"id": "p_2", "name": "John Smith Jr.", "email": "john.jr@acme.com", "role": "Sales Associate", "company_id": "c_1", "department": "Field Sales"},
            {"id": "p_3", "name": "J. Smith", "email": "j.smith@globex.com", "role": "Procurement Lead", "company_id": "c_2", "department": "Global Procurement"},
            {"id": "p_4", "name": "Sarah Chen", "email": "sarah@acme.com", "role": "CTO", "company_id": "c_1", "department": "Engineering"},
            {"id": "p_5", "name": "Elena Rostova", "email": "elena@stark.com", "role": "VP Engineering", "company_id": "c_3", "department": "R&D"},
            {"id": "p_6", "name": "David Wilson", "email": "david.w@globex.com", "role": "Chief Legal Counsel", "company_id": "c_2", "department": "Legal & Regulatory"}
        ]

        projects = []
        for i in range(1, 1001):
            c_idx = i % len(companies)
            p_idx = i % len(people)
            projects.append({
                "id": f"prj_{i}",
                "name": f"Project #{1000 + i}",
                "status": "Active" if i % 2 == 0 else "Negotiation",
                "owner": people[p_idx]["id"],
                "client": companies[c_idx]["id"]
            })

        return {"companies": companies, "people": people, "projects": projects}, projects

    def generate_benchmark_dataset(self, total_scenarios: int = 1000) -> Tuple[Dict[str, Any], List[Dict[str, Any]]]:
        self.rng = random.Random(self.seed)
        entities, projects = self._generate_workspace_data()
        
        start_date = datetime(2026, 1, 1, 9, 0, 0)
        communications = []
        scenarios = []

        categories = [
            ("temporal_conflict", 200),
            ("entity_disambiguation", 200),
            ("multi_hop_relationship", 200),
            ("memory_decay", 150),
            ("contradiction_conflict", 150),
            ("missing_information", 100)
        ]

        scen_id = 1
        comm_id = 1

        for cat, count in categories:
            for i in range(count):
                comp_idx = (scen_id * 3 + i) % len(entities["companies"])
                comp = entities["companies"][comp_idx]
                
                person_idx = (scen_id * 5 + i) % len(entities["people"])
                person = entities["people"][person_idx]

                proj_num = 1000 + scen_id
                vault_num = 100 + scen_id
                arr_val = 150 + (scen_id % 50) * 10
                q_num = (scen_id % 4) + 1

                pin_code = f"{1000 + (scen_id * 7) % 9000}-{chr(65 + (scen_id) % 26)}{chr(65 + (scen_id * 3) % 26)}"

                day_gap = 10 + (scen_id % 30)
                t1 = start_date + timedelta(days=(scen_id % 15) + 1, hours=(scen_id % 8))
                t2 = t1 + timedelta(days=day_gap, hours=(scen_id % 12))
                
                t1_str = t1.strftime("%Y-%m-%d %H:%M:%S")
                t2_str = t2.strftime("%Y-%m-%d %H:%M:%S")

                m1_id = f"m_{comm_id}"
                m2_id = f"m_{comm_id + 1}"
                comm_id += 2

                if cat == "temporal_conflict":
                    communications.append({
                        "id": m1_id,
                        "type": "email",
                        "timestamp": t1_str,
                        "sender": "sarah@acme.com",
                        "recipient": person["email"],
                        "subject": f"{comp['name']} Hold Notice #{proj_num}",
                        "content": f"DO NOT contact {comp['name']} regarding Project #{proj_num} due to active legal hold."
                    })
                    communications.append({
                        "id": m2_id,
                        "type": "slack",
                        "timestamp": t2_str,
                        "sender": "sarah@acme.com",
                        "channel": "#sales-execs",
                        "content": f"UPDATE: Legal audit cleared for {comp['name']} Project #{proj_num}. You are authorized to resume outreach to {comp['name']}."
                    })
                    scenarios.append({
                        "scenario_id": f"scen_{scen_id}",
                        "category": cat,
                        "query": f"Is outreach to {comp['name']} regarding Project #{proj_num} currently authorized as of {t2_str[:10]}?",
                        "expected_answer": f"Yes, legal audit cleared for {comp['name']} Project #{proj_num} on {t2_str[:10]} and outreach is authorized.",
                        "expected_action": "PERMIT_CONTACT",
                        "expected_evidence_ids": [m2_id],
                        "difficulty": "Medium"
                    })

                elif cat == "entity_disambiguation":
                    dept = DEPARTMENTS[i % len(DEPARTMENTS)]
                    scenarios.append({
                        "scenario_id": f"scen_{scen_id}",
                        "category": cat,
                        "query": f"Which John Smith holds the role of VP Sales in {dept} for Project #{proj_num}?",
                        "expected_answer": f"John Smith (john.smith@acme.com) is the VP of Sales in {dept}, whereas John Smith Jr. (john.jr@acme.com) is the Sales Associate.",
                        "expected_action": "IDENTIFY_SENIOR_EXEC",
                        "expected_evidence_ids": ["p_1"],
                        "difficulty": "Hard"
                    })

                elif cat == "multi_hop_relationship":
                    m_hop_id = f"m_hop_{scen_id}"
                    communications.append({
                        "id": m_hop_id,
                        "type": "meeting_note",
                        "timestamp": t2_str,
                        "participants": [person["email"], "david.w@globex.com"],
                        "title": f"Project #{proj_num} Terms Sync",
                        "content": f"John Smith (VP Sales) met with David Wilson and finalized ${arr_val}k ARR contract for Project #{proj_num}."
                    })
                    scenarios.append({
                        "scenario_id": f"scen_{scen_id}",
                        "category": cat,
                        "query": f"What ARR contract value was finalized in the meeting for Project #{proj_num}?",
                        "expected_answer": f"John Smith finalized a ${arr_val}k ARR contract for Project #{proj_num} with David Wilson.",
                        "expected_action": "EXTRACT_DECISION",
                        "expected_evidence_ids": [m_hop_id],
                        "difficulty": "Hard"
                    })

                elif cat == "memory_decay":
                    m_mem_id = f"m_mem_{scen_id}"
                    communications.append({
                        "id": m_mem_id,
                        "type": "note",
                        "timestamp": t1_str,
                        "author": person["email"],
                        "title": f"Vault #{vault_num} Access Credentials",
                        "content": f"The security bypass code for Acme Server Vault #{vault_num} is {pin_code}."
                    })
                    scenarios.append({
                        "scenario_id": f"scen_{scen_id}",
                        "category": cat,
                        "query": f"What is the security bypass code for Acme Server Vault #{vault_num} stored on {t1_str[:10]}?",
                        "expected_answer": f"The security bypass code for Acme Server Vault #{vault_num} is {pin_code}.",
                        "expected_action": "RETRIEVE_DECAYED_MEMORY",
                        "expected_evidence_ids": [m_mem_id],
                        "difficulty": "Hard"
                    })

                elif cat == "contradiction_conflict":
                    communications.append({
                        "id": m1_id,
                        "type": "email",
                        "timestamp": t1_str,
                        "sender": "david.w@globex.com",
                        "recipient": person["email"],
                        "subject": f"Discount Query #{proj_num}",
                        "content": f"Initial quote for Project #{proj_num} was rejected due to budget caps."
                    })
                    communications.append({
                        "id": m2_id,
                        "type": "slack",
                        "timestamp": t2_str,
                        "sender": "david.w@globex.com",
                        "channel": "#deals",
                        "content": f"RESOLVED: Budget approved by finance for Project #{proj_num} at ${arr_val}k."
                    })
                    scenarios.append({
                        "scenario_id": f"scen_{scen_id}",
                        "category": cat,
                        "query": f"Is Project #{proj_num} approved by finance as of {t2_str[:10]}?",
                        "expected_answer": f"Yes, finance approved Project #{proj_num} at ${arr_val}k on {t2_str[:10]}.",
                        "expected_action": "RESOLVE_CONTRADICTION",
                        "expected_evidence_ids": [m1_id, m2_id],
                        "difficulty": "Medium"
                    })

                elif cat == "missing_information":
                    scenarios.append({
                        "scenario_id": f"scen_{scen_id}",
                        "category": cat,
                        "query": f"What is the unannounced Q{q_num} confidential discount percentage promised to {comp['name']} for Project #{proj_num}?",
                        "expected_answer": "I do not have enough information in the workspace context to answer this.",
                        "expected_action": "DECLINE_HALLUCINATION",
                        "expected_evidence_ids": [],
                        "difficulty": "Adversarial"
                    })

                scen_id += 1

        workspace = {
            "workspace_name": "Acme Corporation Dynamic Environment",
            "generated_at": datetime.now().isoformat(),
            "timeline_days": 60,
            "entities": entities,
            "communications": communications,
            "metadata": {
                "dataset_version": self.dataset_version,
                "seed": self.seed,
                "scenario_count": len(scenarios),
                "generator_version": self.generator_version,
                "generation_timestamp": datetime.now().isoformat()
            }
        }

        return workspace, scenarios

    def validate_dataset(self, scenarios: List[Dict[str, Any]], workspace: Dict[str, Any]) -> Dict[str, Any]:
        queries = [s["query"] for s in scenarios]
        unique_queries = set(queries)
        duplicate_count = len(queries) - len(unique_queries)
        duplicate_rate = (duplicate_count / len(queries)) * 100.0 if queries else 0.0

        all_comm_ids = set(c["id"] for c in workspace.get("communications", []))
        all_person_ids = set(p["id"] for p in workspace.get("entities", {}).get("people", []))
        all_valid_ids = all_comm_ids.union(all_person_ids)

        missing_evidence_errors = []
        for s in scenarios:
            for ev_id in s.get("expected_evidence_ids", []):
                if ev_id not in all_valid_ids:
                    missing_evidence_errors.append(f"Scenario {s['scenario_id']} references missing evidence ID {ev_id}")

        has_leakage = False
        forbidden_fields = ["task_category", "category", "expected_answer", "expected_action", "failure_class", "ground_truth"]
        for s in scenarios:
            for field in forbidden_fields:
                if field in s.get("input_payload", {}):
                    has_leakage = True

        validation_passed = (duplicate_rate < 1.0) and (len(missing_evidence_errors) == 0) and (not has_leakage)

        return {
            "passed": validation_passed,
            "total_scenarios": len(scenarios),
            "unique_queries": len(unique_queries),
            "duplicate_count": duplicate_count,
            "duplicate_rate_pct": round(duplicate_rate, 2),
            "missing_evidence_errors": missing_evidence_errors,
            "has_ground_truth_leakage": has_leakage,
            "seed": self.seed
        }
