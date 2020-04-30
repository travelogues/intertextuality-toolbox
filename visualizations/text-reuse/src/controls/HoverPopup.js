/**
 * TODO this is slowly getting way too big. Perhaps use a framework? (Svelte?)
 */
export default class HoverPopup {

  constructor(year, linkSet, allRecords, containerEl, x, y, onClose) {
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
    this._renderPairList(linkSet.ngram, allRecords, this.elem, 'Text Reuse', 'ngram');

    // Similar nodes - Spatial
    this._renderPairList(linkSet.spatial, allRecords, this.elem, 'Common Places', 'spatial');

    containerEl.append(this.elem);

    this.elem.addEventListener('mouseleave', () => {
      this.destroy();
      onClose();
    });
  }

  _renderPairList = (pairs, records, parentEl, label, className) => {
    const container = document.createElement('DIV');
    container.className = `pairs-container ${className}`;
    container.appendChild(document.createTextNode(label));

    const baseURL = 'http://data.onb.ac.at/ABO/+';

    const ul = document.createElement('UL');

    // Sort pairs by weight, descending
    pairs.sort((a, b) => b.Weight - a.Weight);
 
    pairs.forEach(pair => {
      const li = document.createElement('LI');
      const w = `${(pair.Weight * 100).toFixed(1)}%`;
      
      const sourceRecord = records.find(r => r.barcodes.includes(pair.Source));
      const s = `${sourceRecord.identifier} - ${sourceRecord.work_title || sourceRecord.title_full} (${sourceRecord.date})`;

      const targetRecord = records.find(r => r.barcodes.includes(pair.Target));
      const t = `${targetRecord.identifier} - ${targetRecord.work_title || targetRecord.title_full} (${targetRecord.date})`;

      li.innerHTML = `<a href="${baseURL}${pair.Source}" target="_blank" title="${s}">${pair.Source}</a><span class="arrow">&harr;</span><a href="${baseURL}${pair.Target}" target="_blank" title="${t}">${pair.Target}</a><span class="pct">(${w})</span>`;
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