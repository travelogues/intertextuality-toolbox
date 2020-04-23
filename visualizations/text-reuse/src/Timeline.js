export default class Timeline {

  constructor(records) {
    // A list of distinct years that appear as publication dates in the records
    const years = new Set();

    // An index barcode -> year
    this.barcodeIndex = {}

    // An index year -> records
    const index = {};

    records.forEach(r => {
      years.add(r.date);

      r.barcodes.forEach(c =>
        this.barcodeIndex[c] = r.date);

      if (index[r.date])
        index[r.date].push(r);
      else
        index[r.date] = [ r ];
    });

    this.years = [ ...years ]; // As array
    this.years.sort();

    this.years = this.years.map(y => ({ year: y, count: index[y].length }));
  }

  getCounts = () => this.years;

  getInterval = () => [ this.years[0].year, this.years[this.years.length - 1].year ];

  /** Reverse look up for the year of a given barcode **/ 
  getYearForBarcode = year =>
    this.barcodeIndex[year];

}