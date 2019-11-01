import React from 'react';
import Search from './search.jsx';

'use strict';

export default class Filterbar extends React.Component {

  constructor(props) {

    super(props);

		let defaultConfig = {
      types: ( props.config && props.config.types ) || [],
      areas: ( props.config && props.config.areas ) || [],
		};
		this.config = Object.assign(defaultConfig, this.props.config || {})

    this.state = {
      selectedType: undefined,
      types: this.config.types,
      selectedArea: undefined,
      areas: this.config.areas,
    }

  }

	componentDidMount(prevProps, prevState) {
	}

  handleTypeChange(value) {

    this.setState({ ...this.state, selectedType: value });

		// dispatch an event
		var event = new CustomEvent('typeFilterUpdate', { detail: { value: value } });
		this.instance.dispatchEvent(event);

  }

  setAreaValue(value) {
    this.setState({ ...this.state, selectedArea: value });
  }

  handleAreaChange(value) {

    this.setState({ ...this.state, selectedArea: value });

		// dispatch an event
		var event = new CustomEvent('areaFilterUpdate', { detail: { value: this.state.areas.find(area => value == area.value) } });
		this.instance.dispatchEvent(event);

  }

  resetTypeAndArea() {
    this.handleTypeChange(0)
    this.handleAreaChange(0)
  }

	render() {

    let self = this;

    return (
			<div id={self.id} className={self.props.className || 'openstad-component-filterbar'} ref={el => (self.instance = el)}>

				<Search config={{ ...this.config }} ref={el => (self.search = el)}/>

        <div className="openstad-align-right-container">

          <select value={self.state.selectedType} onChange={() => self.handleTypeChange( self.typeSelector.value )} className="openstad-default-select openstad-margin-right" ref={el => (self.typeSelector = el)}>
            <option value="0">Alle thema's</option>;
            { self.state.types.map((type, i) => {
              return <option style={{ color: type.color }} key={'type-option-' + i}>{ type.name }</option>;
            })}
          </select>

          <select value={self.state.selectedArea} onChange={() => self.handleAreaChange( self.areaSelector.value )} className="openstad-default-select openstad-margin-right" ref={el => (self.areaSelector = el)}>
            <option value="0">Geen gebied geselecteerd</option>;
            { self.state.areas.map((area, i) => {
              return <option style={{ color: area.color }} value={ area.value } key={'type-option-' + i}>{ area.name }</option>;
            })}
          </select>

          <button value="reset" onClick={() => self.resetTypeAndArea()} className="openstad-button" ref={el => (self.resetButton = el)}>Alles tonen</button>
          
			  </div>
			</div>
    );

  }

}
