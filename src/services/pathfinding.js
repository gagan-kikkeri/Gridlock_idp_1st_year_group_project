// Gridlock Micro-Location Algorithmic Solver
// Implements A* Heuristic Search f(n) = g(n) + h(n) with Dynamic Hazard Edge Weight Inflation

import { SPATIAL_NODES, GRAPH_EDGES } from '../data/campusData.js';

const INFINITY_WEIGHT = 1e8; // Hazard cost override W_active = W_base + infinity

/**
 * Euclidean distance heuristic between 3D coordinates (x, y, floor)
 * Floor transitions are scaled to reflect physical vertical ascent effort
 */
export function heuristic(nodeA, nodeB) {
  if (!nodeA || !nodeB) return 0;
  const dx = (nodeA.x - nodeB.x) * 0.1; // scale canvas pixels to meters approx
  const dy = (nodeA.y - nodeB.y) * 0.1;
  const dz = (nodeA.floor - nodeB.floor) * 25.0; // 25m effort penalty for vertical ascent
  return Math.sqrt(dx * dx + dy * dy + dz * dz);
}

/**
 * Build adjacency list incorporating live hazard states
 * @param {Array} edges list of graph edges
 * @param {Object} hazardMap map of edgeId -> { isBlocked: boolean, type: string }
 * @param {Object} nodes map of nodeId -> node
 */
export function buildAdjacencyList(edges = GRAPH_EDGES, hazardMap = {}, nodes = SPATIAL_NODES) {
  const adj = {};

  // Initialize nodes
  Object.keys(nodes).forEach((nodeId) => {
    adj[nodeId] = [];
  });

  edges.forEach((edge) => {
    const isHazardBlocked = hazardMap[edge.id]?.isBlocked;
    const effectiveWeight = isHazardBlocked ? (edge.distance + INFINITY_WEIGHT) : edge.distance;

    const uNode = nodes[edge.u];
    const vNode = nodes[edge.v];

    if (uNode && vNode) {
      adj[edge.u].push({
        to: edge.v,
        weight: effectiveWeight,
        baseWeight: edge.distance,
        edgeId: edge.id,
        isBlocked: !!isHazardBlocked,
        hazardType: hazardMap[edge.id]?.type || null,
        corridor: edge.corridor,
        isVertical: !!edge.isVertical,
        transitType: edge.transitType || 'corridor'
      });

      adj[edge.v].push({
        to: edge.u,
        weight: effectiveWeight,
        baseWeight: edge.distance,
        edgeId: edge.id,
        isBlocked: !!isHazardBlocked,
        hazardType: hazardMap[edge.id]?.type || null,
        corridor: edge.corridor,
        isVertical: !!edge.isVertical,
        transitType: edge.transitType || 'corridor'
      });
    }
  });

  return adj;
}

/**
 * Find shortest path using A* Search
 * @param {string} startNodeId 
 * @param {string} targetNodeId 
 * @param {Object} hazardMap 
 * @param {Object} customNodes
 * @param {Array} customEdges
 * @returns {Object} result with path, distance, detoured, directions
 */
export function findShortestPath(startNodeId, targetNodeId, hazardMap = {}, customNodes = SPATIAL_NODES, customEdges = GRAPH_EDGES) {
  if (!startNodeId || !targetNodeId) return null;
  if (!customNodes[startNodeId] || !customNodes[targetNodeId]) return null;

  if (startNodeId === targetNodeId) {
    const node = customNodes[startNodeId];
    return {
      success: true,
      path: [startNodeId],
      totalDistance: 0,
      estimatedSeconds: 0,
      detoured: false,
      nodes: [node],
      directions: [`You are already at ${node.label} (${node.floor === 0 ? 'Ground Floor' : 'Floor ' + node.floor}).`]
    };
  }

  const adj = buildAdjacencyList(customEdges, hazardMap, customNodes);
  const targetNode = customNodes[targetNodeId];

  // Open set priority queue (min-heap simulation using array for lightweight footprint)
  const openSet = new Set([startNodeId]);
  const cameFrom = {}; // child -> { from, edgeInfo }
  
  const gScore = {}; // Cost from start to node
  const fScore = {}; // Estimated total cost

  Object.keys(customNodes).forEach((nodeId) => {
    gScore[nodeId] = Infinity;
    fScore[nodeId] = Infinity;
  });

  gScore[startNodeId] = 0;
  fScore[startNodeId] = heuristic(customNodes[startNodeId], targetNode);

  while (openSet.size > 0) {
    // Pick node with lowest fScore
    let current = null;
    let minF = Infinity;
    for (const nodeId of openSet) {
      if (fScore[nodeId] < minF) {
        minF = fScore[nodeId];
        current = nodeId;
      }
    }

    if (!current) break;

    // Reached destination
    if (current === targetNodeId) {
      return reconstructPath(cameFrom, current, startNodeId, hazardMap, customNodes);
    }

    openSet.delete(current);

    const neighbors = adj[current] || [];
    for (const neighbor of neighbors) {
      // Don't traverse completely blocked passages if avoidable
      if (neighbor.weight >= INFINITY_WEIGHT / 2) {
        continue;
      }

      const tentativeG = gScore[current] + neighbor.weight;
      if (tentativeG < gScore[neighbor.to]) {
        cameFrom[neighbor.to] = {
          from: current,
          edgeInfo: neighbor
        };
        gScore[neighbor.to] = tentativeG;
        fScore[neighbor.to] = tentativeG + heuristic(customNodes[neighbor.to], targetNode);
        openSet.add(neighbor.to);
      }
    }
  }

  // If normal search failed because all paths were blocked, check if a path exists with hazard warning
  return {
    success: false,
    path: [],
    totalDistance: 0,
    estimatedSeconds: 0,
    detoured: false,
    nodes: [],
    directions: ["No safe accessible path found. Active hazards or corridor blockages prevent access."]
  };
}

