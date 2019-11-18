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
      mobileActiveSelector: null,
    }

  }

	componentDidMount(prevProps, prevState) {
	}

  handleTypeChange(value) {

    this.setState({ selectedType: value });
    this.hideMobileActiveSelector()

		// dispatch an event
		var event = new CustomEvent('typeFilterUpdate', { detail: { value: value } });
		document.dispatchEvent(event);

  }

  setAreaValue(value) {
    this.setState({ selectedArea: value });
  }

  handleAreaChange(value) {

    this.setState({ selectedArea: value });
    this.hideMobileActiveSelector()

		// dispatch an event
		var event = new CustomEvent('areaFilterUpdate', { detail: { value: this.state.areas.find(area => value == area.value) } });
		document.dispatchEvent(event);

  }

  resetTypeAndArea() {
    this.handleTypeChange(0)
    this.handleAreaChange(0)
    this.hideMobileActiveSelector()
  }

  toggleMobileActiveSelector(which) {
    if (this.state.mobileActiveSelector != which) {
      this.showMobileActiveSelector(which);
    } else {
      this.hideMobileActiveSelector();
    }
  }

  showMobileActiveSelector(which) {
    this.setState({ mobileActiveSelector: which });
  }

  hideMobileActiveSelector() {
    this.setState({ mobileActiveSelector: null });
  }

	render() {

    let self = this;

    let areasHTML = null;
    let areasButtonHTML = null;
    // TODO: niet state maar config
    if (self.state.areas && self.state.areas.length) {
      areasButtonHTML = (
        <div className="openstad-component-area-selector-button" onClick={() => self.toggleMobileActiveSelector('area')}></div>
      );
      areasHTML = (
          <div className={`openstad-component-area-selector-container${self.state.mobileActiveSelector == 'area' ? ' osc-is-active' : ''}`}>
            <select value={self.state.selectedArea} onChange={() => self.handleAreaChange( self.areaSelector.value )} className="openstad-default-select openstad-margin-right openstad-component-area-selector" ref={el => (self.areaSelector = el)}>
              <option value="0">Alle gebieden</option>;
              { self.state.areas.map((area, i) => {
                return <option style={{ color: area.color }} key={'area-option-' + i}>{ area.name }</option>;
              })}
            </select>
          </div>
      );
    }

    return (
			<div id={self.id} className={self.props.className || 'openstad-component-filterbar'} ref={el => (self.instance = el)}>

        <div className="openstad-component-search-container">
          <div className="openstad-component-search-button" onClick={() => self.toggleMobileActiveSelector('search')}></div>
				  <Search config={{ ...this.config }} className={`openstad-component-search${self.state.mobileActiveSelector == 'search' ? ' osc-is-active' : ''}`}/>
        </div>

        <div className="openstad-component-selectors-container openstad-align-right-container">

          <div className={`openstad-component-type-selector-button${ self.state.selectedType && self.state.selectedType != '0'  ? ' osc-active' : '' }`} onClick={() => self.toggleMobileActiveSelector('type')}></div>
          <div className={`openstad-component-type-selector-container${self.state.mobileActiveSelector == 'type' ? ' osc-is-active' : ''}`}>
            <select value={self.state.selectedType} onChange={() => self.handleTypeChange( self.typeSelector.value )} className="openstad-default-select openstad-margin-right openstad-component-type-selector" ref={el => (self.typeSelector = el)}>
              <option value="0">Alle thema's</option>;
              { self.state.types.map((type, i) => {
                return <option style={{ color: type.color }} key={'type-option-' + i}>{ type.name }</option>;
              })}
            </select>
          </div>

          {areasButtonHTML}
          {areasHTML}

          <button value="reset" onClick={() => self.resetTypeAndArea()} className="openstad-button openstad-reset-button" ref={el => (self.resetButton = el)}>Alles tonen</button>
          
			  </div>
			</div>
    );

  }

}
