import React from 'react';
import ReactDOM from 'react-dom';

import "./css/default.less";

import OpenStadComponentIdeasOnMap from './component/ideas-on-map.jsx';
export {OpenStadComponentIdeasOnMap}

let elements = document.querySelectorAll('.openstad-component-ideas-on-map');
elements.forEach((elem) => {
  let attributes = elem.attributes;
	ReactDOM.render( <OpenStadComponentIdeasOnMap attributes={attributes}/>, elem)
})
