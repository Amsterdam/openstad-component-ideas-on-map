import React from 'react';
import OpenStadComponentImageUpload from './openstad-component-formelements/image-upload.jsx';

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
		this.config = Object.assign(defaultConfig, this.props.config, this.config || {})
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
      location: this.config.location,
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
  }

  // todo: als hadlefieldchange met meerder waarden in een { key: value } formaat gaat werken dan kan deze weg
  handleLocationChange({location, address}) {
    let state = { ...this.state };
    state.formfields['location'] = location;
    state.formfields['address'] = address;
    console.log(state);
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
	  if (self.state.formfields['title'].length < this.config.titleMinLength) {
      // todo: dit moet niet met querySelector maar met self.whatever
		  self['form-warning-title'].style.display = 'block';
		  self['form-warning-title'].innerHTML = self['form-warning-title'].innerHTML.replace('[[langkort]]', 'kort');
		  isValid = false;
	  } else if (self.state.formfields['title'].length > this.config.titleMaxLength) {
		  self['form-warning-title'].style.display = 'block';
		  self['form-warning-title'].innerHTML = self['form-warning-title'].innerHTML.replace('[[langkort]]', 'lang');
		  isValid = false;
	  } else {
		  self['form-warning-title'].style.display = 'none';
	  }

	  // summary
	  if (self.state.formfields['summary'].length < this.config.summaryMinLength) {
      // todo: dit moet niet met querySelector maar met self.whatever
		  self['form-warning-summary'].style.display = 'block';
		  self['form-warning-summary'].innerHTML = self['form-warning-summary'].innerHTML.replace('[[langkort]]', 'kort');
		  isValid = false;
	  } else if (self.state.formfields['summary'].length > this.config.summaryMaxLength) {
		  self['form-warning-summary'].style.display = 'block';
		  self['form-warning-summary'].innerHTML = self['form-warning-summary'].innerHTML.replace('[[langkort]]', 'lang');
		  isValid = false;
	  } else {
		  self['form-warning-summary'].style.display = 'none';
	  }

	  // description
	  if (self.state.formfields['description'].length < this.config.descriptionMinLength) {
      // todo: dit moet niet met querySelector maar met self.whatever
		  self['form-warning-description'].style.display = 'block';
		  self['form-warning-description'].innerHTML = self['form-warning-description'].innerHTML.replace('[[langkort]]', 'kort');
		  isValid = false;
	  } else if (self.state.formfields['description'].length > this.config.descriptionMaxLength) {
		  self['form-warning-description'].style.display = 'block';
		  self['form-warning-description'].innerHTML = self['form-warning-description'].innerHTML.replace('[[langkort]]', 'lang');
		  isValid = false;
	  } else {
		  self['form-warning-description'].style.display = 'none';
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
    
	  if ( !self.validateIdea() ) return;

	  if (!self.config.userJWT) return alert('Je bent niet ingelogd');

	  var url = self.config.apiUrl + '/api/site/' + self.config.siteId + '/idea';

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
      headers: {
        'Content-Type': 'application/json',
			  'X-Authorization': 'Bearer ' + self.config.userJWT,
      },
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

    return (
			<div id={self.id} className={self.props.className || 'openstad-component-info-block-idea-form'} ref={el => (self.instance = el)}>

        <form className="openstad-component-form">

				  <input type="hidden" id="extraData" name="extraData" value=""/>
          
				  <h1>Kans of knelpunt toevoegen</h1>

          <div className="openstad-component-form-group">
					  <h2>
            Een locatie vlakbij
					  </h2>
            {self.state.formfields.address || 'Geen adres gevonden'}
						<div className="form-warning-container"><span className="form-warning" ref={ el => this['form-warning-location'] = el  }>Geen locatie geselecteerd</span></div>
          </div>

          <div className="openstad-component-form-group">
					  <h2>
						  Titel
					  </h2>
					  <div className="form-info">
						  Geef je voorstel een duidelijke titel, zodat anderen jouw inzending makkelijk kunnen vinden en direct snappen waar het over gaat.
					  </div>
            <input type="text" name="title" value={this.state.formfields.title} onChange={() => this.handleFieldChange('title', self.titleField.value)} ref={el => (self.titleField = el)}/>
              <br/>
              <div id="charsLeftTitle" className="charsLeft">
                <div className="min error visible">Nog minimaal <span>2</span> tekens</div>
                <div className="max">Je hebt nog <span>0</span> tekens over.</div>
              </div>
						  <div className="form-warning-container"><span className="form-warning" ref={ el => this['form-warning-title'] = el  }>Je titel is te [[langkort]]</span></div>
          </div>

          <div className="openstad-component-form-group">
					  <h2>
						  Kans of knelpunt?
					  </h2>
					  <div className="form-info">
						  Wilt u deze inzending bestempelen als een kans of als een knelpunt voor de wijk?
					  </div>
            <select className="openstad-default-select" value={this.state.formfields.type} onChange={() => this.handleFieldChange('type', self.typeField.value)} ref={el => (self.typeField = el)}>
              <option value="">Maak een keuze</option>
              <option value="Kans">Kans</option>
              <option value="Knelpunt">Knelpunt</option>
            </select>
						<div className="form-warning-container"><span className="form-warning" ref={ el => this['form-warning-type'] = el  }>Je hebt nog geen keuze gemaakt</span></div>
          </div>

          <div className="openstad-component-form-group">
					  <h2>
						  Thema
					  </h2>
					  <div className="form-info">
						  Bij welk thema hoort uw inzending?
					  </div>
            <select className="openstad-default-select" value={this.state.formfields.theme} onChange={() => this.handleFieldChange('theme', self.themeField.value)} ref={el => (self.themeField = el)}>
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
						<div className="form-warning-container"><span className="form-warning" ref={ el => this['form-warning-theme'] = el  }>Je hebt geen thema geseleceteerd</span></div>
          </div>

          <div className="openstad-component-form-group">
					  <h2>
						  Samenvatting
					  </h2>
					  <div className="form-info">
						  Vertel in maximaal {this.config.summaryMinLength} tekens iets meer over je plan.
					  </div>
            <textarea type="text" name="summary" value={this.state.formfields.summary} onChange={() => this.handleFieldChange('summary', self.summaryField.value)} ref={el => (self.summaryField = el)}/>
              <br/>
              <div id="charsLeftSummary" className="charsLeft">
                <div className="min error visible">Nog minimaal <span>2</span> tekens</div>
                <div className="max">Je hebt nog <span>0</span> tekens over.</div>
              </div>
						  <div className="form-warning-container"><span className="form-warning" ref={ el => this['form-warning-summary'] = el  }>Je samenvatting is te [[langkort]]</span></div>
          </div>

          <div className="openstad-component-form-group">
					  <h2>
						  Beschrijving
					  </h2>
					  <div className="form-info">
						  Gebruik de ruimte hieronder om je voorstel verder uit te leggen. 
					  </div>
            <textarea type="text" name="description" value={this.state.formfields.description} onChange={() => this.handleFieldChange('description', self.descriptionField.value)} ref={el => (self.descriptionField = el)}/>
              <br/>
              <div id="charsLeftDescription" className="charsLeft">
                <div className="min error visible">Nog minimaal <span>2</span> tekens</div>
                <div className="max">Je hebt nog <span>0</span> tekens over.</div>
              </div>
						  <div className="form-warning-container"><span className="form-warning" ref={ el => this['form-warning-description'] = el  }>Je beschrijving is te [[langkort]]</span></div>
          </div>

          <OpenStadComponentImageUpload config={{ title: 'Afbeeldingen', infoText: 'Let op: Stuur alleen een foto mee die je zelf gemaakt hebt! Foto\'s van anderen kunnen auteursrechtelijk beschermd zijn. Je hebt toestemming nodig van de fotograaf om die foto te uploaden.' }} name="images" value={this.state.formfields.title} handleFieldChange={self.handleFieldChange}/>

          <a className="openstad-button openstad-button-blue" onClick={() => self.submitIdea()} ref={el => (self.submitButton = el)}>Versturen</a>
          <br/>
          <br/>
          <br/>

        </form>

			</div>
    );

  }

}
