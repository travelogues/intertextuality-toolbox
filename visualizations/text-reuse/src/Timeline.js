export default class Timeline {

  constructor(records) {
    // A list of distinct years that appear as publication dates in the records
    const years = new Set();

    // An index year -> records
    this.index = {};

    records.forEach(r => {
      years.add(r.date);

      if (this.index[r.date])
        this.index[r.date].push(r);
      else
        this.index[r.date] = [ r ];
    });

    this.years = [ ...years ]; // As array
    this.years.sort();

    this.years = this.years.map(y => ({ year: y, count: this.index[y].length }));
  }

  getCounts = () => this.years;

  getInterval = () => [ this.years[0].year, this.years[this.years.length - 1].year ];

  getRecords = year => this.index[year];

}