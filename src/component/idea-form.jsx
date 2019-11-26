import React from 'react';
import OpenStadComponentImageUpload from './openstad-component-formelements/image-upload.jsx';
import OpenStadComponentFormelementsInputWithCounter from './openstad-component-formelements/input-with-counter.jsx';

'use strict';

export default class IdeasForm extends React.Component {

  constructor(props) {

    super(props);

		// config
		let defaultConfig = {
			ideaId: null,
      formfields: {
        title: '',
        summary: '',
        description: '',
        type: '',
        theme: '',
        images: [],
      },
      titleMinLength: 10,
      titleMaxLength: 20,
      summaryMinLength: 20,
      summaryMaxLength: 140,
      descriptionMinLength: 140,
      descriptionMaxLength: 5000,
    };

    // todo: normaal oplossen
    let formfields = Object.assign(defaultConfig.formfields, this.props.config.formfields);
		this.config = Object.assign(defaultConfig, this.config, this.props.config || {})
		this.config.formfields = formfields;

    // this.config.formfields.title = 'Morbi scelerisque';
		// this.config.formfields.summary = 'Morbi scelerisque, libero in rutrum tincidunt, dui sapien feugiat justo, eget egestas ligula nulla nec erat. maecenas tempus tempor eros. ';
		// this.config.formfields.description = 'Morbi scelerisque, libero in rutrum tincidunt, dui sapien feugiat justo, eget egestas ligula nulla nec erat. maecenas tempus tempor eros. donec a justo. curabitur tellus. pellentesque risus. fusce at arcu. ut lacinia mi vel lectus. phasellus imperdiet. fusce luctus lacus a odio. in et turpis at libero tristique vulputate. sed varius ipsum. suspendisse potenti. suspendisse potenti. donec tempus arcu quis metus.';
		// this.config.formfields.type = 'Kans';
		// this.config.formfields.theme = 'Groen';
		// this.config.formfields.images = [];

    this.state = {
      formfields: this.config.formfields,
			ideaId: this.config.ideaId,
      latlng: this.config.latlng,
      address: this.config.address,
    };

    this.handleFieldChange = this.handleFieldChange.bind(this);

  }

	componentDidMount(prevProps, prevState) {
	}

  handleFieldChange(name, value) {
    let state = { ...this.state };
    state.formfields[name] = value;
    this.setState(state)
    this.dispatchUpdateEditIdea(state.formfields)

	  // tmp: type
	  if (name == 'type') {
      if (!this.state.formfields['type']) {
		    this['form-warning-type'].style.display = 'block';
		    isValid = false;
	    } else {
		    this['form-warning-type'].style.display = 'none';
	    }
	  }

	  // tmp: theme
	  if (name == 'theme') {
      if (!this.state.formfields['theme']) {
		    this['form-warning-theme'].style.display = 'block';
		    isValid = false;
	    } else {
		    this['form-warning-theme'].style.display = 'none';
	    }
	  }

  }

  // todo: als hadlefieldchange met meerder waarden in een { key: value } formaat gaat werken dan kan deze weg
  handleLocationChange({location, address}) {
    let state = { ...this.state };
    state.formfields['location'] = { coordinates: [ location.lat, location.lng ] };
    state.formfields['address'] = address;
    this.setState(state)
    this.dispatchUpdateEditIdea(state.formfields)
  }

  
  dispatchUpdateEditIdea(idea) {
		var event = new CustomEvent('updateEditIdea', { detail: { idea } });
		document.dispatchEvent(event);
  }

  validateIdea() {

    var self = this;
    
	  var isValid = true;

	  // location
	  if (self.state.formfields['location']) {
			self['form-warning-location'].style.display = 'none';
		} else {
			self['form-warning-location'].style.display = 'block';
			isValid = false;
		}

	  // title
	  if (!self.titleField.validate()) {
		  isValid = false;
	  }

	  // summary
	  if (!self.summaryField.validate()) {
		  isValid = false;
	  }

	  // description
	  if (!self.descriptionField.validate()) {
		  isValid = false;
	  }

	  // type
	  if (!self.state.formfields['type']) {
		  self['form-warning-type'].style.display = 'block';
		  isValid = false;
	  } else {
		  self['form-warning-type'].style.display = 'none';
	  }

	  // theme
	  if (!self.state.formfields['theme']) {
		  self['form-warning-theme'].style.display = 'block';
		  isValid = false;
	  } else {
		  self['form-warning-theme'].style.display = 'none';
	  }

	  // images
	  // document.querySelector('#form-warning-images').style.display = 'none';
	  // if ( imageuploader && imageuploader.getFiles ) {
		//   var images = imageuploader.getFiles();
		//   images.forEach(function(image) {
		//     if (!image.serverId) {
		//   	  document.querySelector('#form-warning-images').style.display = 'block';
		//   	  isValid = false;
		//     }
		//   });
	  // }

	  // time ?

	  return isValid;

  }

  submitIdea() {

    var self = this;

    console.log(1);
	  if ( !self.validateIdea() ) return;

	  if (!self.config.api.isUserLoggedIn) return alert('Je bent niet ingelogd');

	  var url = self.config.api.url + '/api/site/' + self.config.siteId + '/idea';
		let headers = Object.assign(( self.config.api && self.config.api.headers || {} ), { "Content-type": "application/json" });

	  var body = {
			title: self.state.formfields['title'],
			summary: self.state.formfields['summary'],
			description: self.state.formfields['description'],
      location: JSON.stringify({ "type": "Point", ...self.state.formfields['location'] }),
			extraData: {
				type: self.state.formfields['type'],
				theme: self.state.formfields['theme'],
  			images: self.state.formfields['images'],
			},
	  }

    fetch(url, {
      method: 'POST',
      headers,
      body: JSON.stringify(body) // body data type must match "Content-Type" header
    })
      .then((response) => {
        if (!response.ok) throw Error(response)
        return response.json();
      })
      .then( json => {
		    var event = new CustomEvent('newIdeaStored', { detail: { idea: json } });
		    document.dispatchEvent(event);
      })
      .catch((err) => {
        console.log('Niet goed');
        console.log(err);
      });

  }
  
