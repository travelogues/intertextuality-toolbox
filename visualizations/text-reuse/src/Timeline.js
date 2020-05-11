export default class Timeline {

  constructor(records) {
    // A list of distinct years that appear as publication dates in the records
    const years = new Set();

    // An index barcode -> year
    this.barcodeIndex = {}

    // An index barcode -> record
    this.barcodeRecordIndex = {}

    // An index year -> records
    this.recordIndex = {};

    // Experimental: record reissues
    this.reissues = []; 

    records.forEach(r => {
      years.add(r.date);

      r.barcodes.forEach(c => {
        this.barcodeIndex[c] = r.date;
        this.barcodeRecordIndex[c] = r;
      });

      if (this.recordIndex[r.date])
        this.recordIndex[r.date].push(r);
      else
        this.recordIndex[r.date] = [ r ];

      const work_title = r.work_title.split(';')[0];

      if (work_title) {
        let matchedGroup = false;
        this.reissues.find(group => {
          const match = group.find(r => {
            return r.work_title.split(';')[0] == work_title;
          });

          if (match)
            matchedGroup = group;
        }); 

        if (matchedGroup)
          matchedGroup.push(r);
        else 
          this.reissues.push([ r ]);
      }
    });

    // For performance, create a 'reissue' marker in the recor
    this.reissues.forEach(group => { 
      // Sort original first
      group.sort((a, b) => a.date - b.date);

      for (let i=0; i<group.length; i++) {
        group[i].reissueOf = group[0].identifier;
      }
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

  isReissueOf = (barcodeA, barcodeB) => {
    const a = this.barcodeRecordIndex[barcodeA];
    const b = this.barcodeRecordIndex[barcodeB];

    console.log(a);
    console.log(b);

    const isReissue = a && b && a.reissueOf === b.reissueOf;

    console.log('isReissue: ' + isReissue);
    return isReissue;
  }

}