import React, { useEffect } from 'react';
import * as d3 from 'd3';

const TreePlot = ({ data }) => {
  useEffect(() => {
    // Validate the data structure
    if (!data || !Array.isArray(data.children)) {
      console.error("Invalid data structure:", data);
      return;
    }

    const margin = { top: 120, right: 180, bottom: 120, left: 180 };
    const width = 960 - margin.right - margin.left;
    const height = 500 - margin.top - margin.bottom;

    let i = 0;
    const duration = 750;

    // Clear any previous SVG elements to avoid duplicates
    d3.select('#tree-container').selectAll('*').remove();

    // Define tree layout
    const tree = d3.tree().size([height, width]).separation((a, b) => a.parent === b.parent ? 1 : 2); // Adjust separation

    // Create the SVG container
    const svg = d3.select('#tree-container')
      .append('svg')
      .attr('width', width + margin.right + margin.left)
      .attr('height', height + margin.top + margin.bottom)
      .append('g')
      .attr('transform', `translate(${margin.left},${margin.top})`);

    // Create the hierarchy from the data without an empty root node
    const root = d3.hierarchy({ children: data.children }); // Initialize with children directly
    root.x0 = height / 2;
    root.y0 = 0;

    // Toggle children (collapse function)
    function toggleAll(d) {
      if (d.children) {
        d._children = d.children;
        d.children.forEach(toggleAll);
        d.children = null;
      }
    }

    // Only call toggleAll if children exist
    if (root.children) {
      root.children.forEach(toggleAll);
    }

    // Update the tree
    function update(source) {
      const nodes = tree(root).descendants();
      const links = tree(root).links();

      // Set the position of each node
      nodes.forEach(d => (d.y = d.depth * 100)); // Adjust vertical spacing

      // Nodes section
      const node = svg.selectAll('g.node')
        .data(nodes, d => d.id || (d.id = ++i));

      const nodeEnter = node.enter().append('g')
        .attr('class', 'node')
        .attr('transform', `translate(${source.y0},${source.x0})`)
        .on('click', click);

      // Set color based on node value
      nodeEnter.append('circle')
        .attr('r', 20)
        .style('fill', (d) => (d.data.name % 2 === 0 ? 'green' : 'red'));

      // Display node value inside the node
      nodeEnter.append('text')
        .attr('x', 0)
        .attr('dy', '.35em')
        .attr('text-anchor', 'middle')
        .style('fill-opacity', 1)
        .text(d => d.data.name);

      const nodeUpdate = node.merge(nodeEnter).transition().duration(duration)
        .attr('transform', d => `translate(${d.y},${d.x})`);

      nodeUpdate.select('circle').attr('r', 20).style('stroke', 'black').style('stroke-width', '1px');
      nodeUpdate.select('text').style('fill-opacity', 1);

      // Exit nodes
      const nodeExit = node.exit().transition().duration(duration)
        .attr('transform', `translate(${source.y},${source.x})`)
        .remove();

      nodeExit.select('circle').attr('r', 1e-6);
      nodeExit.select('text').style('fill-opacity', 1e-6);

      // Links section
      const link = svg.selectAll('path.link')
        .data(links, d => d.target.id);

      const linkEnter = link.enter().insert('path', 'g')
        .attr('class', 'link')
        .attr('d', () => {
          const o = { x: source.x0, y: source.y0 };
          return `M${o.y},${o.x}L${o.y},${o.x}`;
        });

      link.merge(linkEnter).transition().duration(duration)
        .attr('d', d => `M${d.source.y},${d.source.x}L${d.target.y},${d.target.x}`)
        .style('fill', 'none')
        .style('stroke', 'black')
        .style('stroke-width', '2px');

      link.exit().transition().duration(duration)
        .attr('d', () => {
          const o = { x: source.x, y: source.y };
          return `M${o.y},${o.x}L${o.y},${o.x}`;
        })
        .remove();

      // Store old positions for transition
      nodes.forEach(d => {
        d.x0 = d.x;
        d.y0 = d.y;
      });
    }

    function click(event, d) {
      if (d.children) {
        d._children = d.children;
        d.children = null;
      } else {
        d.children = d._children;
        d._children = null;
      }
      update(d);
    }

    update(root);

  }, [data]); // Update when data changes

  return <div  id="tree-container" style={{ width: '100%', height: '100%' }}></div>;
};

export default TreePlot;
