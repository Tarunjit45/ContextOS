"""
ContextOS Phase 2.2 — Relational Context Graph Engine
NetworkX bounded multi-hop traversal with relationship trace exposure.
"""

import networkx as nx
from typing import Dict, List, Any, Tuple

class ContextGraphEngine:
    def __init__(self, max_depth: int = 3):
        self.graph = nx.DiGraph()
        self.max_depth = max_depth

    def build_from_workspace(self, workspace: Dict[str, Any]) -> nx.DiGraph:
        self.graph.clear()
        entities = workspace.get("entities", {})
        comms = workspace.get("communications", [])

        # Companies
        for comp in entities.get("companies", []):
            self.graph.add_node(comp["id"], label=comp["name"], type="Company")

        # People
        for p in entities.get("people", []):
            self.graph.add_node(p["id"], label=p["name"], type="Person", email=p.get("email"), role=p.get("role"))
            if p.get("company_id"):
                self.graph.add_edge(p["id"], p["company_id"], relationship="works_at")

        # Projects
        for prj in entities.get("projects", []):
            self.graph.add_node(prj["id"], label=prj["name"], type="Project")
            if prj.get("owner"):
                self.graph.add_edge(prj["owner"], prj["id"], relationship="owns_project")
            if prj.get("client"):
                self.graph.add_edge(prj["id"], prj["client"], relationship="target_client")

        # Communications
        for comm in comms:
            comm_id = comm["id"]
            self.graph.add_node(comm_id, label=comm.get("subject") or comm.get("title") or comm_id, type="Communication")
            
            # Connect participants/sender to comm
            sender = comm.get("sender") or comm.get("author")
            if sender:
                for p_id, p_data in self.graph.nodes(data=True):
                    if p_data.get("type") == "Person" and p_data.get("email") == sender:
                        self.graph.add_edge(p_id, comm_id, relationship="authored")

        return self.graph

    def traverse_bounded_relationship(self, start_node: str, end_node: str = None) -> Dict[str, Any]:
        if start_node not in self.graph:
            return {"trace": [], "nodes_visited": 0, "path_found": False}

        if end_node and end_node in self.graph:
            try:
                path = nx.shortest_path(self.graph, source=start_node, target=end_node)
                if len(path) - 1 <= self.max_depth:
                    return {"trace": path, "nodes_visited": len(path), "path_found": True}
            except nx.NetworkXNoPath:
                pass

        # Single-source bounded BFS neighborhood
        sub_nodes = list(nx.single_source_shortest_path(self.graph, start_node, cutoff=self.max_depth).keys())
        return {"trace": sub_nodes, "nodes_visited": len(sub_nodes), "path_found": True}
