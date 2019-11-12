import React from 'react';
import ReactDOM from 'react-dom';

import OpenStadComponentFormelementsInputWithCounter from '../openstad-component-formelements/input-with-counter.jsx';

'use strict';

export default class OpenStadComponentReactions extends React.Component {

  constructor(props) {
    super(props);

		let self = this;
		self.id = props.id || 'openstad-component-reaction-form-' + parseInt( 1000000 * Math.random() )

		self.defaultConfig = {
      argumentId: null,
      api: {
        url: null,
        headers: null,
        isUserLoggedIn: false,
      },
      descriptionMinLength: 30,
      descriptionMaxLength: 500,
		};

		self.config = Object.assign(self.defaultConfig, props.config || {})

    self.state = {
      description: self.config.description || '',
		};


  }

	handleOnChange(data) {
    data = data || {};
		this.setState(data)
	}

	submitForm() {

		let self = this;

		let isValid = self.description.validate();
		if (!isValid) return;

	  if (!self.config.api.isUserLoggedIn) return alert('Je bent niet ingelogd');

		let url = ( self.config.api && self.config.api.url ) + "/api/site/" + self.config.siteId + "/idea/" + self.config.ideaId + "/argument" + ( self.config.argumentId ? '/' + self.config.argumentId : ''  );
		let headers = Object.assign(( self.config.api && self.config.api.headers || {} ), { "Content-type": "application/json" });
    let method = self.config.argumentId ? 'PUT' : 'POST';

		let body = {
			sentiment: self.config.sentiment,
			description: self.state.description,
		}

		fetch(url, {
			method,
      headers,
			body: JSON.stringify(body),
		})
			.then( function (response) {
				if (response.ok) {
					return response.json()
				}
				throw response.text();
			})
			.then(function (json) {

				if (typeof self.config.onSubmit == 'function') {
					self.config.onSubmit({ description: self.state.description });
				}

        self.setState({ description: '' });

			})
			.catch(function (error) {
				console.log(error);
				error.then(function (messages) { return console.log(messages)} );
			});

	}

	render() {

		let self = this;

		let config = {
			descriptionMinLength: self.config.descriptionMinLength || 30,
			descriptionMaxLength: self.config.descriptionMaxLength || 500,
		}

    // todo: config of je ingelogd moet zijn
    let submitButtonHTML = (
      <div className="openstad-align-right-container">
        <button onClick={() => { document.location.href = '/oauth/login' }} className="openstad-button-blue openstad-not-logged-in-button">Inloggen</button>
      </div>
    );
    if (self.config.api.isUserLoggedIn) {
      submitButtonHTML = (
        <div className="openstad-align-right-container">
			    <button onClick={e => self.submitForm()} className="osc-button-blue" disabled={ self.state.isValid ? true : null }>Verzenden</button>
        </div>
      );
    }

    return (
			<div id={self.id} className="osc-reaction-form osc-form" ref={el => (self.instance = el)} >
        <div className="osc-form-group">
				  <OpenStadComponentFormelementsInputWithCounter ref={el => (self.input = el)} config={{ inputType: 'textarea', minLength: config.descriptionMinLength, maxLength: config.descriptionMaxLength }} value={self.state.description} onChange={ (data) => self.handleOnChange({ description: data.value }) } ref={el => (self.description = el)}/>
        </div>
        {submitButtonHTML}
			</div>
    );

  }

}
