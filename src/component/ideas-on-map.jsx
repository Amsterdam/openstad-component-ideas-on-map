import React from 'react';
import ReactDOM from 'react-dom';
import OpenStadComponent from 'openstad-component/src/index.jsx';
import Filterbar from './filterbar.jsx';
import InfoBlock from './info-block.jsx';
import IdeaForm from './idea-form.jsx';
import IdeaDetails from './idea-details.jsx';
import Map from './map.jsx';

// TODO: clean up; ik gebruikte eerst setNewIdea en setSelected, maar nu onNewIdeaClick en onSelectedIdeaClick; trek dat gelijk

'use strict';

export default class OpenStadComponentIdeasOnMap extends OpenStadComponent {

  constructor(props) {

    super(props);

		var self = this;

		// config
		self.defaultConfig = {
			title: 'Kansen en knelpunten' || 'Inzendingen',
      editMarker: undefined,
      currentPolygon: undefined,
      types: [
        { name: "Auto", color: "#FF9100", icon: "" },
        { name: "Fiets", color: "#00A03C", icon: "" },
        { name: "Voetganger", color: "#004699", icon: "" },
        { name: "Recreëren", color: "#FF9100", icon: "" },
        { name: "Schoon", color: "#EC0000", icon: "" },
        { name: "Groen", color: "#004699", icon: "" },
        { name: "Geluid", color: "#00A03C", icon: "" },
        { name: "Overig", color: "#EC0000", icon: "" },
      ],
      areas: [
        { name: "Heel West",
          value: "Heel West",
          polygon: [{ "lng": 4.8353454, "lat": 52.3731265 }, { "lng": 4.8422025, "lat": 52.3721002 }, { "lng": 4.8421761, "lat": 52.3695836 }, { "lng": 4.8455807, "lat": 52.3696369 }, { "lng": 4.8476385, "lat": 52.369853 }, { "lng": 4.8477361, "lat": 52.3695885 }, { "lng": 4.8484176, "lat": 52.369697 }, { "lng": 4.8504835, "lat": 52.3653302 }, { "lng": 4.8504956, "lat": 52.3643692 }, { "lng": 4.8501587, "lat": 52.3638376 }, { "lng": 4.8494487, "lat": 52.3633001 }, { "lng": 4.8495059, "lat": 52.3610989 }, { "lng": 4.8489152, "lat": 52.3608149 }, { "lng": 4.8487824, "lat": 52.3578658 }, { "lng": 4.8504012, "lat": 52.3578553 }, { "lng": 4.8518982, "lat": 52.357844 }, { "lng": 4.8538275, "lat": 52.3581295 }, { "lng": 4.854723, "lat": 52.3578629 }, { "lng": 4.854635, "lat": 52.3577532 }, { "lng": 4.85436, "lat": 52.3572975 }, { "lng": 4.8540881, "lat": 52.3564026 }, { "lng": 4.8547969, "lat": 52.3562758 }, { "lng": 4.8698903, "lat": 52.3601067 }, { "lng": 4.8699397, "lat": 52.3600231 }, { "lng": 4.8714122, "lat": 52.3603737 }, { "lng": 4.8712647, "lat": 52.3605634 }, { "lng": 4.8715288, "lat": 52.3605997 }, { "lng": 4.8716826, "lat": 52.3604277 }, { "lng": 4.8738605, "lat": 52.3608533 }, { "lng": 4.8738525, "lat": 52.3610213 }, { "lng": 4.8740097, "lat": 52.3610407 }, { "lng": 4.8741351, "lat": 52.3608935 }, { "lng": 4.8750611, "lat": 52.3608041 }, { "lng": 4.8756501, "lat": 52.3606138 }, { "lng": 4.876429, "lat": 52.3607996 }, { "lng": 4.8765642, "lat": 52.3606177 }, { "lng": 4.876929, "lat": 52.3606957 }, { "lng": 4.8768495, "lat": 52.360911 }, { "lng": 4.8771709, "lat": 52.3609696 }, { "lng": 4.8774, "lat": 52.3607583 }, { "lng": 4.8819952, "lat": 52.3620427 }, { "lng": 4.8813956, "lat": 52.3630818 }, { "lng": 4.8808146, "lat": 52.3634904 }, { "lng": 4.8793708, "lat": 52.3643261 }, { "lng": 4.8792691, "lat": 52.3649574 }, { "lng": 4.8787082, "lat": 52.3658206 }, { "lng": 4.8775395, "lat": 52.3667815 }, { "lng": 4.8767523, "lat": 52.3685117 }, { "lng": 4.8754901, "lat": 52.3697867 }, { "lng": 4.8745065, "lat": 52.3718772 }, { "lng": 4.8745782, "lat": 52.3725454 }, { "lng": 4.8753796, "lat": 52.373407 }, { "lng": 4.8755899, "lat": 52.3743025 }, { "lng": 4.8799131, "lat": 52.3813052 }, { "lng": 4.8796339, "lat": 52.3819128 }, { "lng": 4.880478, "lat": 52.3822531 }, { "lng": 4.8818058, "lat": 52.3843528 }, { "lng": 4.882637, "lat": 52.3854107 }, { "lng": 4.8846503, "lat": 52.3883466 }, { "lng": 4.8857963, "lat": 52.3881476 }, { "lng": 4.8911796, "lat": 52.3884502 }, { "lng": 4.8937804, "lat": 52.3886712 }, { "lng": 4.8956658, "lat": 52.3888313 }, { "lng": 4.8927982, "lat": 52.3933453 }, { "lng": 4.8850924, "lat": 52.398824 }, { "lng": 4.8762366, "lat": 52.3945287 }, { "lng": 4.8726422, "lat": 52.3948206 }, { "lng": 4.8719896, "lat": 52.3947192 }, { "lng": 4.8719508, "lat": 52.3952766 }, { "lng": 4.8715979, "lat": 52.39538 }, { "lng": 4.8667403, "lat": 52.393136 }, { "lng": 4.8643092, "lat": 52.3927072 }, { "lng": 4.8627057, "lat": 52.3938521 }, { "lng": 4.8603441, "lat": 52.3949382 }, { "lng": 4.858593, "lat": 52.3952782 }, { "lng": 4.8569204, "lat": 52.3953667 }, { "lng": 4.8569896, "lat": 52.3938363 }, { "lng": 4.8573172, "lat": 52.3938424 }, { "lng": 4.8574043, "lat": 52.3920751 }, { "lng": 4.8589526, "lat": 52.3912226 }, { "lng": 4.8592744, "lat": 52.3905434 }, { "lng": 4.8592929, "lat": 52.3887899 }, { "lng": 4.8449045, "lat": 52.3887733 }, { "lng": 4.8451066, "lat": 52.3850658 }, { "lng": 4.8446526, "lat": 52.3850638 }, { "lng": 4.8390117, "lat": 52.3850241 }, { "lng": 4.8392807, "lat": 52.3829687 }, { "lng": 4.838548, "lat": 52.3808766 }, { "lng": 4.836707, "lat": 52.3763581 }, { "lng": 4.8353454, "lat": 52.3731265 }] },
        { name: "De Baarsjes",
          value: "De Baarsjes",
          polygon: [{"lng":4.8558724,"lat":52.374202},{"lng":4.8577714,"lat":52.3681953},{"lng":4.8582878,"lat":52.3648623},{"lng":4.8592819,"lat":52.3648966},{"lng":4.8598228,"lat":52.364783},{"lng":4.8613989,"lat":52.3664539},{"lng":4.8661845,"lat":52.3717538},{"lng":4.8664001,"lat":52.3721596},{"lng":4.8663889,"lat":52.372566},{"lng":4.865846,"lat":52.3733281},{"lng":4.8646717,"lat":52.3734961},{"lng":4.8641583,"lat":52.3750737},{"lng":4.8640923,"lat":52.3752839},{"lng":4.8559599,"lat":52.3743342},{"lng":4.8558724,"lat":52.374202}] },
        { name: "Oud West",
          value: "Oud West",
          polygon: [{"lng":4.8546816,"lat":52.3568634},{"lng":4.855041,"lat":52.3563261},{"lng":4.858839,"lat":52.3572696},{"lng":4.8625458,"lat":52.3582427},{"lng":4.8646701,"lat":52.3588487},{"lng":4.868731,"lat":52.3597955},{"lng":4.8703188,"lat":52.3601231},{"lng":4.8717136,"lat":52.3604376},{"lng":4.8738218,"lat":52.3609651},{"lng":4.8763055,"lat":52.3607226},{"lng":4.8776842,"lat":52.3608635},{"lng":4.878167,"lat":52.3610044},{"lng":4.8812676,"lat":52.3618856},{"lng":4.8807043,"lat":52.3623966},{"lng":4.8798675,"lat":52.3633663},{"lng":4.8795778,"lat":52.3639428},{"lng":4.8792613,"lat":52.3644931},{"lng":4.8791272,"lat":52.3650598},{"lng":4.8787785,"lat":52.3656691},{"lng":4.8779202,"lat":52.3663734},{"lng":4.8773838,"lat":52.366809},{"lng":4.8772336,"lat":52.3676312},{"lng":4.8769385,"lat":52.3681389},{"lng":4.8754311,"lat":52.3697536},{"lng":4.8746211,"lat":52.3714043},{"lng":4.8744494,"lat":52.3720594},{"lng":4.8744602,"lat":52.3723083},{"lng":4.8752166,"lat":52.3729895},{"lng":4.8745943,"lat":52.3731762},{"lng":4.870925,"lat":52.3724033},{"lng":4.8680175,"lat":52.3717974},{"lng":4.8665959,"lat":52.3715648},{"lng":4.8654211,"lat":52.3703825},{"lng":4.8641176,"lat":52.3689905},{"lng":4.8628623,"lat":52.3676443},{"lng":4.8616499,"lat":52.3662554},{"lng":4.8604268,"lat":52.3648862},{"lng":4.8602505,"lat":52.3647431},{"lng":4.8591448,"lat":52.3634056},{"lng":4.8580772,"lat":52.3621247},{"lng":4.8575783,"lat":52.3615515},{"lng":4.857117,"lat":52.3604245},{"lng":4.856248,"lat":52.3592681},{"lng":4.8555345,"lat":52.3580035},{"lng":4.855299,"lat":52.357674},{"lng":4.855269,"lat":52.3576447},{"lng":4.855115,"lat":52.3574166},{"lng":4.8549071,"lat":52.3571512},{"lng":4.85479,"lat":52.3570018},{"lng":4.8546816,"lat":52.3568634}] },
      ],
      titleField: 'title',
      summaryField: 'summary',
      typeField: self.config.typeField || 'extraData.thema',
      areaField: self.config.areaField || 'extraData.gebied',
      userJWT: self.config.userJWT,
		};
		self.config = Object.assign(self.defaultConfig, self.config || {})

    // defaults
    self.config.doSearchFunction = self.config.doSearchFunction || self.doSearch.bind(self);
    self.config.map = self.config.map || {};
    self.config.map.onMapClick = self.config.map.onMapClick || self.onMapClick.bind(self);
    self.config.map.onMarkerClick = self.config.map.onMarkerClick || self.onMarkerClick.bind(self);
    self.config.map.clustering = self.config.map.clustering || {};
    self.config.map.clustering.onClusterClick = self.config.map.clustering.onClusterClick || self.onClusterClick.bind(self);

    self.state = {
      ideas: [],
      status: 'default', // default, idea-selected, location-selected, idea-details, idea-form
      currentIdea: null,
      editIdea: {
        ideaId: null,
      }
    }
    
  }

