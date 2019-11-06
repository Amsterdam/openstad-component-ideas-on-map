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
    };

    this.handleFieldChange = this.handleFieldChange.bind(this);

  }

	componentDidMount(prevProps, prevState) {
    // filepond
		this._loadedFiles = 0;
    this.files = [
      "https://unpkg.com/filepond/dist/filepond.js",
      "https://unpkg.com/filepond-polyfill/dist/filepond-polyfill.js",
      "https://unpkg.com/filepond-plugin-image-preview/dist/filepond-plugin-image-preview.js",
      "https://unpkg.com/filepond-plugin-file-validate-type/dist/filepond-plugin-file-validate-type.js",
      "https://unpkg.com/filepond-plugin-file-validate-size/dist/filepond-plugin-file-validate-size.js",
      "https://unpkg.com/filepond-plugin-file-poster/dist/filepond-plugin-file-poster.js",
    ];
    this.loadNextFile();
	}

  loadNextFile() {
    var self = this;
    var file = self.files[self._loadedFiles];
    if (file) {
			let element;
			element = document.createElement('script');
			element.src = file;
			element.async = true;
			if (element) {
				element.onload = function() {
          self.loadNextFile();
				}
				document.body.appendChild(element);
			}
    }
		if (self._loadedFiles == self.files.length) {
      self.fileUploaderInit()
    }
		self._loadedFiles++;
  }
  
  handleFieldChange(name, value) {
    let state = { ...this.state };
    state.formfields[name] = value;
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

				  <input type="hidden" id="extraData" name="extraData" value=""/><br/>

          
				  <h1>Kans of knelpunt toevoegen</h1>

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

          <div className="openstad-component-form-group">
					  <h2>
						  Afbeelding
					  </h2>
					  <div className="form-info">
						  Let op: Stuur alleen een foto mee die je zelf gemaakt hebt! Foto's van anderen kunnen auteursrechtelijk beschermd zijn. Je hebt toestemming nodig van de fotograaf om die foto te uploaden.
					  </div>
						<fieldset className="filepondFieldset2">
							<span id="form-warning-images" className="form-warning">Het uploaden van images is nog niet afgerond</span>
							<input type="file" className="imageUploader-gebiedstool filepond-gebiedstool"/>
						</fieldset>
            <br/>
          </div>

          <a className="openstad-button openstad-button-blue" onClick={() => self.submitIdea()} ref={el => (self.submitButton = el)}>Versturen</a>

        </form>

			</div>
    );

  }

  fileUploaderInit() {

    let self = this;

		var fieldsetElement = document.querySelector('.filepondFieldset2');
		if (fieldsetElement) {
			FilePond.registerPlugin(FilePondPluginImagePreview);
			FilePond.registerPlugin(FilePondPluginFileValidateSize);
			FilePond.registerPlugin(FilePondPluginFileValidateType);
			FilePond.registerPlugin(FilePondPluginFilePoster);

			FilePond.setOptions({
				server: '/image'
			});

			var filePondSettings = {
				// set allowed file types with mime types
				acceptedFileTypes: ['image/*'],
				allowFileSizeValidation: true,
				maxFileSize: '5mb',
				name: 'image',
				maxFiles: 3,
				allowBrowse: true,
				files: [],
				server: {
					process: '/image',
					fetch: '/fetch-image?img='
				},
				imageResizeTargetWidth: 80,
				imageResizeTargetHeight: 80,
				imageCropAspectRatio: '1:1',
				labelIdle: "Sleep afbeelding(en) naar deze plek of <span class='filepond--label-action'>KLIK HIER</span>",
				labelInvalidField: "Field contains invalid files",
				labelFileWaitingForSize: "Wachtend op grootte",
				labelFileSizeNotAvailable: "Grootte niet beschikbaar",
				labelFileCountSingular: "Bestand in lijst",
				labelFileCountPlural: "Bestanden in lijst",
				labelFileLoading: "Laden",
				labelFileAdded: "Toegevoegd", // assistive only
				labelFileLoadError: "Fout bij het uploaden",
				labelFileRemoved: "Verwijderd", // assistive only
				labelFileRemoveError: "Fout bij het verwijderen",
				labelFileProcessing: "Laden",
				labelFileProcessingComplete: "Afbeelding geladen",
				labelFileProcessingAborted: "Upload cancelled",
				labelFileProcessingError: "Error during upload",
				labelFileProcessingRevertError: "Error during revert",
				labelTapToCancel: "tap to cancel",
				labelTapToRetry: "tap to retry",
				labelTapToUndo: "tap to undo",
				labelButtonRemoveItem: "Verwijderen",
				labelButtonAbortItemLoad: "Abort",
				labelButtonRetryItemLoad: "Retry",
				labelButtonAbortItemProcessing: "Verwijder",
				labelButtonUndoItemProcessing: "Undo",
				labelButtonRetryItemProcessing: "Retry",
				labelButtonProcessItem: "Upload"
			}
			
			var imageuploader = FilePond.create(fieldsetElement, filePondSettings);
			var sortableInstance;
			var pondEl = document.querySelector('.filepond--root');
			
			document.querySelector('.filepond--root').addEventListener('FilePond:processfile', e => {
				if (e.detail) {
					console.log('Error uploding file: ', e.detail);
				}
				self.fileUploaderUpdateCurrentInput()
			});
			
			document.querySelector('.filepond--root').addEventListener('FilePond:removefile', e => {
				if (e.detail && e.detail.error) {
					console.log('Error uploding file: ', e.detail);
				}
				self.fileUploaderUpdateCurrentInput()
			});

			if (self.state.formfields) {
				imageuploader.addFiles(self.state.formfields.images)
			}

		}

    self.setState({ ...self.state, imageuploader })
    
	}
	

  fileUploaderUpdateCurrentInput() {
    let self = this;

		if (self.state.formfields) {
			self.state.formfields.images = [];
			if ( this.state.imageuploader && this.state.imageuploader.getFiles ) {
				var images = this.state.imageuploader.getFiles();
				images.forEach((image) => {
					try {
						var serverId = JSON.parse(image.serverId)
						self.state.formfields.images.push(serverId.url)
					} catch(err) { console.log(err) }
				});
			}
		}
	}

  fileUploaderUploaderAddImages(images) {
    let self = this;

		if (this.state.imageuploader) {
			console.log(2, images)
			this.state.imageuploader.addFiles(images)
		}
	}

}
