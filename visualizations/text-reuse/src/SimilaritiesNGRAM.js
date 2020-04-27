import Papa from 'papaparse';

const parseBarcode = filepath =>
  filepath.substring(filepath.lastIndexOf('/') + 1, filepath.lastIndexOf('.txt'));

export default class SimilaritiesNGRAM {

  constructor(data) {
    const csv = Papa.parse(data, { header: true });

    const nonEmptyRows = csv.data
      .filter(row => row.Source && row.Target)
      .map(row => (
        { Source: parseBarcode(row.Source), Target: parseBarcode(row.Target), Weight: row.Weight }
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