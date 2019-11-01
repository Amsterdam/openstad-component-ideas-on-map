import React from 'react';

'use strict';

export default class IdeasList extends React.Component {

  constructor(props) {

    super(props);

		// config
		let defaultConfig = {
      titleField: 'title',
      summaryField: 'summary',
      sortOptions: [{ value: 'random', name: 'Random' }, { value: 'ranking', name: 'Ranking' }, { value: 'newest', name: 'Nieuwste eerst' }, { value: 'oldest', name: 'Oudste eerst' }, { value: 'distance', name: 'Afstand' }],
      showSortButton: true,
      defaultSortOrder: 'newest',
		};
		this.config = Object.assign(defaultConfig, this.props.config || {})
		this.config.onIdeaClick = this.config.onIdeaClick || this.onIdeaClick.bind(this);

    this.state = {
      currentSortOrder: this.config.defaultSortOrder,
      ideas: this.props.ideas || [],
      showSortButton: this.config.showSortButton,
    };

  }

	componentDidMount(prevProps, prevState) {
	}

  updateIdeas({ ideas = this.state.ideas, sortOrder = this.state.currentSortOrder, showSortButton = this.state.showSortButton, center = { lat: 52.37104644463586, lng: 4.900402911007405 }, maxLength }) {

    let self = this;
    let state = { ...self.state };

		switch(sortOrder){
			case 'ranking':
				ideas = ideas.sort( function(a,b) { return a.ranking - a.ranking });
				break;
			case 'newest':
				ideas = ideas.sort( function(a,b) { return new Date(a.createdAt).getTime() - new Date(b.createdAt).getTime() });
				break;
			case 'oldest':
				ideas = ideas.sort( function(a,b) { return new Date(b.createdAt).getTime() - new Date(a.createdAt).getTime() });
				break;
			case 'distance':
				ideas = ideas
          .map( idea => { idea._distance = Math.sqrt( Math.pow( idea.location.coordinates[0] - center.lat, 2 ) + Math.pow( idea.location.coordinates[1] - center.lng, 2 ) ); return idea; } )
          .sort( function(a,b) { return a._distance - b._distance })
				break;
			case 'random':
			default:
				ideas = ideas.sort( function(a,b) { return Math.random() - 0.5 });
				break;
		}

    state.ideas = maxLength ? ideas.slice(0, maxLength): ideas;

    state.showSortButton = showSortButton;

    self.setState(state);

  }

  setSortOrder({ sortOrder }) {
    this.setState({
      ...this.state,
      currentSortOrder: sortOrder
    }, function() {
      this.updateIdeas({ sortOrder })
    });
  }

  onIdeaClick(e) {
    // placeholder
  }

	render() {

    let self = this;

    let sortSelector = null;
    if (this.state.showSortButton) {
      sortSelector = (
        <div className="openstad-align-right-container openstad-margin-right">
          Sorteer op:&nbsp;&nbsp;&nbsp;&nbsp;
          <select value={self.state.currentSortOrder} onChange={() => self.setSortOrder({ sortOrder: self.sortSelector.value })} className="openstad-default-select" ref={el => (self.sortSelector = el)}>
            { self.config.sortOptions.map((option, i) => {
              return <option value={ option.value } key={'sort-option-' + i}>{ option.name }</option>;
            })}
          </select>
        </div>
      );
    }

    return (
			<div id={self.id} className={self.props.className || 'openstad-component-info-block-ideas-list'} ref={el => (self.instance = el)}>

        {sortSelector}

        { self.state.ideas.map((idea, i) => {
          if (!idea) {
            console.log('idea is undef', i, self.state.ideas);
          }
          return (
            <div className="openstad-component-info-block-ideas-list-idea" onClick={() => self.config.onIdeaClick(idea)} key={'info-block-' + i}>
              { eval(`idea.${self.config.titleField}`) }({ idea.id })<br/>
              { eval(`idea.${self.config.summaryField}`) }<br/>
              { idea._distance }<br/>
            </div>
          );
        })}
        
			</div>
    );

  }

}
