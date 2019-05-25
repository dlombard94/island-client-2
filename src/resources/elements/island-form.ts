import { bindable } from 'aurelia-framework';
import { Island, Location } from '../../services/poi-types';
import { inject } from 'aurelia-framework';
import { ReviewService } from '../../services/review-service';

@inject(ReviewService)
export class IslandForm {
  name: string;
  area: number;
  category: string;
  description: string;
  @bindable islands: Island[];

  location: Location = { lat: 53.2734, lng: -7.7783203 };

  constructor(private rs: ReviewService) {
  }

  addIsland() {
    this.rs.createIsland(this.name, this.area, this.category, this.description, this.location);
  }
}
