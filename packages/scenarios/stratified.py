"""
ContextOS Phase 3.1 — Stratified Scenario Selection Engine
Supports 100-scenario and 10-scenario deterministic stratified dataset sampling.
Verifies Dataset v1 SHA256 (2ba2719180060804d7a6fdaf0fd132e27ccb1e78f0a54ec8adff6855f57b12fa).
"""

import os
import json
import hashlib
from pathlib import Path
from typing import Dict, List, Any, Tuple

EXPECTED_DATASET_V1_HASH = "2ba2719180060804d7a6fdaf0fd132e27ccb1e78f0a54ec8adff6855f57b12fa"

def load_and_verify_dataset_v1(root_dir: str = None) -> Dict[str, Any]:
    if not root_dir:
        root_dir = str(Path(__file__).resolve().parents[2])

    dataset_path = os.path.join(root_dir, "benchmarks", "datasets", "v1", "dataset.json")
    if not os.path.exists(dataset_path):
        raise FileNotFoundError(f"Dataset v1 not found at {dataset_path}")

    with open(dataset_path, "r", encoding="utf-8") as f:
        raw_bytes = f.read().encode("utf-8")

    computed_hash = hashlib.sha256(raw_bytes).hexdigest()
    if computed_hash != EXPECTED_DATASET_V1_HASH:
        raise ValueError(f"Dataset v1 Hash Mismatch! Expected {EXPECTED_DATASET_V1_HASH}, got {computed_hash}")

    with open(dataset_path, "r", encoding="utf-8") as f:
        data = json.load(f)

    return data

def get_stratified_100_scenarios(data: Dict[str, Any]) -> Tuple[List[Dict[str, Any]], Dict[str, Any]]:
    scenarios = data["scenarios"]
    categorized = {}
    for scen in scenarios:
        cat = scen["category"]
        categorized.setdefault(cat, []).append(scen)

    target_counts = {
        "memory_decay": 17,
        "temporal_conflict": 17,
        "entity_disambiguation": 17,
        "multi_hop_relationship": 17,
        "contradiction_conflict": 16,
        "missing_information": 16
    }

    selected_scenarios = []
    category_breakdown = {}

    for cat, count in target_counts.items():
        pool = categorized.get(cat, [])
        selected = pool[:count]
        selected_scenarios.extend(selected)
        category_breakdown[cat] = len(selected)

    manifest = {
        "dataset_version": "1.0.0",
        "sample_size": len(selected_scenarios),
        "sampling_method": "deterministic_stratified_100",
        "dataset_v1_sha256": EXPECTED_DATASET_V1_HASH,
        "category_breakdown": category_breakdown,
        "scenario_ids": [s["scenario_id"] for s in selected_scenarios]
    }

    return selected_scenarios, manifest

def get_stratified_10_scenarios(data: Dict[str, Any]) -> Tuple[List[Dict[str, Any]], Dict[str, Any]]:
    scenarios = data["scenarios"]
    categorized = {}
    for scen in scenarios:
        cat = scen["category"]
        categorized.setdefault(cat, []).append(scen)

    target_counts = {
        "memory_decay": 2,
        "temporal_conflict": 2,
        "entity_disambiguation": 2,
        "multi_hop_relationship": 2,
        "contradiction_conflict": 1,
        "missing_information": 1
    }

    selected_scenarios = []
    category_breakdown = {}

    for cat, count in target_counts.items():
        pool = categorized.get(cat, [])
        selected = pool[:count]
        selected_scenarios.extend(selected)
        category_breakdown[cat] = len(selected)

    manifest = {
        "dataset_version": "1.0.0",
        "sample_size": len(selected_scenarios),
        "sampling_method": "deterministic_stratified_10",
        "dataset_v1_sha256": EXPECTED_DATASET_V1_HASH,
        "category_breakdown": category_breakdown,
        "scenario_ids": [s["scenario_id"] for s in selected_scenarios]
    }

    return selected_scenarios, manifest

def save_stratified_manifest(manifest: Dict[str, Any], filename: str = "stratified_100_manifest.json", root_dir: str = None) -> str:
    if not root_dir:
        root_dir = str(Path(__file__).resolve().parents[2])

    manifest_path = os.path.join(root_dir, "benchmarks", "datasets", "v1", filename)
    os.makedirs(os.path.dirname(manifest_path), exist_ok=True)
    with open(manifest_path, "w", encoding="utf-8") as f:
        json.dump(manifest, f, indent=2)
    return manifest_path
