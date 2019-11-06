import React from 'react';
import IdeasList from './ideas-list.jsx';

// TODO: na verandering op verandering denk ik dat dit een status moet gaan krijgen ipv. de new en selected versie.
// TODO: setNewIdea refactoren naar setSelectedLocation
// TODO: events worden via document gestuurd; dat kan ook intern

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
    this.eventTarget = this.config.eventTarget || this.instance;
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

  dispatchUpdateSelectedIdea(e, idea) {
    e.stopPropagation();
		var event = new CustomEvent('updateSelectedIdea', { detail: { idea } });
		document.dispatchEvent(event);
  }

  dispatchUpdateNewIdea(e, idea) {
    e.stopPropagation();
		var event = new CustomEvent('updateNewIdea', { detail: { idea } });
		document.dispatchEvent(event);
  }
  
  dispatchSelectedIdeaClick(e, idea) {
    e.stopPropagation();
		var event = new CustomEvent('selectedIdeaClick', { detail: { idea } });
		document.dispatchEvent(event);
  };
  
  dispatchNewIdeaClick(e) {
    e.stopPropagation();
		var event = new CustomEvent('newIdeaClick', { detail: {} });
		document.dispatchEvent(event);
  };
  
	render() {

    let self = this;

    let newIdeaHTML = null;
    let selectedIdeaHTML = null;
    let title = self.config.title || null;

    // new idea
    if (self.state.newIdea) {
      newIdeaHTML = (
			  <div className="openstad-component-info-block-new-idea">
          <button className="openstad-close-button" onClick={(event) => self.dispatchUpdateNewIdea(event, null)} ref={el => (self.resetButton = el)}/>
          <h3>Geselecteerd</h3>
          <p>Een locatie vlakbij</p>
          <h4>{(self.state.newIdea.address && self.state.newIdea.address._display) || 'Geen adres gevonden'}</h4>
          <p>Op deze exacte locatie is nog geen kans of knelpunt ingediend. Wellicht heeft een medebewoner wel al in de buurt een melding gedaan waar u aan wilt bijdragen, dit kunt u bekijken in de lijst hieronder. Wilt u een nieuw kans of knelpunt toevoegen? Klik dan hier:</p>
          <div className="openstad-align-right-container">
            <button className="openstad-button openstad-button-blue" onClick={(event) => self.dispatchNewIdeaClick(event)} ref={el => (self.newIdeaButton = el)}>Nieuwe kans of knelpunt toevoegen</button>
          </div>
        </div>
      );
      title += ' in de buurt';
    }

    // selected idea
    if (self.state.selectedIdea) {
      let idea = self.state.selectedIdea;
      let tmp = self.config.types.find(entry => entry.name == idea.extraData.thema);
      let typeColor = tmp && tmp.color || 'black';
      selectedIdeaHTML = (
			  <div className="openstad-component-info-block-selected-idea" onClick={(event) => self.dispatchSelectedIdeaClick(event)}>
          <button className="openstad-close-button" onClick={(event) => self.dispatchUpdateSelectedIdea(event, null)} ref={el => (self.resetButton = el)}/>
          <h3>Geselecteerd</h3>
          <div className="openstad-component-info-block-selected-idea-idea">
            <div className="openstad-component-image" style={{ backgroundImage: `url(${idea.image})` }}></div>
            <div className="openstad-component-content">
              <h4>{ eval(`idea.${self.config.titleField}`) }</h4>
              <div className="openstad-summary">
                { eval(`idea.${self.config.summaryField}`) }
              </div>
              <div className="openstad-stats">
                <div className="openstad-likes">
                  {idea.yes || 0}
                </div>
                <div className="openstad-reactions">
                  {idea.argCount || 0}
                </div>
                <div className="openstad-type" style={{ borderColor: typeColor }}>
                  <div className="openstad-type-content"></div>
                </div>
              </div>
            </div>
            <div className="openstad-clear-both"></div>
          </div>
        </div>
      );
      title += ' in de buurt';
    }

    // TODO: kan de key weg uit IdeasList
    return (
			<div id={self.id} className={self.props.className || 'openstad-component-info-block'} ref={el => (self.instance = el)}>
        {newIdeaHTML}
        {selectedIdeaHTML}
			  <IdeasList config={{ ...self.config, onIdeaClick: ( event, idea ) => self.dispatchUpdateSelectedIdea(event, idea) }} ideas={self.state.ideas} title={title} key={`openstad-component-ideas-list-321`} ref={el => (self.list = el)}/>
			</div>

    );

  }

}
