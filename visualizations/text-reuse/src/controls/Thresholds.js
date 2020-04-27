import noUiSlider from 'nouislider';
import EventEmitter from 'tiny-emitter';

import 'nouislider/distribute/nouislider.css';

export default class ThresholdControls extends EventEmitter {

  constructor(args) {
    super();

    const { 
      containerEl, 
      ngramRange, 
      ngramStart,
      spatialRange,
      spatialStart
    } = args;

    this.state = this._initState(args);

    const ngramSliderEl = document.createElement('DIV');
    ngramSliderEl.className = 'control';
    containerEl.appendChild(ngramSliderEl);
    const ngramSlider = this._createSlider(ngramRange, ngramStart, ngramSliderEl);
    ngramSlider.on('change', range => {
      this.state.ngram = range;
      this.emit('change', this.state);
    });


    const spatialSliderEl = document.createElement('DIV');
    spatialSliderEl.className = 'control';
    containerEl.appendChild(spatialSliderEl);
    const spatialSlider = this._createSlider(spatialRange, spatialStart, spatialSliderEl);  
    spatialSlider.on('change', range => {
      this.state.spatial = range;
      this.emit('change', this.state);
    });
  }

  _initState = args => {
    const ngramMax = args.ngramRange[1];
    const spatialMax = args.spatialRange[1];

    return {
      ngram: [ args.ngramStart, ngramMax ],
      spatial: [ args.patialStart, spatialMax]
    }
  }

  _createSlider(range, start, elem) {
    const div = document.createElement('DIV');
    elem.appendChild(div);

    const [ min, max ] = range;
    return noUiSlider.create(div, {
      range: { min: 0, max: 1 },
      start: [ start, max ],  
      connect: true,
      behaviour: 'tap-drag',
      tooltips: false,  
      pips: {
        mode: 'range',
        density: 2
      }
    });
  }

} 