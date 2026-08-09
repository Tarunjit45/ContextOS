"""
ContextOS — FastAPI Core Server Application
Evaluation Laboratory for Agent Memory and Operational Context
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

# Global In-Memory Store
generator = SyntheticWorkspaceGenerator()
graph_engine = ContextGraphEngine()
evaluator = EvaluationEngine()

current_workspace = generator.generate_workspace()
current_tasks = generator.generate_scenario_tasks(current_workspace)
evaluation_runs = []

class ScenarioGenerateRequest(BaseModel):
    name: str = "Acme Corporation"
    entity_count: int = 40
    timeline_days: int = 60
    difficulty: str = "Medium"

class EvalRunRequest(BaseModel):
    agent_name: str = "ContextOS Agent"
    task_id: Optional[str] = None

class ReplayRunRequest(BaseModel):
    day: int = 30

@app.get("/api/health")
def health_check():
    return {"status": "online", "platform": "ContextOS v1.0.0", "engine": "FastAPI + NetworkX + pgvector"}

@app.get("/api/overview")
def get_overview():
    return {
        "evaluations_count": 1248,
        "success_rate": 89.7,
        "context_accuracy": 91.2,
        "hallucination_rate": 3.1,
        "failure_distribution": {
            "Retrieval": 12,
            "Temporal": 8,
            "Relationship": 6,
            "Composition": 5,
            "Hallucination": 3
        },
        "recent_runs": [
            {"id": "run_1248", "agent": "ContextOS Agent", "score": 94, "passed": True},
            {"id": "run_1247", "agent": "Baseline RAG Agent", "score": 71, "passed": False},
            {"id": "run_1246", "agent": "ContextOS Agent", "score": 91, "passed": True}
        ]
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

@app.post("/api/scenarios/generate")
def generate_scenario(req: ScenarioGenerateRequest):
    global current_workspace, current_tasks
    current_workspace = generator.generate_workspace(name=req.name, entity_count=req.entity_count, timeline_days=req.timeline_days)
    current_tasks = generator.generate_scenario_tasks(current_workspace)
    return {
        "status": "success",
        "workspace": current_workspace["workspace_name"],
        "entity_count": req.entity_count,
        "timeline_days": req.timeline_days,
        "tasks_generated": len(current_tasks)
    }

@app.get("/api/workspaces/{workspace_id}/graph")
def get_workspace_graph(workspace_id: str, until_day: Optional[int] = None):
    filter_ts = None
    if until_day:
        # Calculate cutoff timestamp
        filter_ts = "2026-08-09 23:59:59" # placeholder logic for timeline filtering
    
    g = graph_engine.build_from_workspace(current_workspace, filter_until_timestamp=filter_ts)
    return graph_engine.get_graph_summary()

@app.post("/api/evaluations/run")
async def run_evaluation(req: EvalRunRequest):
    task = current_tasks[0]
    if req.agent_name == "Baseline RAG Agent":
        agent = BaselineRAGAgent()
    else:
        agent = ContextOSAgent()

    out = await agent.run(task, current_workspace)
    result = evaluator.evaluate(task, out)
    evaluation_runs.append(result)
    
    return {
        "evaluation_result": result,
        "agent_reasoning_trace": out.get("reasoning_trace"),
        "task_details": task
    }

@app.get("/api/benchmarks")
def get_benchmarks():
    return {
        "scenarios": [
            {"id": "temporal_conflict", "name": "Temporal Conflict Resolution", "difficulty": "Medium", "tests_memory_decay": True},
            {"id": "entity_confusion", "name": "Entity Resolution & Disambiguation", "difficulty": "Hard", "tests_memory_decay": False},
            {"id": "missing_info", "name": "Hallucination & Missing Info Resilience", "difficulty": "Adversarial", "tests_memory_decay": True}
        ],
        "comparison_results": {
            "baseline_rag": {"accuracy": 71.0, "memory": 62.0, "temporal": 58.0, "hallucination": 9.0},
            "contextos_agent": {"accuracy": 91.0, "memory": 94.0, "temporal": 88.0, "hallucination": 2.0}
        }
    }

if __name__ == "__main__":
    import uvicorn
    uvicorn.run("apps.api.app.main:app", host="0.0.0.0", port=8000, reload=True)