	componentDidMount(prevProps, prevState) {
    let self = this;

    // when the map is ready
		self.map.instance.addEventListener('mapIsReady', function(e) {

      // fetch the data
      self.fetchData();

      // handle map changes
      self.map.map.on('zoomend', function() {
        self.onChangeMapBoundaries();
      });
      self.map.map.on('moveend', function() {
        self.onChangeMapBoundaries();
      });

    });

    // handle filter changes
		self.filterbar.instance.addEventListener('typeFilterUpdate', function(event) {
      self.onChangeTypeFilter(event.detail.value);
    });
		self.filterbar.instance.addEventListener('areaFilterUpdate', function(event) {
      self.onChangeAreaFilter(event.detail.value);
    });

    // handle infoblock changes
		document.addEventListener('updateSelectedIdea', function(event) {
      self.onUpdateSelectedIdea(event.detail.idea);
    });
		document.addEventListener('updateNewIdea', function(event) {
      self.onUpdateNewIdea(event.detail.idea);
    });
		document.addEventListener('updateEditIdea', function(event) {
      self.onUpdateEditIdea(event.detail.idea);
    });
		document.addEventListener('selectedIdeaClick', function(event) {
      self.onSelectedIdeaClick();
    });
		document.addEventListener('newIdeaClick', function(event) {
      self.onNewIdeaClick();
    });
    
	}

