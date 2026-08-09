"""
ContextOS Phase 3.3 — Decision-Grade Context Compiler Unit Test Suite
Tests Entity Resolution, Temporal Reasoning, Conflict Resolution, Context Compilation, Answerability, and Provenance.
"""

import pytest
from packages.retrieval.entity_resolver import EntityResolver
from packages.retrieval.temporal_resolver import TemporalStateResolver, TemporalEvent
from packages.context.context_compiler import DecisionGradeContextCompiler

# --- 1. Entity Resolver Tests ---
def test_entity_resolution_suffix_jr_disambiguation():
    resolver = EntityResolver()
    people = [
        {"id": "p_1", "name": "John Smith", "email": "john.smith@acme.com", "role": "VP Sales", "department": "Executive Sales"},
        {"id": "p_2", "name": "John Smith Jr.", "email": "john.jr@acme.com", "role": "Sales Associate", "department": "Field Sales"}
    ]

    # Query specifically asking for VP Sales
    res_vp = resolver.resolve_person("Which John Smith is in executive sales and what is his email?", people)
    assert res_vp["canonical_entity_id"] == "p_1"
    assert res_vp["name"] == "John Smith"
    assert res_vp["is_ambiguous"] is False

    # Query specifically asking for Jr.
    res_jr = resolver.resolve_person("What is the email for John Smith Jr.?", people)
    assert res_jr["canonical_entity_id"] == "p_2"
    assert res_jr["name"] == "John Smith Jr."

def test_entity_resolution_ambiguity_detection():
    resolver = EntityResolver()
    people = [
        {"id": "p_1", "name": "John Smith", "email": "john1@acme.com", "role": "Manager", "department": "Sales"},
        {"id": "p_2", "name": "John Smith", "email": "john2@acme.com", "role": "Manager", "department": "Sales"}
    ]
    res = resolver.resolve_person("Tell me about John Smith", people)
    assert res["is_ambiguous"] is True
    assert len(res["alternatives"]) > 0

# --- 2. Temporal Resolver Tests ---
def test_temporal_state_superseded_events():
    resolver = TemporalStateResolver()
    comms = [
        {"id": "m1", "timestamp": "2026-01-10 10:00:00", "content": "Hold notice: do not contact Initech", "type": "note"},
        {"id": "m2", "timestamp": "2026-03-04 14:00:00", "content": "UPDATE: Legal audit cleared for Initech. Authorized to resume outreach", "type": "slack"}
    ]
    events = resolver.parse_events_from_communications(comms)
    state = resolver.resolve_state("comp_hold", "outreach_status", "2026-03-05 00:00:00", events)
    assert state["current_value"] == "allowed"
    assert "m1" in state["superseded_events"]
    assert state["active_event"] == "m2"

# --- 3. Conflict Resolution Tests ---
def test_conflict_detection_and_resolution():
    compiler = DecisionGradeContextCompiler()
    items = [
        {"id": "c1", "content": "Legal audit cleared. Authorized to resume outreach.", "type": "slack", "timestamp": "2026-03-04 10:00:00"},
        {"id": "c2", "content": "Hold notice: do not contact client.", "type": "note", "timestamp": "2026-01-12 10:00:00"}
    ]
    ranked = compiler.rank_evidence("Is outreach authorized?", items, {})
    conflict = compiler.detect_conflicts(ranked)
    assert conflict["conflict_detected"] is True
    assert conflict["resolution"] == "Outreach Authorized"
    assert "c1" in conflict["winning_evidence"]
    assert "c2" in conflict["superseded_evidence"]

# --- 4. Context Compiler Tests ---
def test_context_compiler_sufficient_mode():
    compiler = DecisionGradeContextCompiler(default_token_budget=1024)
    query = "What is the security bypass code for vault 4?"
    evidence = [
        {"id": "m1", "content": "Security bypass code for vault 4 is 9842-AX.", "type": "note", "timestamp": "2026-01-05 09:00:00"}
    ]
    entities = {"people": []}
    resolved = {"canonical_entity_id": "p_1", "name": "Admin", "is_ambiguous": False}
    state = {"current_value": "allowed", "valid_as_of": "2026-01-30"}

    compiled = compiler.compile(query, evidence, entities, resolved, state)
    assert compiled["answerability"] == "SUFFICIENT"
    assert compiled["confidence"] > 0.9
    assert "[EVIDENCE PROVENANCE]" in compiled["compiled_context_text"]
    assert "9842-AX" in compiled["compiled_context_text"]
    assert compiled["telemetry"]["selected_evidence_after"] == 1

def test_context_compiler_insufficient_mode():
    compiler = DecisionGradeContextCompiler()
    query = "What is the secret unannounced merger terms?"
    evidence = []
    compiled = compiler.compile(query, evidence, {"people": []}, {}, {})
    assert compiled["answerability"] == "INSUFFICIENT"
    assert compiled["confidence"] > 0.9

def test_context_compiler_ambiguous_mode():
    compiler = DecisionGradeContextCompiler()
    query = "Who is John Smith?"
    evidence = [{"id": "m1", "content": "John Smith joined sales.", "type": "email", "timestamp": "2026-01-01"}]
    resolved = {"name": "John Smith", "is_ambiguous": True}
    compiled = compiler.compile(query, evidence, {"people": []}, resolved, {})
    assert compiled["answerability"] == "AMBIGUOUS"

def test_context_compiler_token_budget_enforcement():
    compiler = DecisionGradeContextCompiler(default_token_budget=50) # Tight evidence budget
    query = "Summarize project details"
    evidence = [
        {"id": f"m_{i}", "content": "A" * 200, "type": "note", "timestamp": f"2026-01-0{i+1}"}
        for i in range(5)
    ]
    compiled = compiler.compile(query, evidence, {"people": []}, {}, {}, token_budget=50)
    assert compiled["telemetry"]["selected_evidence_after"] == 1
    assert compiled["telemetry"]["compiled_tokens_est"] <= 250
