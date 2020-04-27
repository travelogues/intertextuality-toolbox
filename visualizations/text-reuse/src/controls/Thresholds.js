import noUiSlider from 'nouislider';
import EventEmitter from 'tiny-emitter';

import 'nouislider/distribute/nouislider.css';

export default class ThresholdControls extends EventEmitter {

  constructor(args) {
    super();

    const { 
      containerEl, 
      ngramStart,
      spatialStart
    } = args;

    this.state = this._initState(args);

    const ngramSliderEl = document.createElement('DIV');
    ngramSliderEl.className = 'control';
    containerEl.appendChild(ngramSliderEl);
    const ngramSlider = this._createSlider(ngramStart, ngramSliderEl);
    ngramSlider.on('change', range => {
      this.state.ngram = range.map(num => parseFloat(num)); // Nasty
      this.emit('change', this.state);
    });


    const spatialSliderEl = document.createElement('DIV');
    spatialSliderEl.className = 'control';
    containerEl.appendChild(spatialSliderEl);
    const spatialSlider = this._createSlider(spatialStart, spatialSliderEl);  
    spatialSlider.on('change', range => {
      this.state.spatial = range.map(num => parseFloat(num));
      this.emit('change', this.state);
    });
  }

  _initState = args => {
    return {
      ngram: [ args.ngramStart, 1 ],
      spatial: [ args.spatialStart, 1 ]
    }
  }

  _createSlider(start, elem) {
    const div = document.createElement('DIV');
    elem.appendChild(div);

    return noUiSlider.create(div, {
      range: { min: 0, max: 1 },
      start: [ start, 1 ],  
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