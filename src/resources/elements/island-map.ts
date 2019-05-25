import { inject } from 'aurelia-framework';
import { EventAggregator } from 'aurelia-event-aggregator';
import { LeafletMap } from '../../services/leaflet-map';
import { IslandLocation } from '../../services/messages';
import { Island, Location } from '../../services/poi-types';

@inject(EventAggregator)
export class IslandMap {
  mapId = 'islands-map';
  mapHeight = 445;
  map: LeafletMap;

  constructor(private ea: EventAggregator) {
    ea.subscribe(IslandLocation, msg => {
      this.renderDonation(msg.location);
    });
  }

  renderDonation(location: Location) {
    if (this.map) {
      this.map.addMarker(location);
      this.map.moveTo(12, location);
    }
  }

  attached() {
    const mapConfig = {
      location: { lat: 53.2734, lng: -7.7783203 },
      zoom: 8,
      minZoom: 7
    };
    this.map = new LeafletMap(this.mapId, mapConfig, 'Terrain');
  }
}
