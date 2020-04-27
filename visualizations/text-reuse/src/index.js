import axios from 'axios';
import * as d3 from 'd3';
import Timeline from './Timeline';
import SimilaritiesNGRAM from './SimilaritiesNGRAM';
import SimilaritiesSpatial from './SimilartiesSpatial';
import { WIDTH, HEIGHT } from './Const';

import './index.scss';

/** Similarity selection threshold **/
const NGRAM_THRESHOLD = 0.09;
const SPATIAL_THRESHOLD = 0.16;

/** GUI: vertical offset of the x-axis **/
const VERTICAL_OFFSET = 200;

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

    // Return when all have loaded
    return Promise.all([fMetadata, fSimilaritiesNGRAM, fSimilaritiesSpatial ]);
  }

  onMouseOver = d => this.updateArcs(d.year);

  onMouseOut = d => this.updateArcs();

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
        .attr('transform', `translate(0, ${VERTICAL_OFFSET})`)
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
        .attr('cy', VERTICAL_OFFSET)
        .on('mouseover', this.onMouseOver)
        .on('mouseout', this.onMouseOut)
  }

  updateArcs = year => {
    const { ngram, spatial } = year ? 
      this._getLinksForYear(year) :
      { 
        ngram: this.similaritiesNGRAM.getLinks(NGRAM_THRESHOLD),
        spatial: this.similaritiesSpatial.getLinks(SPATIAL_THRESHOLD)
      };
      
    this.arcContainer.selectAll('.arcs').remove();
  
    this._renderArcs(ngram, this.arcContainer, true);
    this._renderArcs(spatial, this.arcContainer, false);
  }

  /** Helper to get the links for a specific year **/
  _getLinksForYear = year => {
    const records = this.timeline.getRecordsForYear(year);

    // Flatmap those barcodes!
    const barcodes = records.reduce((barcodes, record) =>
      barcodes.concat(record.barcodes), []);

    // Flatmap those links!
    const ngram = barcodes.reduce((links, barcode) => 
      links.concat(this.similaritiesNGRAM.getLinksForBarcode(barcode, NGRAM_THRESHOLD)), []);

    const spatial = barcodes.reduce((links, barcode) => 
      links.concat(this.similaritiesSpatial.getLinksForBarcode(barcode, SPATIAL_THRESHOLD)), []);

    return { ngram, spatial };
  }

  // Cf. https://www.d3-graph-gallery.com/graph/arc_template.html
  _renderArcs = (links, container, top) => {
    container.append('g')
      .attr('class', 'arcs')
      .selectAll('.similarity')
      .data(links)
      .enter()
        .append('path')
        .attr('class', 'similarity')
        .attr('d', d => {
          const startYear = this.timeline.getYearForBarcode(d.Source);
          const start = this.scale(startYear);

          const endYear = this.timeline.getYearForBarcode(d.Target);
          const end = this.scale(endYear);

          const height = VERTICAL_OFFSET + 30;

          const direction = top ? 
            (start < end ? 1 : 0) :
            (start > end ? 1 : 0);

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
            direction, 
            end, ',', 
            height - 30] 
            .join(' ');         
        })
        .style('stroke-width', d => d.Weight * 5);
  }

}

const app = new App(document.getElementById('app'));
app.loadData().then(() => app.render());