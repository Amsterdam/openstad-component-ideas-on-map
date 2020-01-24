// polyfills
//import 'core-js/es/map';
//import 'core-js/es/set';
import 'whatwg-fetch';

import React from 'react';
import ReactDOM from 'react-dom';

import "./css/default.less";

import OpenStadComponentIdeasOnMap from './component/ideas-on-map.jsx';
export {OpenStadComponentIdeasOnMap}

if (window.NodeList && !NodeList.prototype.forEach) {
  NodeList.prototype.forEach = Array.prototype.forEach;
}

let elements = document.querySelectorAll('.openstad-component-ideas-on-map');
elements.forEach((elem) => {
  let attributes = elem.attributes;
	ReactDOM.render( <OpenStadComponentIdeasOnMap attributes={attributes}/>, elem)
})
