"""
ContextOS Phase 2.2 — Persistent Database & Benchmark Storage Module
Uses SQLite (contextos_benchmark.db) for local zero-config persistence.
"""

import sqlite3
import json
import os
from typing import Dict, List, Any, Optional

DB_PATH = os.path.join(os.path.dirname(__file__), "..", "..", "benchmarks", "contextos_benchmark.db")

class BenchmarkStorage:
    def __init__(self, db_path: str = DB_PATH):
        self.db_path = os.path.abspath(db_path)
        os.makedirs(os.path.dirname(self.db_path), exist_ok=True)
        self.init_db()

    def get_connection(self):
        conn = sqlite3.connect(self.db_path)
        conn.row_factory = sqlite3.Row
        return conn

    def init_db(self):
        with self.get_connection() as conn:
            cursor = conn.cursor()
            cursor.execute("""
                CREATE TABLE IF NOT EXISTS benchmark_runs (
                    run_id TEXT PRIMARY KEY,
                    timestamp TEXT NOT NULL,
                    agent_name TEXT NOT NULL,
                    scenario_count INTEGER NOT NULL,
                    overall_accuracy REAL NOT NULL,
                    memory_retention REAL NOT NULL,
                    temporal_reasoning REAL NOT NULL,
                    entity_disambiguation REAL NOT NULL,
                    evidence_grounding REAL NOT NULL,
                    hallucination_rate REAL NOT NULL,
                    p50_latency_ms REAL NOT NULL,
                    p95_latency_ms REAL NOT NULL
                )
            """)

            cursor.execute("""
                CREATE TABLE IF NOT EXISTS benchmark_traces (
                    id INTEGER PRIMARY KEY AUTOINCREMENT,
                    run_id TEXT NOT NULL,
                    scenario_id TEXT NOT NULL,
                    category TEXT NOT NULL,
                    agent_name TEXT NOT NULL,
                    query TEXT NOT NULL,
                    retrieved_evidence TEXT,
                    agent_response TEXT,
                    expected_response TEXT,
                    status TEXT NOT NULL,
                    failure_class TEXT,
                    latency_ms REAL NOT NULL,
                    token_count INTEGER NOT NULL,
                    FOREIGN KEY(run_id) REFERENCES benchmark_runs(run_id)
                )
            """)

            cursor.execute("""
                CREATE TABLE IF NOT EXISTS llm_benchmark_traces (
                    id INTEGER PRIMARY KEY AUTOINCREMENT,
                    run_id TEXT NOT NULL,
                    scenario_id TEXT NOT NULL,
                    category TEXT NOT NULL,
                    agent_name TEXT NOT NULL,
                    provider TEXT NOT NULL,
                    model TEXT NOT NULL,
                    system_prompt TEXT,
                    user_prompt TEXT,
                    context TEXT,
                    answer TEXT,
                    decision TEXT,
                    confidence REAL,
                    input_tokens INTEGER,
                    output_tokens INTEGER,
                    cost_usd REAL,
                    latency_ms REAL,
                    system_prompt_hash TEXT,
                    user_prompt_hash TEXT,
                    context_hash TEXT,
                    execution_status TEXT,
                    error_message TEXT,
                    git_commit TEXT,
                    created_at TEXT NOT NULL
                )
            """)
            conn.commit()

    def save_llm_trace(self, trace_data: Dict[str, Any]):
        with self.get_connection() as conn:
            cursor = conn.cursor()
            cursor.execute("""
                INSERT INTO llm_benchmark_traces (
                    run_id, scenario_id, category, agent_name, provider, model,
                    system_prompt, user_prompt, context, answer, decision, confidence,
                    input_tokens, output_tokens, cost_usd, latency_ms,
                    system_prompt_hash, user_prompt_hash, context_hash,
                    execution_status, error_message, git_commit, created_at
                ) VALUES (?, ?, ?, ?, ?, ?, ?, ?, ?, ?, ?, ?, ?, ?, ?, ?, ?, ?, ?, ?, ?, ?, ?)
            """, (
                trace_data.get("run_id"),
                trace_data.get("scenario_id"),
                trace_data.get("category"),
                trace_data.get("agent_name"),
                trace_data.get("provider"),
                trace_data.get("model"),
                trace_data.get("system_prompt"),
                trace_data.get("user_prompt"),
                trace_data.get("context"),
                trace_data.get("answer"),
                trace_data.get("decision"),
                trace_data.get("confidence", 0.0),
                trace_data.get("input_tokens", 0),
                trace_data.get("output_tokens", 0),
                trace_data.get("cost_usd", 0.0),
                trace_data.get("latency_ms", 0.0),
                trace_data.get("system_prompt_hash"),
                trace_data.get("user_prompt_hash"),
                trace_data.get("context_hash"),
                trace_data.get("execution_status", "SUCCESS"),
                trace_data.get("error_message"),
                trace_data.get("git_commit", "7b24a36"),
                trace_data.get("created_at")
            ))
            conn.commit()

    def save_benchmark_run(self, run_summary: Dict[str, Any], traces: List[Dict[str, Any]]):
        with self.get_connection() as conn:
            cursor = conn.cursor()
            cursor.execute("""
                INSERT OR REPLACE INTO benchmark_runs (
                    run_id, timestamp, agent_name, scenario_count, overall_accuracy,
                    memory_retention, temporal_reasoning, entity_disambiguation,
                    evidence_grounding, hallucination_rate, p50_latency_ms, p95_latency_ms
                ) VALUES (?, ?, ?, ?, ?, ?, ?, ?, ?, ?, ?, ?)
            """, (
                run_summary["run_id"],
                run_summary["timestamp"],
                run_summary["agent_name"],
                run_summary["scenario_count"],
                run_summary["overall_accuracy"],
                run_summary.get("memory_recall", run_summary.get("memory_retention", 0.0)),
                run_summary.get("temporal_state_accuracy", run_summary.get("temporal_reasoning", 0.0)),
                run_summary.get("entity_resolution_accuracy", run_summary.get("entity_disambiguation", 0.0)),
                run_summary["evidence_grounding"],
                run_summary["hallucination_rate"],
                run_summary["p50_latency_ms"],
                run_summary["p95_latency_ms"]
            ))

            for trace in traces:
                cursor.execute("""
                    INSERT INTO benchmark_traces (
                        run_id, scenario_id, category, agent_name, query,
                        retrieved_evidence, agent_response, expected_response,
                        status, failure_class, latency_ms, token_count
                    ) VALUES (?, ?, ?, ?, ?, ?, ?, ?, ?, ?, ?, ?)
                """, (
                    run_summary["run_id"],
                    trace["scenario_id"],
                    trace["category"],
                    trace["agent_name"],
                    trace["query"],
                    json.dumps(trace.get("retrieved_evidence", [])),
                    trace.get("agent_response", ""),
                    trace.get("expected_response", ""),
                    trace["status"],
                    trace.get("failure_class"),
                    trace.get("latency_ms", 0.0),
                    trace.get("token_count", 0)
                ))
            conn.commit()

    def get_latest_runs(self, limit: int = 10) -> List[Dict[str, Any]]:
        with self.get_connection() as conn:
            cursor = conn.cursor()
            cursor.execute("SELECT * FROM benchmark_runs ORDER BY timestamp DESC LIMIT ?", (limit,))
            rows = cursor.fetchall()
            return [dict(row) for row in rows]