  fetchData() {

    let self = this;
    let url = `${self.config.apiUrl  }/api/site/${  self.config.siteId  }/idea?includeVoteCount=1&includeArguments=1`;
		
    fetch(url, {
      headers: {
        'Content-Type': 'application/json',
      },
    })
      .then((response) => {
        return response.json();
      })
      .then( json => {
        //let xxx;
        let ideas = json.filter( idea => idea.location )
        self.map.addMarkers(ideas.map( idea => {
          //if ( idea.id==91 ) xxx = idea
					let type = idea && eval(`idea.${self.config.typeField}`);
					let tmp = self.config.types.find(entry => entry.name == type);
					let color = tmp && tmp.color || 'black';
					let html = `<svg viewBox="0 0 26 26"><circle cx="13" cy="13" r="13" fill="${color}"/></svg>`;
          // TODO: je moet hier geen L. gebruiken; hang dat in de map
					let icon = L.divIcon({ html: html, className: 'openstad-component-ideas-on-map-icon', iconSize: L.point(26, 26), iconAnchor: [13, 13] });
          // TODO: temp oplosing voor images moet dus beter
          idea.image = (idea.posterImage && idea.posterImage.key) || (idea.extraData && idea.extraData.images && idea.extraData.images[0]) || "https://stemvanwest.amsterdam.nl/img/placeholders/idea.jpg";
					return { lat: idea.location.coordinates[0], lng: idea.location.coordinates[1], data: idea, icon }
				}));
        self.setState({ ideas });
        self.map.setBoundsAndCenter(self.map.markers);

        //self.setState({ ideas, status: 'idea-details', currentIdea: xxx });
        //self.setNewIdea(null);
        //self.setSelectedIdea(xxx);

				
      })
      .catch((err) => {
        console.log('Niet goed');
        console.log(err);
      });

  }

