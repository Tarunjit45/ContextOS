"""
ContextOS Phase 3.1 — System Hardware Detector & Memory Risk Assessment Engine
Detects System RAM, CPU Cores, GPU availability, and assesses low-resource LLM fit.
"""

import os
import re
import platform
import subprocess
from typing import Dict, Any, Optional

try:
    import psutil
    HAS_PSUTIL = True
except ImportError:
    HAS_PSUTIL = False

def detect_hardware() -> Dict[str, Any]:
    total_ram_gb = 8.0
    available_ram_gb = 4.0
    cpu_cores = os.cpu_count() or 4

    if HAS_PSUTIL:
        mem = psutil.virtual_memory()
        total_ram_gb = round(mem.total / (1024**3), 2)
        available_ram_gb = round(mem.available / (1024**3), 2)

    has_gpu = False
    gpu_name = None
    gpu_vram_mb = 0

    try:
        res = subprocess.check_output(
            ["nvidia-smi", "--query-gpu=name,memory.total", "--format=csv,noheader,nounits"],
            stderr=subprocess.DEVNULL,
            timeout=2
        ).decode("utf-8").strip()
        if res:
            parts = res.split(",")
            gpu_name = parts[0].strip()
            gpu_vram_mb = int(parts[1].strip())
            has_gpu = True
    except Exception:
        pass

    return {
        "os": platform.platform(),
        "cpu_cores": cpu_cores,
        "total_ram_gb": total_ram_gb,
        "available_ram_gb": available_ram_gb,
        "has_gpu": has_gpu,
        "gpu_name": gpu_name,
        "gpu_vram_mb": gpu_vram_mb
    }

def estimate_model_params(model_name: str) -> float:
    name_lower = model_name.lower()
    match = re.search(r'(\d+(?:\.\d+)?)\s*b', name_lower)
    if match:
        return float(match.group(1))
    if "mini" in name_lower or "tiny" in name_lower or "0.5b" in name_lower:
        return 0.5
    if "small" in name_lower or "1b" in name_lower or "1.5b" in name_lower:
        return 1.5
    if "7b" in name_lower or "8b" in name_lower:
        return 8.0
    if "13b" in name_lower or "14b" in name_lower:
        return 14.0
    if "70b" in name_lower:
        return 70.0
    return 7.0 # Default estimate

def assess_model_resource_fit(model_name: str, hardware: Dict[str, Any] = None) -> Dict[str, Any]:
    hw = hardware or detect_hardware()
    params = estimate_model_params(model_name)
    
    # 4-bit quantization memory footprint rule of thumb: ~0.75 GB RAM per 1B parameters + 1.0GB overhead
    estimated_ram_gb = round(params * 0.75 + 1.0, 2)
    available_ram = hw["available_ram_gb"]

    is_fit = available_ram >= estimated_ram_gb

    if is_fit:
        warning = None
        action = f"Model '{model_name}' (~{params}B) fits within available RAM ({available_ram} GB)."
    else:
        warning = (
            f"WARNING: Model '{model_name}' (~{params}B) requires ~{estimated_ram_gb} GB RAM, "
            f"but only {available_ram} GB RAM is available on this machine."
        )
        action = "Recommended action: Use a small quantized model (e.g. qwen2.5:0.5b, llama3.2:1b) or a remote API provider (e.g. OpenAI / Groq)."

    return {
        "model": model_name,
        "estimated_params_b": params,
        "estimated_ram_required_gb": estimated_ram_gb,
        "available_ram_gb": available_ram,
        "is_fit": is_fit,
        "warning_message": warning,
        "recommended_action": action
    }
