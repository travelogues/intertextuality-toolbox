export default class Timeline {

  constructor(records) {
    // A list of distinct years that appear as publication dates in the records
    const years = new Set();

    // An index barcode -> year
    this.barcodeIndex = {}

    // An index year -> records
    this.recordIndex = {};

    records.forEach(r => {
      years.add(r.date);

      r.barcodes.forEach(c =>
        this.barcodeIndex[c] = r.date);

      if (this.recordIndex[r.date])
        this.recordIndex[r.date].push(r);
      else
        this.recordIndex[r.date] = [ r ];
    });

    this.years = [ ...years ]; // As array
    this.years.sort();

    this.years = this.years.map(y => ({ year: y, count: this.recordIndex[y].length }));
  }

  getCounts = () => this.years;

  getInterval = () => [ this.years[0].year, this.years[this.years.length - 1].year ];

  getYearForBarcode = year =>
    this.barcodeIndex[year];

  getRecordsForYear = year =>
    this.recordIndex[year];

}