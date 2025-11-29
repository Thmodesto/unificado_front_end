import { getGraphInsight } from '@/lib/api';

export const getGraphData = async () => {
  const insight = await getGraphInsight();
  const nodes = insight.nodes;
  const links = insight.edges.map(edge => ({ source: edge.from, target: edge.to }));
  return { nodes, links };
};
