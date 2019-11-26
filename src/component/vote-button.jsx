import React from 'react';
import Search from './search.jsx';

'use strict';

export default class VoteButton extends React.Component {

  constructor(props) {

    super(props);

		let defaultConfig = {
      name: 'likebutton',
      backgroundColor: '#164995',
      color: '#fff',
      text: 'like',
      opinion: 'yes',
		};
		this.config = Object.assign(defaultConfig, this.props.config || {})

    this.state = {
      value: this.props.value,
      busy: false,
    }

  }

	componentDidMount(prevProps, prevState) {
    // return from anonymous login
    let votePending = this.props.idea && this.props.idea.votePending;
    if (votePending) {
			this.doVote(new Event('x'));
		}
  }

  doVote(e) {

    e.stopPropagation();

    if (this.state.busy) return;
    this.setState({ busy: true });

    let self = this;
    let url = `${ self.config.api.url }/api/site/${ self.config.siteId }/vote`;
		let headers = Object.assign(( self.config.api && self.config.api.headers || {} ), { "Content-type": "application/json" });

    // if (!self.config.api.isUserLoggedIn) url += '?useOauth=anonymous'
    if (!self.config.api.isUserLoggedIn) {
      let loginUrl =  '/oauth/login?returnTo=' + encodeURIComponent(document.location.href.replace('#', '?votePending=' + self.props.idea.id + '#')) + '&useOauth=anonymous';
      return document.location.href = loginUrl;
    }

    fetch(url, {
      method: 'post',
      headers,
      body: JSON.stringify({
        ideaId: self.props.idea.id,
        opinion: self.config.opinion,
      })
    })
      .then((response) => {
        if (!response.ok) throw Error(response)
        return response.json();
      })
      .then( json => {

        let change = json.length ? 1 : -1;
        let value = self.state.value + change;
        self.setState({ value })

        self.props.idea.userVote = json.length && json || null;

        this.setState({ busy: false });

		    var event = new CustomEvent('ideaLiked', { detail: { ideaId: self.props.idea.id, change } });
		    document.dispatchEvent(event);
      })
      .catch((err) => {
        console.log('Niet goed');
        console.log(err);
      });
    
  }

	render() {

    let self = this;

    let value = parseInt(self.state.value) || 0;

	  let value000 = parseInt(value/100) || 0;
	  let value00  = parseInt(( value - 100 * value000 )/10) || 0;
	  let value0   = value - value000 * 100 - value00 * 10;

    return (
	    <div id={self.id} className={self.props.className || 'openstad-component-vote-button openstad-component-number-button'} ref={el => (self.instance = el)}>
		    <div className="openstad-component-number-plates" style={{ color: this.config.color, backgroundColor: this.config.backgroundColor }}>
			    <div id={`${this.config.name}-number-plate-000`} className="openstad-component-number-plate">{value000}</div>
			    <div id={`${this.config.name}-number-plate-00`} className="openstad-component-number-plate">{value00}</div>
			    <div id={`${this.config.name}-number-plate-0`} className="openstad-component-number-plate">{value0}</div>
		    </div>
        <div className={`openstad-component-number-button-text ${this.config.name}-name ${this.props.idea.userVote ? ' ocs-user-has-voted' : ''} ${this.state.busy ? ' ocs-busy' : ''}`} style={{ color: this.config.color, backgroundColor: this.config.backgroundColor }} onClick={ (e) => self.doVote(e) }>
			    {self.config.text}
		    </div>
        <div className="openstad-clear-both"></div>
	    </div>
    );

  }

}
