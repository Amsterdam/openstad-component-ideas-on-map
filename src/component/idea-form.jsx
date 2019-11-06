import React from 'react';
// TODO: import OpenStadComponentTextarea from './openstad-component-formelements/textarea.jsx';

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
        images: [],
      },
      titleMinLength: 10,
      titleMaxLength: 20,
      summaryMinLength: 20,
      summaryMaxLength: 140,
      descriptionMinLength: 140,
      descriptionMaxLength: 5000,
    };
		this.config = Object.assign(defaultConfig, this.props.config || {})

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
	  // if (document.querySelector('#location').value) {
		//   document.querySelector('#form-warning-location').style.display = 'none';
	  // } else {
		//   document.querySelector('#form-warning-location').style.display = 'block';
		//   isValid = false;
	  // }

	  // title
    console.log(self.titleField.value.length,this.config.titleMinLength);
	  if (self.titleField.value.length < this.config.titleMinLength) {
      // todo: dit moet niet met querySelector maar met self.whatever
		  document.querySelector('#form-warning-title').style.display = 'block';
		  document.querySelector('#form-warning-title').innerHTML = document.querySelector('#form-warning-title').innerHTML.replace('[[langkort]]', 'kort');
		  isValid = false;
	  } else if (self.titleField.value.length > this.config.titleMaxLength) {
		  document.querySelector('#form-warning-title').style.display = 'block';
		  document.querySelector('#form-warning-title').innerHTML = document.querySelector('#form-warning-title').innerHTML.replace('[[langkort]]', 'lang');
		  isValid = false;
	  } else {
		  document.querySelector('#form-warning-title').style.display = 'none';
	  }

	  // summary
	  if (self.summaryField.value.length < this.config.summaryMinLength) {
      // todo: dit moet niet met querySelector maar met self.whatever
		  document.querySelector('#form-warning-summary').style.display = 'block';
		  document.querySelector('#form-warning-summary').innerHTML = document.querySelector('#form-warning-summary').innerHTML.replace('[[langkort]]', 'kort');
		  isValid = false;
	  } else if (self.summaryField.value.length > this.config.summaryMaxLength) {
		  document.querySelector('#form-warning-summary').style.display = 'block';
		  document.querySelector('#form-warning-summary').innerHTML = document.querySelector('#form-warning-summary').innerHTML.replace('[[langkort]]', 'lang');
		  isValid = false;
	  } else {
		  document.querySelector('#form-warning-summary').style.display = 'none';
	  }

	  // description
	  if (self.descriptionField.value.length < this.config.descriptionMinLength) {
      // todo: dit moet niet met querySelector maar met self.whatever
		  document.querySelector('#form-warning-description').style.display = 'block';
		  document.querySelector('#form-warning-description').innerHTML = document.querySelector('#form-warning-description').innerHTML.replace('[[langkort]]', 'kort');
		  isValid = false;
	  } else if (self.descriptionField.value.length > this.config.descriptionMaxLength) {
		  document.querySelector('#form-warning-description').style.display = 'block';
		  document.querySelector('#form-warning-description').innerHTML = document.querySelector('#form-warning-description').innerHTML.replace('[[langkort]]', 'lang');
		  isValid = false;
	  } else {
		  document.querySelector('#form-warning-description').style.display = 'none';
	  }

	  // type
	  // if (document.querySelector('#type').value) {
		//   document.querySelector('#form-warning-type').style.display = 'none';
	  // } else {
		//   document.querySelector('#form-warning-type').style.display = 'block';
		//   openStep(1, document.querySelector('#type').offsetTop - 80);
		//   isValid = false;
	  // }

	  // categorie
	  // if (document.querySelector('#categorie').value) {
		//   document.querySelector('#form-warning-categorie').style.display = 'none';
	  // } else {
		//   document.querySelector('#form-warning-categorie').style.display = 'block';
		//   openStep(1, document.querySelector('#categorie').offsetTop - 80);
		//   isValid = false;
	  // }

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
    console.log('validateIdea', self.validateIdea());

	  if ( !self.validateIdea() ) return;

	  if (!userJWT) return showError('Je bent niet ingelogd');

	  var url = apiUrl + '/api/site/' + siteId + '/idea';

	  var body = {
			title: 'Nieuw probleem',
			summary: "Een nieuwe inzending op 'Afval in West'",
			description: form.querySelector('#description').value,
			extraData: {
				categorie: form.querySelector('#categorie').value,
				type: form.querySelector('#type').value,
				solution: form.querySelector('#solution').value,
				time: {
					weekday: JSON.parse(form.querySelector('#weekday').value || '[]'),
					daypart: JSON.parse(form.querySelector('#daypart').value || '[]'),
					timeofday: form.querySelector('#timeofday').value,
				},
				images: []
			},
	  }

	  if (form.querySelector('#location').value) {
		  body.location = JSON.stringify({
			  "type": "Point",
			  "coordinates": JSON.parse(form.querySelector('#location').value)
		  })
	  }

	  if ( imageuploader && imageuploader.getFiles ) {
		  var images = imageuploader.getFiles();
		  images.forEach(function(image) {
			  try {
				  var serverId = JSON.parse(image.serverId)
				  body.extraData.images.push(serverId.url)
			  } catch(err) { console.log(err) }
		  });
	  }

	  $.ajax({
		  url: url,
		  dataType: "json",
		  crossDomain: true,
		  method: "POST",
		  data: body,
		  beforeSend: function(request) {
			  request.setRequestHeader("Accept", "application/json");
			  request.setRequestHeader('X-Authorization', 'Bearer ' + userJWT);
		  },
		  success: function(json) {
			  currentMarker.isInput = false;
			  currentMarker.idea = json;
			  currentInput = {};
			  window.location.hash = '#ideaId=' + json.id;
			  document.querySelector('#info-block').innerHTML = document.querySelector('#new-idea-result-container').innerHTML;
		  },
		  error: function(error) {
			  showError(error);
		  }
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
          </div>

          <div className="openstad-component-form-group">
					  <h2>
						  Titel plan
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
						<span id="form-warning-title" className="form-warning">Je titel is te [[langkort]]</span>
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
						  <span id="form-warning-summary" className="form-warning">Je samenvatting is te [[langkort]]</span>
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
						<span id="form-warning-description" className="form-warning">Je beschrijving is te [[langkort]]</span>
          </div>

          {/* <a className="openstad-button openstad-button-blue" onClick={() => self.submitIdea()} ref={el => (self.submitButton = el)}>Versturen</a> */}
          <a className="openstad-button openstad-button-blue" onClick={() => alert('To do')} ref={el => (self.submitButton = el)}>Versturen</a>

        </form>

			</div>
    );

  }

}
