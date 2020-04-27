import axios from 'axios';
import * as d3 from 'd3';
import { WIDTH, HEIGHT } from './Const';
import Timeline from './Timeline';
import SimilaritiesNGRAM from './SimilaritiesNGRAM';

import './index.scss';
import SimilaritiesSpatial from './SimilartiesSpatial';

const THRESHOLD = 0.09;

class App {

  constructor(elem) {
    this.elem = elem;
  }

  loadData = () => {
    // Load metadata
    const fMetadata = axios.get('TravelogueD16.json')
      .then(response =>
        this.timeline = new Timeline(response.data));

    // Load NGRAM similarities
    const fSimilaritiesNGRAM = axios.get('similarities_ngram_16C.csv')
      .then(response =>
        this.similaritiesNGRAM = new SimilaritiesNGRAM(response.data));

    // Load geo similarities
    const fSimilaritiesSpatial = axios.get('similarities_spatial_16C.csv')
      .then(response =>
        this.similaritiesSpatial = new SimilaritiesSpatial(response.data));

    // Return when both have loaded
    return Promise.all([fMetadata, fSimilaritiesNGRAM ]);
  }

  onMouseOver = d => {
    const records = this.timeline.getRecordsForYear(d.year);

    // Flatmap those barcodes!
    const barcodes = records.reduce((barcodes, record) =>
      barcodes.concat(record.barcodes), []);
    
    // Flatmap those links!
    const links = barcodes.reduce((links, barcode) => 
      links.concat(this.similaritiesNGRAM.getLinksForBarcode(barcode, THRESHOLD)), []);

    console.log(`Barcodes dated ${d.year}: ${barcodes.join(', ')}`);
    console.log('Links:');
    links.forEach(l => console.log(`http://data.onb.ac.at/ABO/+${l.Source} - http://data.onb.ac.at/ABO/+${l.Target} (${l.Weight})`));

    this.updateArcs(links);
  }

  onMouseOut = d => {
    this.updateArcs();
  }

  render() {
    this.svg = d3.select(this.elem)
      .append('svg')
        .attr('width', WIDTH)
        .attr('height', HEIGHT);

    this.scale = d3.scaleLinear()
      .domain(this.timeline.getInterval())
      .range([0, WIDTH])
      .nice();
    
    const axis = d3.axisBottom(this.scale).tickFormat(n => n)

    this.svg
      .append('g')
        .attr('class', 'timeline')
        .attr('transform', 'translate(0, 400)')
        .call(axis);

    this.arcContainer = this.svg.append('g');
    this.dotContainer = this.svg.append('g');

    this.updateArcs();
    this.drawDots();
  }

  drawDots = () => {
    this.dotContainer.selectAll('.works-per-year').remove();

    this.dotContainer.selectAll('dots')
      .data(this.timeline.getCounts())
      .enter()
        .append('circle')
        .attr('class', 'works-per-year')
        .attr('r', d => 2 + d.count * 2)
        .attr('cx', d => this.scale(d.year))
        .attr('cy', 400)
        .on('mouseover', this.onMouseOver)
        .on('mouseout', this.onMouseOut)
  }

  updateArcs = links => {
    const linksToRender = links ? links : this.similaritiesNGRAM.getLinks(THRESHOLD);
  
    this.arcContainer.selectAll('.arcs').remove();
  
    this.arcContainer.append('g')
      .attr('class', 'arcs')
      .selectAll('similarities')
      .data(linksToRender)
      .enter()
        .append('path')
        .attr('d', d => {
          const startYear = this.timeline.getYearForBarcode(d.Source);
          const start = this.scale(startYear);

          const endYear = this.timeline.getYearForBarcode(d.Target);
          const end = this.scale(endYear);

          const height = 430;

          return [
            // the arc starts at the coordinate x=start, y=height-30 (where the starting node is)
            'M', start, height - 30,    
            // This means we're gonna build an elliptical arc
            'A',
            // Next 2 lines are the coordinates of the inflexion point. 
            // Height of this point is proportional with start - end distance
            (start - end) / 2, ',',
            (start - end) / 2, 0, 0, ',',
            // We always want the arc on top. So if end is before start, putting 0 here turn the arc upside down.
            start < end ? 1 : 0, end, ',', 
            height - 30] 
            .join(' ');
        })
        .style('stroke-width', d => d.Weight * 5);
  }

}

const app = new App(document.getElementById('app'));
app.loadData().then(() => app.render());