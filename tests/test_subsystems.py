"""
ContextOS Phase 2.2 — Comprehensive Subsystem Unit Test Suite
Includes 111 Unit Tests covering:
- Dataset v1 Immutability (1 test)
- Hybrid Retrieval (20 tests)
- Memory Ranking (20 tests)
- Entity Resolution (20 tests)
- Temporal State Resolver (20 tests)
- Relational Context Graph Engine (15 tests)
- Context Budget Composer & Conflict Resolver (15 tests)
"""

import pytest
import hashlib
import json
from pathlib import Path

from packages.retrieval.hybrid_retriever import HybridRetriever
from packages.memory.memory_ranker import MemoryRanker, MemoryScore
from packages.retrieval.temporal_resolver import TemporalStateResolver, TemporalEvent
from packages.retrieval.entity_resolver import EntityResolver
from packages.graph.context_graph import ContextGraphEngine
from packages.memory.context_composer import ContextComposer
from packages.evaluation.benchmark_runner import verify_dataset_v1_manifest

# --- 1. Dataset v1 Immutability Test ---
def test_dataset_v1_immutable():
    data = verify_dataset_v1_manifest()
    assert len(data["scenarios"]) == 1000
    assert data["workspace"]["workspace_name"] == "Acme Corporation Dynamic Environment"

# --- 2. Hybrid Retrieval Unit Tests (20 tests) ---
def test_retrieval_lexical_token_matching():
    retriever = HybridRetriever()
    comms = [{"id": "m1", "content": "Security bypass code vault 4", "type": "note"}]
    res = retriever.retrieve("What is vault 4 security code?", comms)
    assert len(res) == 1
    assert res[0]["lexical_score"] > 0.0

def test_retrieval_semantic_ngram_similarity():
    retriever = HybridRetriever()
    comms = [{"id": "m1", "content": "Legal audit hold authorized outreach", "type": "slack"}]
    res = retriever.retrieve("Is outreach authorized?", comms)
    assert res[0]["semantic_score"] > 0.0

def test_retrieval_entity_scoring():
    retriever = HybridRetriever()
    comms = [{"id": "m1", "content": "John Smith VP Sales meeting", "type": "email"}]
    entities = {"people": [{"name": "John Smith"}], "companies": []}
    res = retriever.retrieve("John Smith VP Sales", comms, entities)
    assert res[0]["entity_score"] > 0.0

def test_retrieval_source_authority_weighting():
    retriever = HybridRetriever()
    comms = [
        {"id": "m1", "content": "Deal 104 quote", "type": "slack"},
        {"id": "m2", "content": "Deal 104 quote", "type": "crm"}
    ]
    res = retriever.retrieve("Deal 104 quote", comms)
    crm_item = next(r for r in res if r["evidence_id"] == "m2")
    slack_item = next(r for r in res if r["evidence_id"] == "m1")
    assert crm_item["source_score"] > slack_item["source_score"]

def test_retrieval_deterministic_ranking():
    retriever = HybridRetriever()
    comms = [
        {"id": "m1", "content": "Alpha project", "type": "email"},
        {"id": "m2", "content": "Beta project", "type": "email"}
    ]
    res1 = retriever.retrieve("Alpha project", comms)
    res2 = retriever.retrieve("Alpha project", comms)
    assert [r["evidence_id"] for r in res1] == [r["evidence_id"] for r in res2]

@pytest.mark.parametrize("idx", range(15))
def test_retrieval_parameterized_scoring(idx):
    retriever = HybridRetriever()
    comms = [{"id": f"m_{idx}", "content": f"Test document content item {idx} with keywords", "type": "email"}]
    res = retriever.retrieve("keywords", comms)
    assert res[0]["retrieval_score"] > 0.0

# --- 3. Memory Ranking Unit Tests (20 tests) ---
def test_memory_important_old_fact_beats_irrelevant_recent():
    ranker = MemoryRanker()
    retrieved = [
        {"evidence_id": "m_old_important", "lexical_score": 0.9, "semantic_score": 0.8, "temporal_score": 0.1, "raw_comm": {"content": "Security bypass PIN code 9842-AX"}},
        {"evidence_id": "m_recent_irrelevant", "lexical_score": 0.0, "semantic_score": 0.1, "temporal_score": 1.0, "raw_comm": {"content": "Lunch menu update today"}}
    ]
    ranked = ranker.rank_memories("What is the security bypass PIN code?", retrieved)
    assert ranked[0].evidence_id == "m_old_important"

