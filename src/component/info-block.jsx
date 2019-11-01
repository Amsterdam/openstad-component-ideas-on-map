import React from 'react';
import IdeasList from './ideas-list.jsx';

'use strict';

export default class InfoBlock extends React.Component {

  constructor(props) {

    super(props);

		// config
		let defaultConfig = {
		};
		this.config = Object.assign(defaultConfig, this.props.config || {})

    this.state = {
      currentSortOrder: this.config.defaultSortOrder,
      selectedIdea: undefined,
      newIdea: undefined,
      ideas: [],
    };

  }

	componentDidMount(prevProps, prevState) {
	}

  updateIdeas({ ideas = this.state.ideas, sortOrder = this.state.currentSortOrder, showSortButton, center = { lat: 52.37104644463586, lng: 4.900402911007405 }, maxLength }) {
    this.list.updateIdeas({ ideas, sortOrder, showSortButton, center, maxLength });
  }

  setSelectedIdea(idea) {
    this.setState({ ...this.state, selectedIdea: idea, newIdea: null });
  }

  setNewIdea(idea) {
    this.setState({ ...this.state, newIdea: idea, selectedIdea: null });
  }

  dispatchUpdateSelectedIdea(idea) {
		var event = new CustomEvent('updateSelectedIdea', { detail: { idea } });
		this.instance.dispatchEvent(event);
  }

  dispatchUpdateNewIdea(idea) {
		var event = new CustomEvent('updateNewIdea', { detail: { idea } });
		this.instance.dispatchEvent(event);
  }

	render() {

    let self = this;

    // new idea
    let newIdeaHTML = null;
    if (self.state.newIdea) {
      newIdeaHTML = (
			  <div className="openstad-component-info-block-new-idea">
          <button className="openstad-close-button" onClick={() => self.dispatchUpdateNewIdea(null)} ref={el => (self.resetButton = el)}/>
          <h3>Geselecteerd</h3>
          <p>Een locatie vlakbij</p>
          <h4>{self.state.newIdea.location.coordinates[0]}, {self.state.newIdea.location.coordinates[1]}</h4>
          <p>Op deze exacte locatie is nog geen kans of knelpunt ingediend. Wellicht heeft een medebewoner wel al in de buurt een melding gedaan waar u aan wilt bijdragen, dit kunt u bekijken in de lijst hieronder. Wilt u een nieuw kans of knelpunt toevoegen? Klik dan hier:</p>
          <div className="openstad-align-right-container">
            <button className="openstad-button openstad-button-blue" onClick={() => self.dispatchNewIdeaForm()} ref={el => (self.newIdeaButton = el)}>Nieuwe kans of knelpunt toevoegen</button>
          </div>
        </div>
      );
    }

    // selected idea
    let selectedIdeaHTML = null;
    if (self.state.selectedIdea) {
      selectedIdeaHTML = (
			  <div className="openstad-component-info-block-selected-idea">
          <button className="openstad-close-button" onClick={() => self.dispatchUpdateNewIdea(null)} ref={el => (self.resetButton = el)}/>
          <h3>Geselecteerd</h3>
          <h4>{ eval(`self.state.selectedIdea.${self.config.titleField}`) }({ self.state.selectedIdea.id })</h4>
          <p>{ eval(`self.state.selectedIdea.${self.config.summaryField}`) }</p>
        </div>
      );
    }

    // ideas
    let ideas = null;
    if (self.state.ideas) {
    }

    // TODO: kan de key weg uit IdeasList
    return (
			<div id={self.id} className={self.props.className || 'openstad-component-info-block'} ref={el => (self.instance = el)}>
        {newIdeaHTML}
        {selectedIdeaHTML}
			  <IdeasList config={{ ...self.config, onIdeaClick: idea => self.dispatchUpdateSelectedIdea(idea) }} ideas={self.state.ideas} key={`openstad-component-ideas-list-321`} ref={el => (self.list = el)}/>
			</div>

    );

  }

}
