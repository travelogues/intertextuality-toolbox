import Papa from 'papaparse';

export default class SimilaritiesSpatial {

  constructor(data) {
    const csv = Papa.parse(data, { header: false });

    const nonEmptyRows = csv.data
      .filter(row => row.length === 4 && row[3] > 0)
      .map(row => (
        { Source: row[0], Target: row[1], Weight: parseFloat(row[3]) }
      ));

    const nodes = [];
    nonEmptyRows.forEach(row => {
      nodes.push(row.Source);
      nodes.push(row.Target);
    });

    this.data = {
      nodes: [...new Set(nodes)], // Distinct
      links: nonEmptyRows
    };
  }

  // TODO duplication...
  getRange = () => {
    let min = 1;
    let max = 0;
    
    this.data.links.forEach(l => {
      if (l.Weight < min) min = l.Weight;
      if (l.Weight > max) max = l.Weight;
    });

    return [ min, max ];
  }

  getLinks = range =>
    this.data.links.filter(link => link.Weight >= range[0] && link.Weight <= range[1]);

  getLinksForBarcode = (barcode, opt_range) => {
    if (opt_range)
      return this.data.links.filter(r => 
        (r.Source == barcode || r.Target == barcode) && r.Weight >= opt_range[0] && r.Weight <= opt_range[1]);
    else  
      return this.data.links.filter(r => r.Source == barcode || r.Target == barcode);
  } 

}