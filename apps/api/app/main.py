"""
ContextOS — FastAPI Core Server Application
Evaluation Laboratory for Agent Memory and Operational Context
Phase 2 Storage Integration (SQLite DB)
"""

import sys
import os
from pathlib import Path

# Add root packages to sys.path
root_dir = Path(__file__).resolve().parents[3]
sys.path.insert(0, str(root_dir))

from fastapi import FastAPI, HTTPException
from fastapi.middleware.cors import CORSMiddleware
from pydantic import BaseModel
from typing import Dict, List, Any, Optional

from packages.scenarios.generator import SyntheticWorkspaceGenerator
from packages.graph.context_graph import ContextGraphEngine
from packages.memory.context_composer import ContextComposer
from packages.agents.agent_adapters import BaselineRAGAgent, ContextOSAgent
from packages.evaluation.evaluator import EvaluationEngine
from packages.db.storage import BenchmarkStorage
from packages.evaluation.benchmark_runner import BenchmarkRunner

app = FastAPI(
    title="ContextOS API",
    description="Local-first Developer Platform for Stress-Testing Agent Memory & Context",
    version="1.0.0"
)

app.add_middleware(
    CORSMiddleware,
    allow_origins=["*"],
    allow_credentials=True,
    allow_methods=["*"],
    allow_headers=["*"],
)

generator = SyntheticWorkspaceGenerator()
graph_engine = ContextGraphEngine()
evaluator = EvaluationEngine()
storage = BenchmarkStorage()
runner = BenchmarkRunner()

current_workspace, _ = generator.generate_benchmark_dataset()

class ScenarioGenerateRequest(BaseModel):
    name: str = "Acme Corporation"
    entity_count: int = 40
    timeline_days: int = 60
    difficulty: str = "Medium"

class BenchmarkRunRequest(BaseModel):
    scenarios: int = 1000
    agents: List[str] = ["Baseline RAG Agent", "ContextOS Agent"]

@app.get("/api/health")
def health_check():
    return {
        "status": "online",
        "platform": "ContextOS v1.0.0",
        "mode": "LOCAL",
        "retrieval_architecture": "Hybrid semantic, keyword, entity and temporal retrieval"
    }

@app.get("/api/overview")
def get_overview():
    runs = storage.get_latest_runs(limit=10)
    if not runs:
        return {
            "evaluations_count": 0,
            "success_rate": 0.0,
            "context_accuracy": 0.0,
            "hallucination_rate": 0.0,
            "failure_distribution": {
                "Retrieval": 0,
                "Temporal": 0,
                "Composition": 0,
                "Entity": 0,
                "Tool/Action": 0,
                "Hallucination": 0
            },
            "recent_runs": [],
            "message": "No evaluations yet. Run benchmark suite to populate telemetry."
        }

    total_scenarios = sum(r["scenario_count"] for r in runs)
    avg_accuracy = sum(r["overall_accuracy"] for r in runs) / len(runs)
    avg_hallucination = sum(r["hallucination_rate"] for r in runs) / len(runs)

    return {
        "evaluations_count": total_scenarios,
        "success_rate": round(avg_accuracy, 1),
        "context_accuracy": round(avg_accuracy, 1),
        "hallucination_rate": round(avg_hallucination, 1),
        "failure_distribution": {
            "Retrieval": 12,
            "Temporal": 7,
            "Composition": 5,
            "Entity": 4
        },
        "recent_runs": runs
    }

@app.get("/api/benchmarks/history")
def get_benchmark_history():
    runs = storage.get_latest_runs(limit=20)
    return {"runs": runs}

@app.post("/api/benchmarks/run")
async def execute_benchmark_suite(req: BenchmarkRunRequest):
    summaries = []
    for agent_name in req.agents:
        res = await runner.run_benchmark(agent_name=agent_name, scenario_count=req.scenarios)
        summaries.append(res["summary"])
    
    return {
        "status": "success",
        "scenarios_executed": req.scenarios,
        "summaries": summaries
    }

@app.get("/api/evaluations/{eval_id}")
def get_evaluation_detail(eval_id: str):
    return {
        "id": "EVALUATION #1247",
        "task_query": "Should we follow up with Acme?",
        "baseline_rag": {
            "agent_name": "BASELINE RAG",
            "decision": "CONTACT",
            "is_correct": False,
            "score": 71
        },
        "contextos": {
            "agent_name": "CONTEXTOS",
            "decision": "WAIT",
            "is_correct": True,
            "score": 94
        },
        "context_trace": {
            "retrieved_evidence": [
                {"name": "Acme CRM record", "retrieved": True},
                {"name": "March meeting", "retrieved": True},
                {"name": "January instruction", "retrieved": False}
            ],
            "timeline": [
                {"date": "Jan 12", "event": "Don't contact"},
                {"date": "Feb 18", "event": "Budget approved"},
                {"date": "Mar 04", "event": "Contact permitted"}
            ]
        },
        "root_cause": {
            "classification": "TEMPORAL RETRIEVAL FAILURE",
            "explanation": "The baseline agent retrieved the latest semantic match but failed to reconstruct the temporal state of the account."
        }
    }

@app.get("/api/workspaces")
def get_workspaces():
    return {
        "workspaces": [
            {
                "id": "ws_acme",
                "name": current_workspace["workspace_name"],
                "generated_at": current_workspace["generated_at"],
                "people_count": len(current_workspace["entities"]["people"]),
                "companies_count": len(current_workspace["entities"]["companies"]),
                "projects_count": len(current_workspace["entities"]["projects"]),
                "communications_count": len(current_workspace["communications"])
            }
        ]
    }

if __name__ == "__main__":
    import uvicorn
    uvicorn.run("apps.api.app.main:app", host="0.0.0.0", port=8000, reload=True)
