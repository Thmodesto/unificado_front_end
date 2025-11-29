import 'aframe';
import { useEffect, useState } from 'react';
import { ForceGraph2D } from 'react-force-graph';
import { getGraphData } from '@/services/graphService';

interface NodeData {
  id: number;
  name: string;
}

interface LinkData {
  source: number;
  target: number;
}

interface GraphData {
  nodes: NodeData[];
  links: LinkData[];
}

export default function GraphView() {
  const [graphData, setGraphData] = useState<GraphData | null>(null);

  useEffect(() => {
    const loadGraph = async () => {
      try {
        const data = await getGraphData();
        setGraphData(data);
      } catch (err) {
        console.error('Erro ao carregar dados do grafo:', err);
      }
    };
    loadGraph();
  }, []);

  if (!graphData) {
    return <div>Carregando grafo...</div>;
  }

  return (
    <div style={{ width: '100%', aspectRatio: '4/3', background: 'lightgray', height: '80vh', overflow: 'auto' }}>
      <ForceGraph2D
        graphData={graphData}
        nodeLabel={(node: any) => node.name}
        linkDirectionalArrowLength={3.5}
        nodeAutoColorBy="id"
        linkWidth={2}
        linkColor="black"
      />
    </div>
  );
}
