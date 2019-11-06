import React from 'react';

'use strict';

export default class OpenStadComponentFormelement extends React.Component {

  constructor(props) {

    super(props);

		// config
		let defaultConfig = {
			name: 'unknown',
			title: 'Onbekend veld',
      infoText: null,
      minChars: null,
      maxChars: null,
		};
		this.config = Object.assign(defaultConfig, this.props.config || {})
		// this.config.onIdeaClick = this.config.onIdeaClick || this.onIdeaClick.bind(this);

    this.state = {
			ideaId: this.config.ideaId,
    };

  }

	componentDidMount(prevProps, prevState) {
	}

	render(elementHTML) {

    let self = this;

    console.log('==');
    console.log(elementHTML);
    console.log(this.config);

    let infoHTML = null;
    if (this.config.infoText) {
      let infoHTML = (
				<div className="form-info">
  				Geef je voorstel een duidelijke titel, zodat anderen jouw inzending makkelijk kunnen vinden en direct snappen waar het over gaat.
				</div>
      );
    }

    let charsCounterHTML = null;
    if (this.config.minChars && this.config.maxChars) {
      let charsCounterHTML = (
        <div id="charsLeftTitle" className="charsLeft">
          <div className="min error visible">Nog minimaal <span>2</span> tekens</div>
          <div className="max">Je hebt nog <span>0</span> tekens over.</div>
        </div>
      );
    }

    return (
      <div className="form-group">
				<h2>
					{self.config.title}
				</h2>
        {infoHTML}
        {charsCounterHTML}
				{elementHTML}
			</div>
    );

  }

}