	doSearch(searchValue, callback) {

		let self = this;

		let searchResult = { ideas: [], locations: [] };
		this.state.ideas.forEach((idea) => {
			let title = eval(`idea.${self.config.titleField}`) || '';
			let summary = eval(`idea.${self.config.summaryField}`) || '';
			if (title.match(searchValue) || summary.match(searchValue)) {
				searchResult.ideas.push({
					text: title,
					onClick: function() { self.onUpdateSelectedIdea(idea) },
				})
			}
		});

		callback(searchValue, searchResult)
	}

  setCurrentPolygon(polygon) {
    let state = { ...this.state };
    state.currentPolygon = polygon ? this.map.createCutoutPolygon(polygon): undefined;
    this.setState(state);
  }

  removeCurrentPolygon() {
    this.map.removePolygon(this.state.currentPolygon)
    let state = { ...this.state };
    state.currentPolygon = undefined;
    this.setState(state);
  }

  createEditMarker(location) {
    if (this.state.editMarker) {
      this.removeEditMarker()
    };
    this.setState({...this.state, editMarker: this.map.addMarker({ lat: location.lat, lng: location.lng, doNotCluster: true })});
  }

  updateEditMarker(location) {
    this.map.updateMarker(this.state.editMarker, { location: { lat: location.lat, lng: location.lng } });
  }

