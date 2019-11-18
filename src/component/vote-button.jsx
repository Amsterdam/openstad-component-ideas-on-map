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
    }

  }

	componentDidMount(prevProps, prevState) {
	}

  doVote() {

    let self = this;
    let url = `${ self.config.api.url }/api/site/${ self.config.siteId }/vote`;
		let headers = Object.assign(( self.config.api && self.config.api.headers || {} ), { "Content-type": "application/json" });

    if (!self.config.api.isUserLoggedIn) return alert('Log eerst in; anoniem stemmen moet nog.')


    fetch(url, {
      method: 'post',
      headers,
      body: JSON.stringify({
        ideaId: self.config.ideaId,
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
        
		    var event = new CustomEvent('ideaLiked', { detail: { ideaId: self.config.ideaId, change } });
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
        <div className={`openstad-component-number-button-text ${this.config.name}-name`} style={{ color: this.config.color, backgroundColor: this.config.backgroundColor }} onClick={ () => self.doVote() }>
			    {self.config.text}
		    </div>
        <div className="openstad-clear-both"></div>
	    </div>
    );

  }

}
