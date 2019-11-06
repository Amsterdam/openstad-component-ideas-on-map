import React from 'react';
import OpenStadComponentNLMap from 'openstad-component-nlmap/src/component/map.jsx';

'use strict';

export default class Map extends OpenStadComponentNLMap {

  constructor(props) {

    super(props);

		// config
		this.defaultConfig = {
      editMarker: undefined,
      currentPolygon: undefined,
    };
		this.config = Object.assign(this.defaultConfig, this.config || {})

    // defaults
    // this.config.onMapClick = this.config.onMapClick || this.onMapClick.bind(this);
    // this.config.onMarkerClick = this.config.onMarkerClick || this.onMarkerClick.bind(this);
    this.config.clustering.iconCreateFunction = this.config.clustering.createClusterIcon || this.createClusterIcon.bind(this);
    this.config.clustering.showCoverageOnHover = typeof this.config.showCoverageOnHover != 'undefined' ? this.config.showCoverageOnHover : false;
    this.config.clustering.onClusterAnimationEnd = this.config.clustering.onClusterAnimationEnd || this.onClusterAnimationEnd.bind(this);
    this.config.clustering.maxClusterRadius = 30; // default is 80

  }

	createClusterIcon(cluster) {

    let self = this;
    let count = cluster.getChildCount();

    if (self.config.typeField && self.config.types && self.config.types.length) {
      
      // todo: configurable
      let count = cluster.getChildCount();
      let markers = cluster.getAllChildMarkers();

      let colors = {}
      let total = markers.length;
      let isFaded = false;
      markers.forEach((entry) => {
        let type = entry.data && eval(`entry.data.${self.config.typeField}`);
        let tmp = self.config.types.find(entry => entry.name == type);
        let color = tmp && tmp.color || 'black';
        if ( type == undefined ) type = 'undef'
        if ( !colors[color] ) colors[color] = 0;
        colors[color]++;
        if (entry.data && entry.data.isFaded) isFaded = true;
      });

      let html = '<svg viewBox="0 0 36 36"><circle cx="18" cy="18" r="14" fill="white"/>'

      let soFar = 0;
      Object.keys(colors).forEach((key) => {
        let myColor = key;
        let perc = 100 * colors[key] / total;
        let angle = (soFar / 100) * 360;
        
        html += `  <path
             d="M18 2.0845 a 15.9155 15.9155 0 0 1 0 31.831 a 15.9155 15.9155 0 0 1 0 -31.831"
             fill="none"
             transform="rotate(${angle}, 18, 18)"
             stroke="${myColor}"
             stroke-width="4"
             stroke-dasharray="${perc}, 100"
             />`;
        soFar = soFar + perc;
      });

      html += '<text x="18" y="21" text-anchor="middle" class="openstad-component-ideas-on-map-icon openstad-component-ideas-on-map-icon-text">' + count + '</text></svg>';

      return L.divIcon({ html: html, className: 'openstad-component-ideas-on-map-icon-cluster', iconSize: L.point(36, 36), iconAnchor: [18, 18], isFaded });

    } else {

		  return L.divIcon({ html: count, className: 'openstad-component-ideas-on-map-icon-cluster', iconSize: L.point(20, 20), iconAnchor: [20, 10] });

	  }
	}

  showMarkers() {
	  var self = this;
    self.markers.forEach((marker) => {
      self.showMarker(marker)
    });
    self.setBoundsAndCenter(self.markers);
  }

  hideMarkers({ exception }) {
	  var self = this;
    self.markers.forEach((marker) => {
      if (!(exception && marker.data && marker.data.id && exception.id == marker.data.id)) {
        self.hideMarker(marker)
      }
    });
    self.setBoundsAndCenter([{ lat: exception.location.coordinates[0], lng: exception.location.coordinates[1] }]);
  }

  fadeMarkers({ exception }) {
    let self = this;
    self.markers.forEach((marker) => {
      if (!(exception && marker.data && marker.data.id && exception.id == marker.data.id)) {
        if (marker.data) marker.data.isFaded = true;
        let visibleParent = self.markerClusterGroup.getVisibleParent(marker);
        let ignore = visibleParent && visibleParent.getAllChildMarkers && visibleParent.getAllChildMarkers().find( m => m.data && m.data.isFaded === false );
        if (!ignore && visibleParent) {
          visibleParent.setOpacity(0.3);
        }
      }
    });
  }

  // fix for https://github.com/Leaflet/Leaflet.markercluster/issues/177
  updateFading() {
    let self = this;
    self.markers.forEach((marker) => {
      let visibleParent = self.markerClusterGroup.getVisibleParent(marker);
      if (visibleParent && marker.visible) {
        let ignore = visibleParent && visibleParent.getAllChildMarkers && visibleParent.getAllChildMarkers().find( m => m.data && m.data.isFaded === false );
        visibleParent.setOpacity(!ignore && marker.data && marker.data.isFaded ? 0.3 : 1);
      }
    });
  }

  unfadeAllMarkers() {
    let self = this;
    // markers
    self.markers.forEach((marker) => {
      if (marker.data) marker.data.isFaded = false;
      let visibleParent = self.markerClusterGroup.getVisibleParent(marker);
        if (visibleParent) {
          visibleParent.setOpacity(1);
        }
    });
  }

  onClusterAnimationEnd() {
    this.updateFading();
  }

}
