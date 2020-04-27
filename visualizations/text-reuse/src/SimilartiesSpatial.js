import Papa from 'papaparse';

export default class SimilaritiesSpatial {

  constructor(data) {
    const csv = Papa.parse(data, { header: false });

    const nonEmptyRows = csv.data
      .filter(row => row.length === 4 && row[3] > 0)
      .map(row => (
        { Source: row[0], Target: row[1], Weight: row[3]  }
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

  getLinks = threshold =>
    this.data.links.filter(link => link.Weight > threshold);

  getLinksForBarcode = (barcode, opt_threshold) => {
    if (opt_threshold)
      return this.data.links.filter(r => (r.Source == barcode || r.Target == barcode) && r.Weight > opt_threshold);
    else  
      return this.data.links.filter(r => r.Source == barcode || r.Target == barcode);
  } 

}