  removeEditMarker() {
    if (this.state.editMarker) this.map.removeMarker(this.state.editMarker);
    this.setState({ ...this.state, editMarker: null });
  }

  getVisibleIdeas() {
    let self = this;
    let visibleIdeas = self.map.markers
        .filter( marker => marker.visible && marker.data && self.map.map.getBounds().contains(marker.getLatLng()))
        .map( marker => marker.data );
    return visibleIdeas;
  }

  setNewIdea(idea) {
    let self = this;
    if (idea) {
      self.map.fadeMarkers({exception: [location, ]});
      if (self.state.editMarker) {
        self.updateEditMarker({ lat: idea.location.coordinates[0], lng: idea.location.coordinates[1] });
      } else {
        self.createEditMarker({ lat: idea.location.coordinates[0], lng: idea.location.coordinates[1] });  
      }
      if (self.infoblock) {
        self.map.getPointInfo({ lat: idea.location.coordinates[0], lng: idea.location.coordinates[1] }, null, function(json, marker) {
          self.infoblock.setNewIdea({ location: idea.location, address: json });
        })
        self.infoblock.updateIdeas({ ideas: self.getVisibleIdeas().filter( x => x.id != idea.id ), sortOrder: 'distance', showSortButton: false, center: { lat: idea.location.coordinates[0], lng: idea.location.coordinates[1] }, maxLength: 5 });
      }
    } else {
      self.map.unfadeAllMarkers();
      self.removeEditMarker();
      if (self.infoblock) {
        self.infoblock.setNewIdea(null);
        self.infoblock.updateIdeas({ ideas: self.getVisibleIdeas(), showSortButton: true });
      }
    }
  }

  setSelectedIdea(idea) {
    this.selectedIdea = idea;
    if (idea) {
      this.map.fadeMarkers({exception: idea});
      if (this.infoblock) {
        this.infoblock.setSelectedIdea(idea);
        this.infoblock.updateIdeas({ ideas: this.getVisibleIdeas().filter( x => x.id != idea.id ), sortOrder: 'distance', showSortButton: false, center: { lat: idea.location.coordinates[0], lng: idea.location.coordinates[1] }, maxLength: 5 });
      }
    } else {
      this.map.unfadeAllMarkers();
      if (this.infoblock) {
        this.infoblock.setSelectedIdea(null);
        this.infoblock.updateIdeas({ ideas: this.getVisibleIdeas(), showSortButton: true });
      }
    }
  }
  
	onMapClick(event) {
    if (this.selectedIdea || this.state.editMarker) {
      this.setState({ ...this.state, status: 'default', currentIdea: null });
      this.setSelectedIdea(null);
      this.setNewIdea(null);
      this.infoblock.updateIdeas({ ideas: this.getVisibleIdeas(), showSortButton: true });
    } else {
      this.setState({ ...this.state, status: 'location-selected', currentIdea: null });
      this.setSelectedIdea(null);
      this.setNewIdea({ id: 'New Idea', location: { coordinates: [ event.latlng.lat, event.latlng.lng ] } });
    }
    this.map.updateFading();
  }

	onMarkerClick(event) {
    this.setState({ ...this.state, status: 'idea-selected', currentIdea: event.target.data });
    this.setNewIdea(null);
    this.setSelectedIdea(event.target.data);
  }

	onClusterClick(event) {
    this.setState({ ...this.state, status: 'default', currentIdea: null });
    this.setNewIdea(null);
    this.setSelectedIdea(null);
  }

