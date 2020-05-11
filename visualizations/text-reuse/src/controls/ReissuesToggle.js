import EventEmitter from 'tiny-emitter';

export default class ReissuesToggle extends EventEmitter {

  constructor(parentEl) {
    super();

    const container = document.createElement('DIV');
    container.className = 'reissues-toggle';

    const checkboxLabel = document.createElement('LABEL');
    checkboxLabel.className = 'checkbox-label';
    checkboxLabel.appendChild(document.createTextNode('Show Reissues'));

    const checkbox = document.createElement('INPUT');
    checkbox.setAttribute('type', 'checkbox');
    checkbox.setAttribute('checked', true);
    checkboxLabel.appendChild(checkbox);

    const checkboxCustom = document.createElement('SPAN');
    checkboxCustom.className = 'checkbox-custom';
    checkboxLabel.appendChild(checkboxCustom);

    container.appendChild(checkboxLabel);

    parentEl.appendChild(container);

    checkbox.addEventListener('change', evt => {
      this.emit('change', evt.target.checked);
    });
  }

}