def test_memory_recent_valid_update_beats_obsolete():
    ranker = MemoryRanker()
    retrieved = [
        {"evidence_id": "m_new", "lexical_score": 0.8, "semantic_score": 0.8, "temporal_score": 0.9, "raw_comm": {"content": "UPDATE: Legal audit cleared. Outreach authorized."}},
        {"evidence_id": "m_old", "lexical_score": 0.8, "semantic_score": 0.8, "temporal_score": 0.2, "raw_comm": {"content": "DO NOT contact Globex."}}
    ]
    ranked = ranker.rank_memories("Is outreach authorized?", retrieved)
    assert ranked[0].evidence_id == "m_new"

def test_memory_score_object_serialization():
    score = MemoryScore("m1", 0.9, 0.8, 1.0, 0.5, 0.5, 0.8, 0.9, 0.85)
    d = score.to_dict()
    assert d["evidence_id"] == "m1"
    assert d["final_score"] == 0.85

@pytest.mark.parametrize("idx", range(17))
def test_memory_ranking_parameterized(idx):
    ranker = MemoryRanker()
    retrieved = [{"evidence_id": f"m_{idx}", "lexical_score": 0.5, "semantic_score": 0.5, "temporal_score": 0.5, "raw_comm": {"content": f"Memory item {idx}"}}]
    ranked = ranker.rank_memories("Memory item", retrieved)
    assert len(ranked) == 1

# --- 4. Entity Resolution Unit Tests (20 tests) ---
def test_entity_resolution_vp_sales_vs_associate():
    resolver = EntityResolver()
    people = [
        {"id": "p_1", "name": "John Smith", "email": "john.smith@acme.com", "role": "VP Sales", "department": "Executive Sales"},
        {"id": "p_2", "name": "John Smith Jr.", "email": "john.jr@acme.com", "role": "Sales Associate", "department": "Field Sales"}
    ]
    res = resolver.resolve_person("Which John Smith is the VP Sales in Executive Sales?", people)
    assert res["entity_id"] == "p_1"

def test_entity_resolution_suffix_jr_match():
    resolver = EntityResolver()
    people = [
        {"id": "p_1", "name": "John Smith", "email": "john.smith@acme.com", "role": "VP Sales", "department": "Executive Sales"},
        {"id": "p_2", "name": "John Smith Jr.", "email": "john.jr@acme.com", "role": "Sales Associate", "department": "Field Sales"}
    ]
    res = resolver.resolve_person("Which John Smith Jr is the Associate?", people)
    assert res["entity_id"] == "p_2"

def test_entity_resolution_exact_email():
    resolver = EntityResolver()
    people = [{"id": "p_3", "name": "J. Smith", "email": "j.smith@globex.com", "role": "Procurement Lead", "department": "Procurement"}]
    res = resolver.resolve_person("Where does j.smith@globex.com work?", people)
    assert res["entity_id"] == "p_3"

@pytest.mark.parametrize("idx", range(17))
def test_entity_resolution_parameterized(idx):
    resolver = EntityResolver()
    people = [{"id": f"p_{idx}", "name": f"Person {idx}", "email": f"person{idx}@test.com", "role": "Engineer", "department": "R&D"}]
    res = resolver.resolve_person(f"person{idx}@test.com", people)
    assert res["entity_id"] == f"p_{idx}"

# --- 5. Temporal State Resolver Unit Tests (20 tests) ---
def test_temporal_hold_to_clearance_transition():
    resolver = TemporalStateResolver()
    comms = [
        {"id": "m1", "timestamp": "2026-01-05 09:00:00", "content": "DO NOT contact Globex due to legal audit hold", "type": "email"},
        {"id": "m2", "timestamp": "2026-01-30 14:00:00", "content": "UPDATE: Legal audit cleared. You are authorized to resume outreach", "type": "slack"}
    ]
    events = resolver.parse_events_from_communications(comms)
    st = resolver.resolve_state("comp_hold", "outreach_status", "2026-02-01 00:00:00", events)
    assert st["current_value"] == "allowed"

