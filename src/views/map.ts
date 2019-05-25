import { LeafletMap } from '../services/leaflet-map';
import { ReviewService } from '../services/review-service';
import { inject } from 'aurelia-framework';

@inject(ReviewService)
export class Map {
  mapId = 'main-map';
  mapHeight = 600;
  map: LeafletMap;

  constructor(private rs: ReviewService) {}

  renderLocations() {
    for (let location of this.rs.locations) {
      // const donationStr = `${donation.candidate.firstName} ${donation.candidate.lastName} €${donation.amount.toString()}`;
      this.map.addMarker(location);
    }
  }

  attached() {
    const mapConfig = {
      location: { lat: 53.2734, lng: -7.7783203 },
      zoom: 8,
      minZoom: 1
    };
    this.map = new LeafletMap(this.mapId, mapConfig, 'Terrain');
    this.map.showZoomControl();
    this.map.showLayerControl();
  }
}
