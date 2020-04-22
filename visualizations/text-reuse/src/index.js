import axios from 'axios';
import Papa from 'papaparse';
import * as d3 from 'd3';
import { WIDTH, HEIGHT } from './Const';

class App {

  constructor(elem) {
    this.elem = elem;
  }

  loadData = () =>
    axios.get('similarities_ngram.csv')
      .then(response => { 
        const csv = Papa.parse(response.data, { header: true });

        const nodes = [];
        csv.data.forEach(row => {
          if (row.Source && row.Target) {
            nodes.push(row.Source);
            nodes.push(row.Target);
          }
        });

        this.data = {
          nodes: [...new Set(nodes)],
          links: csv.data.filter(row => row.Source && row.Target)
        };
      });

  render() {
    const svg = d3.select(this.elem)
      .append('svg')
        .attr('width', WIDTH)
        .attr('height', HEIGHT);

    // A linear scale to position the nodes on the X axis
    const x = d3.scalePoint()
      .domain(this.data.nodes)
      .range([ 0, WIDTH ]);

    svg.selectAll('mylinks')
      .data(this.data.links)
      .enter()
        .append('path')
        .attr('d', d => {
          const start = x(d.Source)    // X position of start node on the X axis
          const end = x(d.Target)      // X position of end node
          const height = 500;

          return ['M', start, height - 30,    // the arc starts at the coordinate x=start, y=height-30 (where the starting node is)
            'A',                            // This means we're gonna build an elliptical arc
            (start - end)/2, ',',    // Next 2 lines are the coordinates of the inflexion point. Height of this point is proportional with start - end distance
            (start - end)/2, 0, 0, ',',
            start < end ? 1 : 0, end, ',', height-30] // We always want the arc on top. So if end is before start, putting 0 here turn the arc upside down.
            .join(' ');
         })
        .style('fill', 'none')
        .attr('stroke', 'grey')
        .style('stroke-width', d =>
          d.Weight > 0.1 ? d.Weight * 10 : 0)

    svg.selectAll('mynodes')
      .data(this.data.nodes)
      .enter()
      .append('circle')
        .attr('cx', d => x(d))
        .attr('cy', 468)
        .attr('r', 7)
        .attr('fill', 'green')
        .attr('stroke', 'white')
  }

}

const app = new App(document.getElementById('app'));
app.loadData().then(() => app.render());