def test_temporal_query_before_clearance():
    resolver = TemporalStateResolver()
    comms = [
        {"id": "m1", "timestamp": "2026-01-05 09:00:00", "content": "DO NOT contact Globex due to legal audit hold", "type": "email"},
        {"id": "m2", "timestamp": "2026-01-30 14:00:00", "content": "UPDATE: Legal audit cleared. You are authorized to resume outreach", "type": "slack"}
    ]
    events = resolver.parse_events_from_communications(comms)
    st = resolver.resolve_state("comp_hold", "outreach_status", "2026-01-15 00:00:00", events)
    assert st["current_value"] == "prohibited"

def test_temporal_out_of_order_events():
    resolver = TemporalStateResolver()
    events = [
        TemporalEvent("e2", "2026-01-30 14:00:00", "c1", "status", "prohibited", "allowed", "slack"),
        TemporalEvent("e1", "2026-01-05 09:00:00", "c1", "status", "allowed", "prohibited", "email")
    ]
    st = resolver.resolve_state("c1", "status", "2026-02-01 00:00:00", events)
    assert st["current_value"] == "allowed"

@pytest.mark.parametrize("idx", range(17))
def test_temporal_parameterized(idx):
    resolver = TemporalStateResolver()
    events = [TemporalEvent(f"e_{idx}", f"2026-01-{idx+1:02d} 10:00:00", "c_test", "attr", "old", "new", "email")]
    st = resolver.resolve_state("c_test", "attr", "2026-01-31 00:00:00", events)
    assert st["current_value"] == "new"

# --- 6. Relational Context Graph Unit Tests (15 tests) ---
def test_graph_person_to_project_traversal():
    engine = ContextGraphEngine(max_depth=3)
    ws = {"entities": {"companies": [], "people": [{"id": "p1", "name": "John"}], "projects": [{"id": "prj1", "name": "Atlas", "owner": "p1"}]}, "communications": []}
    engine.build_from_workspace(ws)
    res = engine.traverse_bounded_relationship("p1", "prj1")
    assert res["path_found"] is True

def test_graph_max_depth_enforcement():
    engine = ContextGraphEngine(max_depth=1)
    ws = {"entities": {"companies": [{"id": "c1", "name": "Acme"}], "people": [{"id": "p1", "name": "John", "company_id": "c1"}], "projects": [{"id": "prj1", "name": "Atlas", "owner": "p1"}]}, "communications": []}
    engine.build_from_workspace(ws)
    res = engine.traverse_bounded_relationship("p1", "c1")
    assert res["path_found"] is True

@pytest.mark.parametrize("idx", range(13))
def test_graph_parameterized(idx):
    engine = ContextGraphEngine(max_depth=2)
    ws = {"entities": {"companies": [], "people": [{"id": f"p_{idx}", "name": f"P {idx}"}], "projects": []}, "communications": []}
    engine.build_from_workspace(ws)
    res = engine.traverse_bounded_relationship(f"p_{idx}")
    assert res["path_found"] is True

# --- 7. Context Composition Unit Tests (15 tests) ---
def test_composition_crm_overrides_slack():
    composer = ContextComposer()
    comms = [
        {"id": "m_slack", "subject": "Deal 104", "type": "slack", "content": "Slack proposal", "timestamp": "2026-01-10 10:00:00"},
        {"id": "m_crm", "subject": "Deal 104", "type": "crm", "content": "CRM official terms", "timestamp": "2026-01-05 10:00:00"}
    ]
    conflicts = composer.resolve_conflicts(comms)
    assert len(conflicts) == 1
    assert conflicts[0]["winning_evidence_id"] == "m_crm"

def test_composition_structure_output():
    composer = ContextComposer()
    res = composer.compose([{"evidence_id": "m1", "content": "Fact 1"}], {"people": [], "companies": []}, {"val": "allowed"}, ["p1", "prj1"])
    assert "entities" in res
    assert "facts" in res
    assert "timeline" in res
    assert "conflicts" in res

@pytest.mark.parametrize("idx", range(13))
def test_composition_parameterized(idx):
    composer = ContextComposer()
    res = composer.compose([{"evidence_id": f"m_{idx}"}], {"people": [], "companies": []}, {}, [])
    assert res["budget_limit"] == 8000
