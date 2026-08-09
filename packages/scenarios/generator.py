"""
ContextOS — Synthetic Workspace & Scenario Generator
Generates realistic organizational contexts, temporal timelines, entities, and ground truth benchmark tasks.
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
            {"id": "p4", "name": "Elena Rostova", "email": "elena@stark.com", "role": "VP Engineering"}
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
        # Day 1: January Instruction (Do NOT contact Globex)
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

        # Day 30: March Update (Legal cleared; DO contact Globex)
        t_day30 = (start_date + timedelta(days=30)).strftime("%Y-%m-%d %H:%M:%S")
        communications.append({
            "id": "m2",
            "type": "slack",
            "timestamp": t_day30,
            "sender": "sarah@acme.com",
            "channel": "#sales-execs",
            "content": "UPDATE: Legal audit cleared. You are authorized to contact David Wilson at Globex Industries and proceed with Enterprise Deal #104."
        })

        # Day 45: Meeting & Decision
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

    def generate_scenario_tasks(self, workspace: Dict[str, Any]) -> List[Dict[str, Any]]:
        return [
            {
                "task_id": "task_t1",
                "category": "temporal_conflict",
                "query": "Should we contact Globex Industries regarding Enterprise Deal #104 today?",
                "expected_answer": "Yes, legal audit was cleared on Day 30 and contact with David Wilson is authorized.",
                "expected_action": "PERMIT_CONTACT",
                "ground_truth_evidence": ["m2"],
                "difficulty": "Medium"
            },
            {
                "task_id": "task_e1",
                "category": "entity_resolution",
                "query": "Who is the primary relationship owner for Globex Industries?",
                "expected_answer": "John Smith (VP Sales at Acme) owns the Globex relationship and deal negotiations with David Wilson.",
                "expected_action": "IDENTIFY_OWNER",
                "ground_truth_evidence": ["prj1", "m3"],
                "difficulty": "Easy"
            },
            {
                "task_id": "task_m1",
                "category": "missing_information",
                "query": "What is the secret discount code offered to Stark Enterprise?",
                "expected_answer": "I do not have enough information in the workspace context to answer this.",
                "expected_action": "DECLINE_HALLUCINATION",
                "ground_truth_evidence": [],
                "difficulty": "Adversarial"
            }
        ]