	render() {

    let self = this;

    console.log(self.state);

    return (
			<div id={self.id} className={self.props.className || 'openstad-component-info-block-idea-form'} ref={el => (self.instance = el)}>

			  <div className="osc-spacer"></div>

        <form className="osc-form">

				  <input type="hidden" id="extraData" name="extraData" value=""/>
          
				  <h1>Kans of knelpunt toevoegen</h1>

          <div className="osc-form-group">
					  <h2>
            Naam
					  </h2>
            {self.state.formfields.userName}
          </div>

          <div className="osc-form-group">
					  <h2>
            Een locatie vlakbij
					  </h2>
            {self.state.formfields.address || 'Geen adres gevonden'}
						<div className="osc-form-warning" style={{ display: 'none' }} ref={ el => this['form-warning-location'] = el  }>Geen locatie geselecteerd</div>
          </div>

          <div className="osc-form-group">
					  <h2>
						  Titel
					  </h2>
					  <div className="osc-form-info">
						  Geef je voorstel een duidelijke titel, zodat anderen jouw inzending makkelijk kunnen vinden en direct snappen waar het over gaat.
					  </div>
				    <OpenStadComponentFormelementsInputWithCounter ref={el => (self.input = el)} config={{ name: "titel", minLength: self.config.titleMinLength, maxLength: self.config.titleMaxLength }} value={this.state.formfields.title} onChange={(data) => self.handleFieldChange('title', data.value)} ref={el => (self.titleField = el)}/>
          </div>

          <div className="osc-form-group">
					  <h2>
						  Kans of knelpunt?
					  </h2>
					  <div className="osc-form-info">
						  Wilt u deze inzending bestempelen als een kans of als een knelpunt voor de wijk?
					  </div>
            <select className="openstad-default-select" value={this.state.formfields.type} onChange={() => self.handleFieldChange('type', self.typeField.value)} ref={el => (self.typeField = el)}>
              <option value="">Maak een keuze</option>
              <option value="Kans">Kans</option>
              <option value="Knelpunt">Knelpunt</option>
            </select>
						<div className="osc-form-warning" style={{ display: 'none' }} ref={ el => this['form-warning-type'] = el  }>Je hebt nog geen keuze gemaakt</div>
          </div>

          <div className="osc-form-group">
					  <h2>
						  Thema
					  </h2>
					  <div className="osc-form-info">
						  Bij welk thema hoort uw inzending?
					  </div>
            <select className="openstad-default-select" value={this.state.formfields.theme} onChange={() => self.handleFieldChange('theme', self.themeField.value)} ref={el => (self.themeField = el)}>
              <option value="">Maak een keuze</option>
              <option value="Auto">Auto</option>
              <option value="Fiets">Fiets</option>
              <option value="Voetganger">Voetganger</option>
              <option value="Recreëren">Recreëren</option>
              <option value="Schoon">Schoon</option>
              <option value="Groen">Groen</option>
              <option value="Geluid">Geluid</option>
              <option value="Overig">Overig</option>
            </select>
						<div className="osc-form-warning" style={{ display: 'none' }} ref={ el => this['form-warning-theme'] = el  }>Je hebt geen thema geseleceteerd</div>
          </div>

          <div className="osc-form-group">
					  <h2>
						  Samenvatting
					  </h2>
					  <div className="osc-form-info">
						  Vertel in maximaal {this.config.summaryMinLength} tekens iets meer over je plan.
					  </div>
				    <OpenStadComponentFormelementsInputWithCounter ref={el => (self.input = el)} config={{ name: "samenvatting", inputType: 'textarea', minLength: self.config.summaryMinLength, maxLength: self.config.summaryMaxLength }} value={this.state.formfields.summary} onChange={(data) => self.handleFieldChange('summary', data.value)} ref={el => (self.summaryField = el)}/>
          </div>

          <div className="osc-form-group">
					  <h2>
						  Beschrijving
					  </h2>
					  <div className="osc-form-info">
						  Gebruik de ruimte hieronder om je voorstel verder uit te leggen. 
					  </div>
				    <OpenStadComponentFormelementsInputWithCounter ref={el => (self.input = el)} config={{ name: "bechrijving", inputType: 'textarea', minLength: self.config.descriptionMinLength, maxLength: self.config.descriptionMaxLength }} value={this.state.formfields.description} onChange={(data) => self.handleFieldChange('description', data.value)} ref={el => (self.descriptionField = el)}/>
          </div>

          <OpenStadComponentImageUpload config={{ title: 'Afbeeldingen', infoText: 'Let op: Stuur alleen een foto mee die je zelf gemaakt hebt! Foto\'s van anderen kunnen auteursrechtelijk beschermd zijn. Je hebt toestemming nodig van de fotograaf om die foto te uploaden.' }} name="images" value={this.state.formfields.title} handleFieldChange={self.handleFieldChange}/>

          <br/>
          <br/>
          <a className="openstad-button openstad-button-blue" onClick={() => self.submitIdea()} ref={el => (self.submitButton = el)}>Versturen</a>
          <br/>
          <br/>
          <br/>

        </form>

			</div>
    );

  }

}
