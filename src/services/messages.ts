import {Location} from "./poi-types";

export class TotalUpdate {
  total: number;
  constructor(total: number) {
    this.total = total;
  }
}

export class IslandLocation {
  location: Location;
  constructor(location: Location) {
    this.location = location;
  }
}
