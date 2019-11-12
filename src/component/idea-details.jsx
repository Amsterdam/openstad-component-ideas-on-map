// TODO: dit moet een eigen repo worden

import React from 'react';
import VoteButton from './vote-button.jsx';
import OpenStadComponentReactions from './openstad-component-reactions/openstad-component-reactions.jsx';

'use strict';

export default class IdeasDetails extends React.Component {

  constructor(props) {

    super(props);

		// config
		let defaultConfig = {
      siteId: null,
      ideaId: null,
			api: {
        url: null,
        headers: null,
        isUserLoggedIn: false,
      },
      argument: {
        descriptionMinLength: 30,
        descriptionMaxLength: 500,
      },
		};
		this.config = Object.assign(defaultConfig, this.config, this.props.config || {})
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

          <div className="openstad-component-details-image-and-stats">

            <div className="openstad-component-image" style={{ backgroundImage: `url(${self.props.idea.image})` }}></div>

            <div className="openstad-component-details-stats">

              <h3>Likes</h3>
              <VoteButton config={{ text: 'eens', opinion: 'yes', ideaId: this.props.idea.id, api: this.config.api, siteId: this.config.siteId }} name="likebutton" value={self.props.idea.yes}/>

              <br/>

              <h3>Reacties</h3>
              <a href="#reactions" className="openstad-component-no-of-reactions">{self.props.idea.argCount || 0} reacties</a>

            </div>

          </div>

          <p className="openstad-component-details-sharebuttons openstad-align-right-container">
            <ul>
							<li><a className="openstad-share-facebook" target="_blank" href={ 'https://www.facebook.com/sharer/sharer.php?u=' + encodeURIComponent(document.location.href) }>Facebook</a></li>
							<li><a className="openstad-share-twitter" target="_blank" href={ 'https://twitter.com/intent/tweet?text=' + encodeURIComponent(document.location.href) }>Twitter</a></li>
							<li><a className="openstad-share-email" target="_blank" href={ 'mailto:?subject=' + encodeURIComponent(eval(`self.props.idea.${self.config.titleField}`)) + '&body=' + encodeURIComponent(document.location.href)}>Email</a></li>
							<li><a className="openstad-share-whatsapp" target="_blank" href={ 'https://wa.me/?text=' + encodeURIComponent(document.location.href) }>WhatsApp</a></li>
						</ul>
          </p>

          <p className="">
            <span className="ocs-gray-text">Door </span>{self.props.idea.user.nickName || self.props.idea.user.fullName || self.props.idea.user.firstName +' ' + self.props.idea.user.lastName}
            <span className="ocs-gray-text"> op </span>{self.props.idea.createDateHumanized}
						<span className="ocs-gray-text">&nbsp;&nbsp;|&nbsp;&nbsp;</span>
						<span className="ocs-gray-text">Thema: </span>{self.props.idea.extraData.theme}
          </p>

          <p className="openstad-component-details-summary">{self.props.idea.summary}</p>

          <p className="openstad-component-details-description">{self.props.idea.description}</p>

          
			  </div>
			  <div id="reactions" className="openstad-component-reactions-header"><h3>Reacties</h3></div>
        <OpenStadComponentReactions config={{ ...self.config.argument, api: self.config.api, siteId: self.config.siteId, ideaId: self.props.idea.id }}/>
			</div>
    );

  }

}
