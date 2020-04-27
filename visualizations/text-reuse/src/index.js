import axios from 'axios';
import * as d3 from 'd3';
import Timeline from './Timeline';
import SimilaritiesNGRAM from './SimilaritiesNGRAM';
import SimilaritiesSpatial from './SimilartiesSpatial';
import ThresholdsControl from './controls/Thresholds';
import HoverPopup from './controls/HoverPopup';
import { WIDTH, HEIGHT } from './Const';

import './index.scss';


/** GUI: vertical offset of the x-axis **/
const VERTICAL_OFFSET = 200;

/** Similarity selection threshold **/
let THRESHOLDS = {
  ngram:   [0.09, 1],
  spatial: [0.16, 1]
}

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
    return Promise.all([fMetadata, fSimilaritiesNGRAM, fSimilaritiesSpatial ]).then(result => {
      const [ _, similaritiesNGRAM, similaritiesSpatial ] = result;
      this.render();
      this.renderControls();
    });
  }

  onMouseOver = d => {
    const { layerX, layerY } = d3.event;
    const linkSet = this._getLinksForYear(d.year);

    if (this.hoverPopup)
      this.hoverPopup.destroy();

    this.hoverPopup = new HoverPopup(d.year, linkSet, this.elem, layerX, layerY);
    
    this.updateArcs(linkSet);
  }

  onMouseOut = () =>
    this.updateArcs();

  renderControls = (ngramRange, spatialRange) => {
    const containerEl = document.createElement('DIV');
    containerEl.className = 'controls';

    this.elem.appendChild(containerEl);

    const controls = new ThresholdsControl({
      containerEl, 
      ngramStart: THRESHOLDS.ngram[0],
      spatialStart: THRESHOLDS.spatial[0]
    });

    controls.on('change', ranges => {
      THRESHOLDS = ranges;
      this.updateArcs();
    });
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

  updateArcs = links => {
    const { ngram, spatial } = links ? links :
      { 
        ngram: this.similaritiesNGRAM.getLinks(THRESHOLDS.ngram),
        spatial: this.similaritiesSpatial.getLinks(THRESHOLDS.spatial)
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
      links.concat(this.similaritiesNGRAM.getLinksForBarcode(barcode, THRESHOLDS.ngram)), []);

    const spatial = barcodes.reduce((links, barcode) => 
      links.concat(this.similaritiesSpatial.getLinksForBarcode(barcode, THRESHOLDS.spatial)), []);

    return { records, ngram, spatial };
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
app.loadData();