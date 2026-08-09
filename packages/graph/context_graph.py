"""
ContextOS — NetworkX Context Graph Engine
Builds relational entity graphs (Person -> Company -> Project -> Meeting) and supports temporal graph queries.
"""

import networkx as nx
from typing import Dict, List, Any, Tuple

class ContextGraphEngine:
    def __init__(self):
        self.graph = nx.DiGraph()

    def build_from_workspace(self, workspace: Dict[str, Any], filter_until_timestamp: str = None) -> nx.DiGraph:
        self.graph.clear()
        
        entities = workspace.get("entities", {})
        comms = workspace.get("communications", [])

        # Add Companies
        for comp in entities.get("companies", []):
            self.graph.add_node(comp["id"], label=comp["name"], type="Company", domain=comp["domain"])

        # Add People
        for p in entities.get("people", []):
            self.graph.add_node(p["id"], label=p["name"], type="Person", email=p["email"], role=p["role"])
            # Associate person with domain
            for comp in entities.get("companies", []):
                if p["email"].endswith("@" + comp["domain"]):
                    self.graph.add_edge(p["id"], comp["id"], relationship="employs")

        # Add Projects
        for prj in entities.get("projects", []):
            self.graph.add_node(prj["id"], label=prj["name"], type="Project", status=prj["status"])
            if "owner" in prj:
                self.graph.add_edge(prj["owner"], prj["id"], relationship="owns_project")
            if "client" in prj:
                self.graph.add_edge(prj["id"], prj["client"], relationship="target_client")

        # Add Communications (filtering temporally if requested)
        for comm in comms:
            if filter_until_timestamp and comm.get("timestamp", "") > filter_until_timestamp:
                continue # Skip future events in context replay mode
            
            comm_id = comm["id"]
            self.graph.add_node(comm_id, label=comm.get("subject") or comm.get("title") or comm["id"], type="Communication", timestamp=comm.get("timestamp"))

        return self.graph

    def get_graph_summary(()) -> Dict[str, Any]:
        nodes = []
        edges = []
        for n, attrs in self.graph.nodes(data=True):
            nodes.append({"id": n, **attrs})
        for u, v, attrs in self.graph.edges(data=True):
            edges.append({"source": u, "target": v, **attrs})
        return {
            "node_count": len(nodes),
            "edge_count": len(edges),
            "nodes": nodes,
            "edges": edges
        }
