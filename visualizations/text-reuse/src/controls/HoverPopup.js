/**
 * TODO this is slowly getting way too big. Perhaps use a framework? (Svelte?)
 */
export default class HoverPopup {

  constructor(year, linkSet, containerEl, x, y) {
    this.elem = document.createElement('DIV');
    this.elem.className = 'mouseover-popup';
    this.elem.style.top = `${y - 3}px`;
    this.elem.style.left = `${x - 3}px`;

    const h1 = document.createElement('H1');
    h1.innerHTML = `${year} <span>(${linkSet.records.length} works)</span>`;
    this.elem.appendChild(h1);

    const barcodes = document.createElement('UL');
    barcodes.className = 'barcodes';    
    linkSet.records.forEach(record => {
      const li = document.createElement('LI');
      li.innerHTML = `<a href="${record.urls[0]}" title="${record.work_title || record.title_full}" target="_blank">${record.identifier}</a>`;
      barcodes.appendChild(li); 
    });
    this.elem.appendChild(barcodes);

    // Similar nodes - NGRAM
    this._renderPairList(linkSet.ngram, this.elem, 'Text Reuse', 'ngram');

    // Similar nodes - Spatial
    this._renderPairList(linkSet.spatial, this.elem, 'Common Places', 'spatial');

    containerEl.append(this.elem);

    // this.elem.addEventListener('mouseleave', () => this.destroy());
  }

  _renderPairList = (pairs, parentEl, label, className) => {
    const container = document.createElement('DIV');
    container.className = `pairs-container ${className}`;
    container.appendChild(document.createTextNode(label));

    const ul = document.createElement('UL');
    pairs.forEach(pair => {
      const li = document.createElement('LI');
      li.innerHTML = `<a href="#" target="_blank">${pair.Source}</a> - <a href="#" target="_blank">${pair.Target}</a> (${pair.Weight.toFixed(3)})`;
      ul.appendChild(li);
    });

    container.appendChild(ul);
    parentEl.appendChild(container);
  }

  destroy = () => {
    if (this.elem.parentNode)
      this.elem.parentNode.removeChild(this.elem);
  }

}