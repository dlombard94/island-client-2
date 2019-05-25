import {Location, Island} from "./poi-types";

export class TotalUpdate {
  total: number;
  constructor(total: number) {
    this.total = total;
  }
}

export class IslandLocation {
  location: Location;
  // island: Island;
  constructor(location: Location) {
    this.location = location;
    // this.island = island;
  }
}
