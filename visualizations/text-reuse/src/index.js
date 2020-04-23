import axios from 'axios';
import * as d3 from 'd3';
import { WIDTH, HEIGHT } from './Const';
import Timeline from './Timeline';
import Similarities from './Similarities';

import './index.scss';

class App {

  constructor(elem) {
    this.elem = elem;
  }

  loadData = () => {
    // Load metadata
    const fMetadata = axios.get('TravelogueD16.json')
      .then(response => {
        this.timeline = new Timeline(response.data);
      });

    // Load similarities
    const fSimilarities = axios.get('similarities_ngram_16C.csv')
      .then(response => { 
        this.similarities = new Similarities(response.data);
      });

    // Return when both have loaded
    return Promise.all([fMetadata, fSimilarities]);
  }

  render() {
    const svg = d3.select(this.elem)
      .append('svg')
        .attr('width', WIDTH)
        .attr('height', HEIGHT);

    const timelineScale = d3.scaleLinear()
      .domain(this.timeline.getInterval())
      .range([0, WIDTH])
      .nice();
    
    const xAxis = d3.axisBottom(timelineScale).tickFormat(n => n)

    const gTimeline = svg.append('g').attr('class', 'timeline');

    gTimeline.append('g')
      .attr('transform', 'translate(0, 400)')
      .call(xAxis);
    
    svg.append('g')
      .attr('class', 'arcs')
      .selectAll('similarities')
      .data(this.similarities.getLinks(0.09))
      .enter()
        .append('path')
        .attr('d', d => {
          const startYear = this.timeline.getYearForBarcode(d.Source);
          const start = timelineScale(startYear);

          const endYear = this.timeline.getYearForBarcode(d.Target);
          const end = timelineScale(endYear);

          const height = 430;

          return ['M', start, height - 30,    // the arc starts at the coordinate x=start, y=height-30 (where the starting node is)
            'A',                            // This means we're gonna build an elliptical arc
            (start - end)/2, ',',    // Next 2 lines are the coordinates of the inflexion point. Height of this point is proportional with start - end distance
            (start - end)/2, 0, 0, ',',
            start < end ? 1 : 0, end, ',', height-30] // We always want the arc on top. So if end is before start, putting 0 here turn the arc upside down.
            .join(' ');
        })
        .style('stroke-width', d => d.Weight * 5);

    svg.selectAll('.dot')
      .data(this.timeline.getCounts())
      .enter()
        .append('circle')
        .attr('class', 'works-per-year')
        .attr('r', d => 2 + d.count * 2)
        .attr('cx', d => timelineScale(d.year))
        .attr('cy', 400);
  }

}

const app = new App(document.getElementById('app'));
app.loadData().then(() => app.render());