/**
 * Reconstruct path array and build human-friendly turn-by-turn directions
 */
function reconstructPath(cameFrom, current, startId, hazardMap, customNodes = SPATIAL_NODES) {
  const path = [current];
  const edgeDetails = [];
  let curr = current;

  while (curr in cameFrom) {
    const step = cameFrom[curr];
    edgeDetails.unshift(step.edgeInfo);
    curr = step.from;
    path.unshift(curr);
  }

  let totalMeters = 0;
  const directions = [];
  const nodes = path.map((id) => customNodes[id]);

  const startNode = nodes[0];
  const endNode = nodes[nodes.length - 1];

  directions.push(`Start at ${startNode.label} (${startNode.floor === 0 ? 'Ground Floor' : '1st Floor'}).`);

  for (let i = 0; i < edgeDetails.length; i++) {
    const edge = edgeDetails[i];
    const fromNode = nodes[i];
    const toNode = nodes[i + 1];
    totalMeters += edge.baseWeight;

    if (edge.isVertical) {
      if (toNode.floor > fromNode.floor) {
        directions.push(
          edge.transitType === 'stairs'
            ? `Ascend ${fromNode.label} up to First Floor (${toNode.label}).`
            : `Take Passenger Elevator 1 up to First Floor.`
        );
      } else {
        directions.push(
          edge.transitType === 'stairs'
            ? `Descend ${fromNode.label} down to Ground Floor (${toNode.label}).`
            : `Take Passenger Elevator 1 down to Ground Floor.`
        );
      }
    } else {
      // Cardinal / relative heading hint
      const dx = toNode.x - fromNode.x;
      const dy = toNode.y - fromNode.y;
      let heading = "Continue straight along";
      if (Math.abs(dx) > Math.abs(dy)) {
        heading = dx > 0 ? "Head East along" : "Head West along";
      } else {
        heading = dy > 0 ? "Walk South along" : "Walk North along";
      }
      directions.push(`${heading} ${edge.corridor} (~${edge.baseWeight}m) towards ${toNode.label}.`);
    }
  }

  directions.push(`Arrive safely at destination: ${endNode.label}.`);

  // Detect whether this route avoids any active hazard that would have been used normally
  const hasActiveHazards = Object.values(hazardMap).some(h => h.isBlocked);

  // Normal walking speed approx 1.3 meters/second + vertical stairs penalty
  const estimatedSeconds = Math.round(totalMeters / 1.35 + (nodes.some(n => n.floor === 1) && nodes.some(n => n.floor === 0) ? 15 : 0));

  return {
    success: true,
    path,
    nodes,
    totalDistance: totalMeters,
    estimatedSeconds,
    detoured: hasActiveHazards,
    directions
  };
}

/**
 * Emergency SOS Evacuation Egress Path
 * Computes safest and nearest exit / assembly point avoiding all hazards
 */
export function findNearestEmergencyExit(currentNodeId, hazardMap = {}, customNodes = SPATIAL_NODES, customEdges = GRAPH_EDGES) {
  const exitNodeCandidates = ["N_FIRE_EXIT_S", "N_FIRE_EXIT_N", "N_ASSEMBLY"];
  let bestRoute = null;
  let minCost = Infinity;

  exitNodeCandidates.forEach((exitId) => {
    if (!customNodes[exitId]) return;
    const result = findShortestPath(currentNodeId, exitId, hazardMap, customNodes, customEdges);
    if (result && result.success && result.totalDistance < minCost) {
      minCost = result.totalDistance;
      bestRoute = {
        ...result,
        targetExit: customNodes[exitId]
      };
    }
  });

  return bestRoute;
}
