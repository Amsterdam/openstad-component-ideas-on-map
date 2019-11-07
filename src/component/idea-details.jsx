// TODO: dit moet een eigen repo worden

import React from 'react';
import VoteButton from './vote-button.jsx';

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

    return (
			<div id={self.id} className={self.props.className || 'openstad-component-info-block-idea-details'} ref={el => (self.instance = el)}>
			  <div className="openstad-component-idea-details">

				  <h2>{eval(`self.props.idea.${self.config.titleField}`)}</h2>

          <div className="openstad-component-image" style={{ backgroundImage: `url(${self.props.idea.image})` }}></div>

          <div style={{  marginTop: 20 }}>

            <h3>Likes</h3>
            <VoteButton config={{ text: 'eens', opinion: 'yes', ideaId: this.props.idea.id, apiUrl: this.config.apiUrl, siteId: this.config.siteId, userJWT: this.config.userJWT }} name="likebutton" value={self.props.idea.yes}/>

            <br/>

            <h3>Reacties</h3>
            <a href="#reactions" className="openstad-component-no-of-reactions">{self.props.idea.argsCount || 0} reacties</a>

          </div>

          <p>{self.props.idea.description}</p>

          
			  </div>
			  <div id="reactions" className="openstad-component-reactions-header"><h3>Reacties</h3></div>
			  <div className="openstad-component-reactions">
          lorem ipsum dolor sit amet, consectetuer adipiscing elit. aenean tortor dolor, euismod quis, tincidunt id, pellentesque quis, arcu. pellentesque ac mi eget nunc gravida laoreet. donec eu turpis. quisque dignissim, dolor et fringilla mattis, nulla arcu pretium mi, eu molestie augue erat eget ligula. nam pellentesque urna. suspendisse justo massa, malesuada eget, rhoncus vitae, fringilla in, massa. nulla facilisi. suspendisse vehicula elementum massa. mauris metus. fusce tempor sapien eget justo. nunc placerat malesuada eros. nullam tempus. maecenas tincidunt elementum libero. pellentesque laoreet malesuada urna. maecenas enim tortor, volutpat ut, fermentum non, adipiscing dictum, lacus. class aptent taciti sociosqu ad litora torquent per conubia nostra, per inceptos hymenaeos. phasellus sed pede. nam vel magna nec odio dapibus pretium. maecenas hendrerit ullamcorper sem. nunc turpis.
        </div>
			</div>
    );

  }

}
