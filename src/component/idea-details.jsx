// TODO: dit moet een eigen repo worden

import React from 'react';

'use strict';

export default class IdeasDetails extends React.Component {

  constructor(props) {

    super(props);

		// config
		let defaultConfig = {
			ideaId: null
		};
		this.config = Object.assign(defaultConfig, this.props.config || {})
		// this.config.onIdeaClick = this.config.onIdeaClick || this.onIdeaClick.bind(this);

    this.idea = this.props.idea;

  }

	componentDidMount(prevProps, prevState) {
	}

	render() {

    let self = this;

    let voteButton = null;
    if (self.config.userJWT) {
      voteButton = (
				<div className="openstad-component-votebutton">
					<button className="openstad-component-votebutton-button openstad-button-blue" onClick={() => self.doVote()}>
            eens
					</button>
				</div>
      );
    } else {
      voteButton = (
				<div className="openstad-component-votebutton">
          <button href="/login" className="openstad-button-blue openstad-not-logged-in-button">Inloggen</button>
        </div>
      );
    }

    return (
			<div id={self.id} className={self.props.className || 'openstad-component-info-block-idea-details'} ref={el => (self.instance = el)}>
			  <div className="openstad-component-idea-details">

				  <h2>{eval(`self.props.idea.${self.config.titleField}`)}</h2>
          <div className="openstad-component-image" style={{ backgroundImage: `url(${self.props.idea.image})` }}></div>
				  <p>{self.props.idea.description}</p>
        
			  </div>
			</div>
    );

  }

}