  onChangeMapBoundaries() {
    this.map.updateFading();
    if (!( this.selectedIdea || this.state.editMarker )) {
      if (this.infoblock) {
        this.infoblock.updateIdeas({ ideas: this.getVisibleIdeas(), showSortButton: true });
      }
    }
  }

	onUpdateEditIdea(idea) {
    this.setState({ ...this.state, editIdea: { ...idea }, currentIdea: idea });
  }

	onUpdateSelectedIdea(idea) {
    this.setState({ ...this.state, status: 'default', currentIdea: idea }, function() {
      this.setNewIdea(null);
      this.setSelectedIdea(idea);
    });
  }

	onUpdateNewIdea(idea) {
    this.setState({ ...this.state, status: 'default', currentIdea: idea }, function() {
      this.setSelectedIdea(null);
      this.setNewIdea(idea);
    });
  }

  onSelectedIdeaClick(idea) {
    this.setState({ ...this.state, status: 'idea-details' }, function() {
    });
  };
  
  onNewIdeaClick() {
    this.setState({ ...this.state, status: 'idea-form' }, function() {
    });
  };

  onChangeTypeFilter(value) {
    let self = this;
    self.setSelectedIdea(null);
    self.setNewIdea(null);
	  self.map.setFilter(function(marker) {
		  if (value && value !== '0') {
			  return marker.data && eval(`marker.data.${self.config.typeField}`) && eval(`marker.data.${self.config.typeField}`) == value;
		  } else {
			  return true;
		  }
	  })
    self.onChangeMapBoundaries(); // todo: rename
  }

  onChangeAreaFilter(area) {
    let self = this;
    self.setSelectedIdea(null);
    self.setNewIdea(null);
    self.removeCurrentPolygon();
    self.setCurrentPolygon( area && area.polygon );
    self.map.setBoundsAndCenter(area && area.polygon || self.map.markers);
  }

	render() {

    let infoHTML = null; // todo: ik denk dat dit naar infoblock moet
    switch(this.state.status) {

      case 'idea-details':
        let config = { // TODO: niet bij elke render
          titleField: this.config.titleField,
          summaryField: this.config.summaryField,
          typeField: this.config.typeField,
          areaField: this.config.areaField,
          userJWT: this.config.userJWT,
        };
        infoHTML = (
			    <IdeaDetails id={this.divId + '-infoblock'} config={config} idea={this.state.currentIdea} key="dfwk fgdfsbbfgd hdg" className="openstad-component-ideas-on-map-info" ref={el => (this.ideadetails = el)}/>
        );
        break;

      case 'idea-form':
        infoHTML = (
			    <IdeaForm id={this.divId + '-infoblock'} config={{ ...this.config, formfields: { ...this.state.editIdea } }} className="openstad-component-ideas-on-map-info" ref={el => (this.ideaform = el)}/>
        );
        break;

      default:
       infoHTML = (
			   <InfoBlock id={this.divId + '-infoblock'} config={{ title: this.config.title, titleField: this.config.titleField, summaryField: this.config.summaryField, types: this.config.types }} className="openstad-component-ideas-on-map-info" ref={el => (this.infoblock = el)}/>
        );
        break;

    }

    return (
			<div id={this.divId} className={`openstad-component-ideas-on-map openstad-component-ideas-on-map-${this.state.status}`} ref={el => (this.instance = el)}>
				<Filterbar id={this.divId + '-filterbar'} config={{ types: this.config.types, areas: this.config.areas, doSearchFunction: this.config.doSearchFunction, title: this.config.title }} className="openstad-component-ideas-on-map-filterbar" ref={el => (this.filterbar = el)}/>
        {infoHTML}
				<Map id={this.divId + '-map'} className="openstad-component-ideas-on-map-map" config={{ ...this.config.map, types: this.config.types, typeField: this.config.typeField }} ref={el => (this.map = el)}/>
			</div>
    );

  }

}
