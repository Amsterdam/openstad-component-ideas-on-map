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
		this.config = Object.assign(this.defaultConfig, this.config, props.config || {})

    // defaults
    this.config.clustering.showCoverageOnHover = typeof this.config.showCoverageOnHover != 'undefined' ? this.config.showCoverageOnHover : false;
    this.config.clustering.onClusterAnimationEnd = this.config.clustering.onClusterAnimationEnd || this.onClusterAnimationEnd.bind(this);
    this.config.clustering.maxClusterRadius = 30; // default is 80

    this.ideas = [];

  }

  addIdea(idea) {
    let self = this;
    self.ideas.push(idea);
    // todo: dit moet met een iconCreate functie
    let type = idea && eval(`idea.${self.config.typeField}`);
		let tmp = self.config.types.find(entry => entry.name == type);
		let color = tmp && tmp.color || 'black';
		let html = `<svg viewBox="0 0 26 26"><circle cx="13" cy="13" r="13" fill="${color}"/></svg>`;
		let icon = L.divIcon({ html: html, className: 'openstad-component-ideas-on-map-icon', iconSize: L.point(26, 26), iconAnchor: [13, 13] });
    self.addMarker({ lat: idea.location.coordinates[0], lng: idea.location.coordinates[1], data: idea, icon });
  }

  getVisibleIdeas() {
    let self = this;
    let visibleIdeas = self.markers
        .filter( marker => marker.visible && marker.data && self.map.getBounds().contains(marker.getLatLng()))
        .map( marker => marker.data );
    self.setState({ visibleIdeas });
    return visibleIdeas;
  }

  showMarkers() {
	  var self = this;
    self.markers.forEach((marker) => {
      self.showMarker(marker)
    });
    self.setBoundsAndCenter(self.config.polygon || self.map.markers);
  }

  hideMarkers({ exception }) {
	  var self = this;
    if (exception) self.setBoundsAndCenter([{ lat: exception.location.coordinates[0], lng: exception.location.coordinates[1] }]);
    self.markers.forEach((marker) => {
      if (!(exception && marker.data && marker.data.id && exception.id == marker.data.id)) {
        self.hideMarker(marker)
      }
    });
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
