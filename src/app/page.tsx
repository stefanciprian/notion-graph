"use client";

import { useEffect, useState } from 'react';
import Graph from "./components/Graph/Graph";
import Graph3D from './components/Graph3D/Graph3D';

export default function Home() {
  const [selectedNodeToZoom, setSelectedNodeToZoom] = useState("");
  const [selectedView, setSelectedView] = useState("3d"); // ["2d", "3d"]
  const [graphData, setGraphData] = useState({ nodes: [], links: [] });

  // Handle node selection from dropdown
  const handleNodeSelect = (nodeId: string) => {
    setSelectedNodeToZoom(nodeId);
  };

  // Fetch data from server
  useEffect(() => {
    const fetchGraphData = async () => {
      try {
        const nodesResponse = await fetch('/api/v1/graph/getNodes');
        const nodes = await nodesResponse.json();

        const relationshipsResponse = await fetch('/api/v1/graph/getRelationships');
        const relationships = await relationshipsResponse.json();

        setGraphData({
          nodes: nodes,
          links: relationships,
        });
      } catch (error) {
        console.error('Error fetching graph data:', error);
      }
    };

    fetchGraphData();
  }, []);

  return (
    <main>
      <div className="container mx-auto px-4">
        <div className="overflow-hidden">
          <div className="flex items-center justify-between p-4">
            <div className="relative inline-block w-[180px]">
              <select
                onChange={(e) => handleNodeSelect(e.target.value)}
                value={selectedNodeToZoom}
                className="block w-full bg-white border border-gray-300 rounded-md shadow-sm focus:outline-none focus:ring-indigo-500 focus:border-indigo-500 sm:text-sm"
              >
                <option value="" disabled>Select a node</option>
                {graphData?.nodes.map((node, index) => (
                  <option key={index} value={(node as any).id}>{(node as any).name}</option>
                ))}
              </select>
            </div>

            <div className="relative inline-block w-[180px]">
              <select
                onChange={(e) => setSelectedView(e.target.value)}
                value={selectedView}
                className="block w-full bg-white border border-gray-300 rounded-md shadow-sm focus:outline-none focus:ring-indigo-500 focus:border-indigo-500 sm:text-sm"
              >
                <option value="2d">2D</option>
                <option value="3d">3D</option>
              </select>
            </div>
          </div>
          <div className="relative h-96 overflow-auto">
            {selectedView === "2d" && (
              <Graph graphData={graphData} selectedNodeToZoom={selectedNodeToZoom} />
            )}

            {selectedView === "3d" && (
              <Graph3D graphData={graphData} selectedNodeToZoom={selectedNodeToZoom} />
            )}
          </div>
        </div>
      </div>
    </main>
  );
}
