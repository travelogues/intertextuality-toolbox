import EventEmitter from 'tiny-emitter';

export default class ReissuesToggle extends EventEmitter {

  constructor(containerEl) {
    super();

    const checkbox = document.createElement('input');
    checkbox.setAttribute('type', 'checkbox');
    containerEl.appendChild(checkbox);

    checkbox.addEventListener('change', evt => {
      this.emit('change', evt.target.checked);
    });
  }

}