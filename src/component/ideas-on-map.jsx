import merge from 'merge';
import storage from '../lib/localstorage.js';
import React from 'react';
import ReactDOM from 'react-dom';
import OpenStadComponent from 'openstad-component/src/index.jsx';
import Filterbar from './filterbar.jsx';
import InfoBlock from './info-block.jsx';
import IdeaForm from './idea-form.jsx';
import IdeaDetails from './idea-details.jsx';
import Map from './map.jsx';

// TODO: clean up; ik gebruikte eerst setNewIdea en setSelected, maar nu onNewIdeaClick en onSelectedIdeaClick; trek dat gelijk

'use strict';

export default class OpenStadComponentIdeasOnMap extends OpenStadComponent {

  constructor(props) {

    super(props);

		var self = this;

		// config
		self.defaultConfig = {
			title: this.config.appTitle || 'Inzendingen',
      currentPolygon: undefined,
      types: [
        { name: "Auto", color: "#EC0000", mapicon: { html: '<svg width="34" height="45" viewBox="0 0 34 45" fill="none" xmlns="http://www.w3.org/2000/svg"><g clip-path="url(#clip1)"><path d="M17 0C26.3917 0 34 7.53433 34 16.8347C34 29.5249 19.3587 42.4714 18.7259 42.9841L17 44.4938L15.2741 42.9841C14.6413 42.4714 0 29.5249 0 16.8347C0 7.53575 7.60829 0 17 0Z" fill="#EC0000"/></g><g clip-path="url(#clip1)"><path fill-rule="evenodd" clip-rule="evenodd" d="M22 19.5C23.0355 19.5 23.875 20.3395 23.875 21.375C23.875 22.4105 23.0355 23.25 22 23.25C20.9645 23.25 20.125 22.4105 20.125 21.375C20.125 20.3395 20.9645 19.5 22 19.5ZM11.375 19.5C12.4105 19.5 13.25 20.3395 13.25 21.375C13.25 22.4105 12.4105 23.25 11.375 23.25C10.3395 23.25 9.5 22.4105 9.5 21.375C9.5 20.3395 10.3395 19.5 11.375 19.5ZM18.875 11.375L23.25 15.75H27V21.375H25.125C25.125 19.6491 23.7259 18.25 22 18.25C20.2741 18.25 18.875 19.6491 18.875 21.375H14.5C14.5 19.6491 13.1009 18.25 11.375 18.25C9.64911 18.25 8.25 19.6491 8.25 21.375H7V15.75L11.375 11.375H18.875ZM18.25 12.625H15.125V15.75H21.3512L18.25 12.625ZM13.875 12.625H12L8.875 15.75H13.875V12.625Z" fill="white"/></g><defs><clipPath id="clip1"><rect width="34" height="44.4938" fill="white"/></clipPath><clipPath id="clip1"><rect width="20" height="20" fill="white" transform="translate(7 7)"/></clipPath></defs></svg>', width: 34, height: 45, anchor: [17, 45] }, listicon: { html: '<svg width="34" height="34" viewBox="0 0 34 34" fill="none" xmlns="http://www.w3.org/2000/svg"><circle cx="17" cy="17" r="17" fill="#EC0000"/><g clip-path="url(#clip2)"><path fill-rule="evenodd" clip-rule="evenodd" d="M22 19.5C23.0355 19.5 23.875 20.3395 23.875 21.375C23.875 22.4105 23.0355 23.25 22 23.25C20.9645 23.25 20.125 22.4105 20.125 21.375C20.125 20.3395 20.9645 19.5 22 19.5ZM11.375 19.5C12.4105 19.5 13.25 20.3395 13.25 21.375C13.25 22.4105 12.4105 23.25 11.375 23.25C10.3395 23.25 9.5 22.4105 9.5 21.375C9.5 20.3395 10.3395 19.5 11.375 19.5ZM18.875 11.375L23.25 15.75H27V21.375H25.125C25.125 19.6491 23.7259 18.25 22 18.25C20.2741 18.25 18.875 19.6491 18.875 21.375H14.5C14.5 19.6491 13.1009 18.25 11.375 18.25C9.64911 18.25 8.25 19.6491 8.25 21.375H7V15.75L11.375 11.375H18.875ZM18.25 12.625H15.125V15.75H21.3512L18.25 12.625ZM13.875 12.625H12L8.875 15.75H13.875V12.625Z" fill="white"/></g><defs><clipPath id="clip2"><rect width="20" height="20" fill="white" transform="translate(7 7)"/></clipPath></defs></svg>', width: 34, height: 34 } },
        { name: "Fiets", color: "#BED200", mapicon: { html: '<svg width="34" height="45" viewBox="0 0 34 45" fill="none" xmlns="http://www.w3.org/2000/svg"><g clip-path="url(#clip1)"><path d="M17 0.493652C26.3917 0.493652 34 8.02798 34 17.3284C34 30.0185 19.3587 42.965 18.7259 43.4778L17 44.9875L15.2741 43.4778C14.6413 42.965 0 30.0185 0 17.3284C0 8.0294 7.60829 0.493652 17 0.493652Z" fill="#BED200"/></g><g clip-path="url(#clip1)"><path d="M11.0625 19.3687C13.3062 19.3687 15.125 21.1875 15.125 23.4312C15.125 25.6748 13.3062 27.4937 11.0625 27.4937C8.81884 27.4937 7 25.6748 7 23.4312C7 21.1875 8.81884 19.3687 11.0625 19.3687ZM11.0625 20.6187C9.5092 20.6187 8.25 21.8779 8.25 23.4312C8.25 24.9845 9.5092 26.2437 11.0625 26.2437C12.6158 26.2437 13.875 24.9845 13.875 23.4312C13.875 21.8779 12.6158 20.6187 11.0625 20.6187Z" fill="white"/><path d="M22.9375 19.3687C25.1812 19.3687 27 21.1875 27 23.4312C27 25.6748 25.1812 27.4937 22.9375 27.4937C20.6938 27.4937 18.875 25.6748 18.875 23.4312C18.875 21.1875 20.6938 19.3687 22.9375 19.3687ZM22.9375 20.6187C21.3842 20.6187 20.125 21.8779 20.125 23.4312C20.125 24.9845 21.3842 26.2437 22.9375 26.2437C24.4908 26.2437 25.75 24.9845 25.75 23.4312C25.75 21.8779 24.4908 20.6187 22.9375 20.6187Z" fill="white"/><path fill-rule="evenodd" clip-rule="evenodd" d="M20.75 12.4937V14.9937L23.875 14.9937V17.4937L19.5 17.4937L18.25 16.2437L18.25 14.3687L15.75 16.8687L18.252 19.3687L18.252 26.2437L15.75 26.2437L15.75 20.6187L12.625 17.4937L12.625 15.6187L17 11.2437C17.625 10.6187 18.875 10.6187 19.5 11.2437L20.75 12.4937Z" fill="white"/><path fill-rule="evenodd" clip-rule="evenodd" d="M22.7008 8.04262C23.4331 8.77492 23.4331 9.96198 22.7008 10.6943C21.9685 11.4266 20.7815 11.4266 20.0492 10.6943C19.3169 9.96198 19.3169 8.77492 20.0492 8.04262C20.7815 7.31032 21.9685 7.31032 22.7008 8.04262Z" fill="white"/></g><defs><clipPath id="clip1"><rect width="34" height="44.4938" fill="white" transform="translate(0 0.493652)"/></clipPath><clipPath id="clip1"><rect width="20" height="20" fill="white" transform="translate(7 7.49365)"/></clipPath></defs></svg>', width: 34, height: 45, anchor: [17, 45] }, listicon: { html: '<svg width="34" height="34" viewBox="0 0 34 34" fill="none" xmlns="http://www.w3.org/2000/svg"><circle cx="17" cy="17" r="17" fill="#BED200"/><g clip-path="url(#clip2)"><path d="M11.0625 17.3687C13.3062 17.3687 15.125 19.1875 15.125 21.4312C15.125 23.6748 13.3062 25.4937 11.0625 25.4937C8.81884 25.4937 7 23.6748 7 21.4312C7 19.1875 8.81884 17.3687 11.0625 17.3687ZM11.0625 18.6187C9.5092 18.6187 8.25 19.8779 8.25 21.4312C8.25 22.9845 9.5092 24.2437 11.0625 24.2437C12.6158 24.2437 13.875 22.9845 13.875 21.4312C13.875 19.8779 12.6158 18.6187 11.0625 18.6187Z" fill="white"/><path d="M22.9375 17.3687C25.1812 17.3687 27 19.1875 27 21.4312C27 23.6748 25.1812 25.4937 22.9375 25.4937C20.6938 25.4937 18.875 23.6748 18.875 21.4312C18.875 19.1875 20.6938 17.3687 22.9375 17.3687ZM22.9375 18.6187C21.3842 18.6187 20.125 19.8779 20.125 21.4312C20.125 22.9845 21.3842 24.2437 22.9375 24.2437C24.4908 24.2437 25.75 22.9845 25.75 21.4312C25.75 19.8779 24.4908 18.6187 22.9375 18.6187Z" fill="white"/><path fill-rule="evenodd" clip-rule="evenodd" d="M20.75 10.4937V12.9937L23.875 12.9937V15.4937L19.5 15.4937L18.25 14.2437L18.25 12.3687L15.75 14.8687L18.252 17.3687L18.252 24.2437L15.75 24.2437L15.75 18.6187L12.625 15.4937L12.625 13.6187L17 9.24365C17.625 8.61865 18.875 8.61865 19.5 9.24365L20.75 10.4937Z" fill="white"/><path fill-rule="evenodd" clip-rule="evenodd" d="M22.7008 6.04262C23.4331 6.77492 23.4331 7.96198 22.7008 8.69427C21.9685 9.42657 20.7815 9.42657 20.0492 8.69427C19.3169 7.96198 19.3169 6.77492 20.0492 6.04262C20.7815 5.31032 21.9685 5.31032 22.7008 6.04262Z" fill="white"/></g><defs><clipPath id="clip2"><rect width="20" height="20" fill="white" transform="translate(7 5.49365)"/></clipPath></defs></svg>', width: 34, height: 34 } },
        { name: "Voetganger", color: "#009DEC", mapicon: { html: '<svg width="34" height="46" viewBox="0 0 34 46" fill="none" xmlns="http://www.w3.org/2000/svg"><g clip-path="url(#clip1)"><path d="M17 0.987793C26.3917 0.987793 34 8.52212 34 17.8225C34 30.5127 19.3587 43.4592 18.7259 43.9719L17 45.4816L15.2741 43.9719C14.6413 43.4592 0 30.5127 0 17.8225C0 8.52354 7.60829 0.987793 17 0.987793Z" fill="#009DEC"/><g clip-path="url(#clip1)"><path fill-rule="evenodd" clip-rule="evenodd" d="M18.25 12.9878L20.75 15.4878H23.25V17.9878H20.125L18.25 16.1128V19.2378L20.75 21.7378V27.9878H18.25V22.9878L17 21.7378V23.6128L14.5 26.1128H10.75V23.6128H13.25L14.5 22.3628V16.1128L13.25 17.3628V19.8628H10.75V16.7378L14.5 12.9878H18.25Z" fill="white"/><path fill-rule="evenodd" clip-rule="evenodd" d="M16.375 7.98779C17.4106 7.98779 18.25 8.82717 18.25 9.86279C18.25 10.8984 17.4106 11.7378 16.375 11.7378C15.3394 11.7378 14.5 10.8984 14.5 9.86279C14.5 8.82717 15.3394 7.98779 16.375 7.98779Z" fill="white"/></g></g><defs><clipPath id="clip1"><rect width="34" height="44.4938" fill="white" transform="translate(0 0.987793)"/></clipPath><clipPath id="clip1"><rect width="20" height="20" fill="white" transform="translate(7 7.98779)"/></clipPath></defs></svg>', width: 34, height: 45, anchor: [17, 45] }, listicon: { html: '<svg width="34" height="34" viewBox="0 0 34 34" fill="none" xmlns="http://www.w3.org/2000/svg"><circle cx="17" cy="17" r="17" fill="#009DEC"/><g clip-path="url(#clip2)"><path fill-rule="evenodd" clip-rule="evenodd" d="M18.25 11.9878L20.75 14.4878H23.25V16.9878H20.125L18.25 15.1128V18.2378L20.75 20.7378V26.9878H18.25V21.9878L17 20.7378V22.6128L14.5 25.1128H10.75V22.6128H13.25L14.5 21.3628V15.1128L13.25 16.3628V18.8628H10.75V15.7378L14.5 11.9878H18.25Z" fill="white"/><path fill-rule="evenodd" clip-rule="evenodd" d="M16.375 6.98779C17.4106 6.98779 18.25 7.82717 18.25 8.86279C18.25 9.89842 17.4106 10.7378 16.375 10.7378C15.3394 10.7378 14.5 9.89842 14.5 8.86279C14.5 7.82717 15.3394 6.98779 16.375 6.98779Z" fill="white"/></g><defs><clipPath id="clip2"><rect width="20" height="20" fill="white" transform="translate(7 6.98779)"/></clipPath></defs></svg>', width: 34, height: 34 } },
        { name: "Recreëren", color: "#E50082", mapicon: { html: '<svg width="34" height="45" viewBox="0 0 34 45" fill="none" xmlns="http://www.w3.org/2000/svg"><g clip-path="url(#clip1)"><path d="M17 0.481445C26.3917 0.481445 34 8.01577 34 17.3162C34 30.0063 19.3587 42.9528 18.7259 43.4656L17 44.9753L15.2741 43.4656C14.6413 42.9528 0 30.0063 0 17.3162C0 8.0172 7.60829 0.481445 17 0.481445Z" fill="#E50082"/><g clip-path="url(#clip1)"><path fill-rule="evenodd" clip-rule="evenodd" d="M23.875 24.9814H26.375V27.4814H7.625V24.9814H10.1254V23.1069L9.5 20.7588L10.7125 20.4551L11.2194 22.4819H13.25C13.595 22.4819 13.875 22.7619 13.875 23.1069V24.9814H15.75V18.7314H7.625V13.7313L16.9988 8.10645L26.375 13.7313V18.7314H18.25V24.9814H20.125V23.1069C20.125 22.7619 20.405 22.4819 20.75 22.4819H22.7619L23.2687 20.4551L24.4813 20.7588L23.875 23.1069V24.9814ZM22.625 24.9814V23.7319H21.375V24.9814H22.625ZM12.625 24.9814V23.7319H11.375V24.9814H12.625ZM10.125 15.026V16.2314H23.875V15.026L17 11.2617L10.125 15.026Z" fill="white"/></g></g><defs><clipPath id="clip1"><rect width="34" height="44.4938" fill="white" transform="translate(0 0.481445)"/></clipPath><clipPath id="clip1"><rect width="20" height="20" fill="white" transform="translate(7 7.48145)"/></clipPath></defs></svg>', width: 34, height: 45, anchor: [17, 45] }, listicon: { html: '<svg width="34" height="34" viewBox="0 0 34 34" fill="none" xmlns="http://www.w3.org/2000/svg"><circle cx="17" cy="17" r="17" fill="#E50082"/><g clip-path="url(#clip2)"><path fill-rule="evenodd" clip-rule="evenodd" d="M23.875 23.9814H26.375V26.4814H7.625V23.9814H10.1254V22.1069L9.5 19.7588L10.7125 19.4551L11.2194 21.4819H13.25C13.595 21.4819 13.875 21.7619 13.875 22.1069V23.9814H15.75V17.7314H7.625V12.7313L16.9988 7.10645L26.375 12.7313V17.7314H18.25V23.9814H20.125V22.1069C20.125 21.7619 20.405 21.4819 20.75 21.4819H22.7619L23.2687 19.4551L24.4813 19.7588L23.875 22.1069V23.9814ZM22.625 23.9814V22.7319H21.375V23.9814H22.625ZM12.625 23.9814V22.7319H11.375V23.9814H12.625ZM10.125 14.026V15.2314H23.875V14.026L17 10.2617L10.125 14.026Z" fill="white"/></g><defs><clipPath id="clip2"><rect width="20" height="20" fill="white" transform="translate(7 6.48145)"/></clipPath></defs></svg>', width: 34, height: 34 } },
        { name: "Schoon", color: "#004699", mapicon: { html: '<svg width="34" height="46" viewBox="0 0 34 46" fill="none" xmlns="http://www.w3.org/2000/svg"><g clip-path="url(#clip1)"><path d="M17 0.975586C26.3917 0.975586 34 8.50991 34 17.8103C34 30.5005 19.3587 43.447 18.7259 43.9597L17 45.4694L15.2741 43.9597C14.6413 43.447 0 30.5005 0 17.8103C0 8.51134 7.60829 0.975586 17 0.975586Z" fill="#004699"/><g clip-path="url(#clip1)"><path fill-rule="evenodd" clip-rule="evenodd" d="M19.6787 7.97559V10.4756H24.6787V12.9756H23.4287V27.9756H9.67871V12.9756H8.42871V10.4756H13.4287V7.97559H19.6787ZM20.9287 12.9756H12.1787V25.4756H20.9287V12.9756ZM14.6787 15.4756V22.9756H13.4412V15.4756H14.6787ZM17.1787 15.4756V22.9756H15.9287V15.4756H17.1787ZM19.6787 15.4756V22.9756H18.4412V15.4756H19.6787ZM18.4287 9.22559H14.6787V10.4756H18.4287V9.22559Z" fill="white"/></g></g><defs><clipPath id="clip1"><rect width="34" height="44.4938" fill="white" transform="translate(0 0.975586)"/></clipPath><clipPath id="clip1"><rect width="20" height="20" fill="white" transform="translate(7 7.97559)"/></clipPath></defs></svg>', width: 34, height: 45, anchor: [17, 45] }, listicon: { html: '<svg width="34" height="34" viewBox="0 0 34 34" fill="none" xmlns="http://www.w3.org/2000/svg"><circle cx="17" cy="17" r="17" fill="#004699"/><g clip-path="url(#clip2)"><path fill-rule="evenodd" clip-rule="evenodd" d="M19.6787 6.97559V9.47559H24.6787V11.9756H23.4287V26.9756H9.67871V11.9756H8.42871V9.47559H13.4287V6.97559H19.6787ZM20.9287 11.9756H12.1787V24.4756H20.9287V11.9756ZM14.6787 14.4756V21.9756H13.4412V14.4756H14.6787ZM17.1787 14.4756V21.9756H15.9287V14.4756H17.1787ZM19.6787 14.4756V21.9756H18.4412V14.4756H19.6787ZM18.4287 8.22559H14.6787V9.47559H18.4287V8.22559Z" fill="white"/></g><defs><clipPath id="clip2"><rect width="20" height="20" fill="white" transform="translate(7 6.97559)"/></clipPath></defs></svg>', width: 34, height: 34 } },
        { name: "Groen", color: "#00A03C", mapicon: { html: '<svg width="34" height="45" viewBox="0 0 34 45" fill="none" xmlns="http://www.w3.org/2000/svg"><g clip-path="url(#clip1)"><path d="M17 0.469238C26.3917 0.469238 34 8.00356 34 17.304C34 29.9941 19.3587 42.9406 18.7259 43.4534L17 44.9631L15.2741 43.4534C14.6413 42.9406 0 29.9941 0 17.304C0 8.00499 7.60829 0.469238 17 0.469238Z" fill="#00A03C"/></g><g clip-path="url(#clip1)"><mask id="mask1" mask-type="alpha" maskUnits="userSpaceOnUse" x="7" y="6" width="20" height="21"><path d="M16.1251 6.9692C16.8232 7.31203 17.275 8.00713 17.3106 8.77763L17.3126 8.9067V9.3442C18.3626 9.50045 19.1363 10.4073 19.1251 11.4692C19.1532 11.8404 19.0657 12.2117 18.8751 12.5317C19.4874 12.8803 19.9272 13.4646 20.0952 14.1445L20.1251 14.2817V14.6567C20.1488 15.6961 19.527 16.6423 18.5626 17.0317C18.3349 17.1603 18.0779 17.2269 17.8178 17.2255L17.6876 17.2192H17.6251C17.0041 17.1954 16.4165 16.9415 15.9745 16.5095L15.8751 16.4067H15.7501V23.9692H18.8751V22.0942L18.2501 19.7192L19.4376 19.4692L20.0001 21.4692H22.0001C22.1713 21.4486 22.3426 21.5079 22.4645 21.6298C22.5689 21.7343 22.6275 21.875 22.6291 22.021L22.6251 22.0942V23.9692H27.0001V26.4692H7.0376V23.9692H14.5001V16.4692H14.3751C13.9395 16.8829 13.3713 17.125 12.7748 17.1539L12.6251 17.1567H12.5626C12.2588 17.1848 11.9532 17.1192 11.6876 16.9692C10.7634 16.596 10.1538 15.7115 10.1255 14.7236L10.1251 14.2192C10.2651 13.4811 10.722 12.8411 11.3751 12.4692C11.197 12.1673 11.1101 11.8198 11.1251 11.4692C11.1143 10.4467 11.8314 9.56784 12.8221 9.36462L12.9376 9.3442V8.9067C12.9257 8.08545 13.3882 7.33107 14.1251 6.9692C14.7682 6.71795 15.482 6.71795 16.1251 6.9692ZM21.3751 22.7192H20.1251V23.9692H21.3751V22.7192Z" fill="white"/></mask><g mask="url(#mask1)"><path fill-rule="evenodd" clip-rule="evenodd" d="M7.0376 26.4691H27.0626V6.74414H7.0376V26.4691Z" fill="white"/></g></g><defs><clipPath id="clip1"><rect width="34" height="44.4938" fill="white" transform="translate(0 0.469238)"/></clipPath><clipPath id="clip1"><rect width="20" height="20" fill="white" transform="translate(7 6.46924)"/></clipPath></defs></svg>', width: 34, height: 45, anchor: [17, 45] }, listicon: { html: '<svg width="34" height="34" viewBox="0 0 34 34" fill="none" xmlns="http://www.w3.org/2000/svg"><circle cx="17" cy="17" r="17" fill="#00A03C"/><g clip-path="url(#clip2)"><mask id="mask2" mask-type="alpha" maskUnits="userSpaceOnUse" x="7" y="6" width="20" height="21"><path d="M16.1251 6.9692C16.8232 7.31203 17.275 8.00713 17.3106 8.77763L17.3126 8.9067V9.3442C18.3626 9.50045 19.1363 10.4073 19.1251 11.4692C19.1532 11.8404 19.0657 12.2117 18.8751 12.5317C19.4874 12.8803 19.9272 13.4646 20.0952 14.1445L20.1251 14.2817V14.6567C20.1488 15.6961 19.527 16.6423 18.5626 17.0317C18.3349 17.1603 18.0779 17.2269 17.8178 17.2255L17.6876 17.2192H17.6251C17.0041 17.1954 16.4165 16.9415 15.9745 16.5095L15.8751 16.4067H15.7501V23.9692H18.8751V22.0942L18.2501 19.7192L19.4376 19.4692L20.0001 21.4692H22.0001C22.1713 21.4486 22.3426 21.5079 22.4645 21.6298C22.5689 21.7343 22.6275 21.875 22.6291 22.021L22.6251 22.0942V23.9692H27.0001V26.4692H7.0376V23.9692H14.5001V16.4692H14.3751C13.9395 16.8829 13.3713 17.125 12.7748 17.1539L12.6251 17.1567H12.5626C12.2588 17.1848 11.9532 17.1192 11.6876 16.9692C10.7634 16.596 10.1538 15.7115 10.1255 14.7236L10.1251 14.2192C10.2651 13.4811 10.722 12.8411 11.3751 12.4692C11.197 12.1673 11.1101 11.8198 11.1251 11.4692C11.1143 10.4467 11.8314 9.56784 12.8221 9.36462L12.9376 9.3442V8.9067C12.9257 8.08545 13.3882 7.33107 14.1251 6.9692C14.7682 6.71795 15.482 6.71795 16.1251 6.9692ZM21.3751 22.7192H20.1251V23.9692H21.3751V22.7192Z" fill="white"/></mask><g mask="url(#mask2)"><path fill-rule="evenodd" clip-rule="evenodd" d="M7.0376 26.4691H27.0626V6.74414H7.0376V26.4691Z" fill="white"/></g></g><defs><clipPath id="clip2"><rect width="20" height="20" fill="white" transform="translate(7 6.46924)"/></clipPath></defs></svg>', width: 34, height: 34 } },
        { name: "Geluid", color: "#FF9100", mapicon: { html: '<svg width="34" height="46" viewBox="0 0 34 46" fill="none" xmlns="http://www.w3.org/2000/svg"><g clip-path="url(#clip1)"><path d="M17 0.962891C26.3917 0.962891 34 8.49722 34 17.7976C34 30.4878 19.3587 43.4343 18.7259 43.947L17 45.4567L15.2741 43.947C14.6413 43.4343 0 30.4878 0 17.7976C0 8.49864 7.60829 0.962891 17 0.962891Z" fill="#FF9100"/></g><g clip-path="url(#clip1)"><path fill-rule="evenodd" clip-rule="evenodd" d="M21.375 7.96289V15.2191C22.501 15.6081 23.2565 16.6684 23.2565 17.8598C23.2565 19.0511 22.501 20.1114 21.375 20.5004V27.7629L14.8625 24.2691L11.6375 27.4941L9.86875 25.7254L12.5563 23.0379L11.6438 22.5504H7V13.1754H11.6438L21.375 7.96289ZM18.875 12.1379L13.25 15.1504V20.5754L18.875 23.5879V12.1379ZM24.3115 19.9105L26.2229 21.746L25.3571 22.6476L23.4457 20.8121L24.3115 19.9105ZM12 15.6754H9.5V20.0504H12V15.6754ZM27 17.2379V18.4879H24.5V17.2379H27ZM25.3456 13.0055L26.2295 13.8894L24.3158 15.803L23.432 14.9191L25.3456 13.0055Z" fill="white"/></g><defs><clipPath id="clip1"><rect width="34" height="44.4938" fill="white" transform="translate(0 0.962891)"/></clipPath><clipPath id="clip1"><rect width="20" height="20" fill="white" transform="translate(7 7.96289)"/></clipPath></defs></svg>', width: 34, height: 45, anchor: [17, 45] }, listicon: { html: '<svg width="34" height="34" viewBox="0 0 34 34" fill="none" xmlns="http://www.w3.org/2000/svg"><circle cx="17" cy="17" r="17" fill="#FF9100"/><g clip-path="url(#clip2)"><path fill-rule="evenodd" clip-rule="evenodd" d="M21.375 6.96289V14.2191C22.501 14.6081 23.2565 15.6684 23.2565 16.8598C23.2565 18.0511 22.501 19.1114 21.375 19.5004V26.7629L14.8625 23.2691L11.6375 26.4941L9.86875 24.7254L12.5563 22.0379L11.6438 21.5504H7V12.1754H11.6438L21.375 6.96289ZM18.875 11.1379L13.25 14.1504V19.5754L18.875 22.5879V11.1379ZM24.3115 18.9105L26.2229 20.746L25.3571 21.6476L23.4457 19.8121L24.3115 18.9105ZM12 14.6754H9.5V19.0504H12V14.6754ZM27 16.2379V17.4879H24.5V16.2379H27ZM25.3456 12.0055L26.2295 12.8894L24.3158 14.803L23.432 13.9191L25.3456 12.0055Z" fill="white"/></g><defs><clipPath id="clip2"><rect width="20" height="20" fill="white" transform="translate(7 6.96289)"/></clipPath></defs></svg>', width: 34, height: 34 } },
        { name: "Overig", color: "#A00078", mapicon: { html: '<svg width="34" height="45" viewBox="0 0 34 45" fill="none" xmlns="http://www.w3.org/2000/svg"><g clip-path="url(#clip3)"><path d="M17 0.457031C26.3917 0.457031 34 7.99136 34 17.2918C34 29.9819 19.3587 42.9284 18.7259 43.4411L17 44.9509L15.2741 43.4411C14.6413 42.9284 0 29.9819 0 17.2918C0 7.99278 7.60829 0.457031 17 0.457031Z" fill="#A00078"/></g><mask id="mask3" mask-type="alpha" maskUnits="userSpaceOnUse" x="9" y="9" width="16" height="16"><path d="M13.25 21.207V24.957H9.5V21.207H13.25ZM18.875 21.207V24.957H15.125V21.207H18.875ZM24.5 21.207V24.957H20.75V21.207H24.5ZM13.25 15.582V19.332H9.5V15.582H13.25ZM18.875 15.582V19.332H15.125V15.582H18.875ZM24.5 15.582V19.332H20.75V15.582H24.5ZM13.25 9.95703V13.707H9.5V9.95703H13.25ZM18.875 9.95703V13.707H15.125V9.95703H18.875ZM24.5 9.95703V13.707H20.75V9.95703H24.5Z" fill="white"/></mask><g mask="url(#mask3)"><path fill-rule="evenodd" clip-rule="evenodd" d="M9.4375 24.9822H24.5125V9.90723H9.4375V24.9822Z" fill="white"/></g><defs><clipPath id="clip3"><rect width="34" height="44.4938" fill="white" transform="translate(0 0.457031)"/></clipPath></defs></svg>', width: 34, height: 45, anchor: [17, 45] }, listicon: { html: '<svg width="34" height="34" viewBox="0 0 34 34" fill="none" xmlns="http://www.w3.org/2000/svg"><circle cx="17" cy="17" r="17" fill="#A00078"/><mask id="mask4" mask-type="alpha" maskUnits="userSpaceOnUse" x="9" y="9" width="16" height="16"><path d="M13.25 21.207V24.957H9.5V21.207H13.25ZM18.875 21.207V24.957H15.125V21.207H18.875ZM24.5 21.207V24.957H20.75V21.207H24.5ZM13.25 15.582V19.332H9.5V15.582H13.25ZM18.875 15.582V19.332H15.125V15.582H18.875ZM24.5 15.582V19.332H20.75V15.582H24.5ZM13.25 9.95703V13.707H9.5V9.95703H13.25ZM18.875 9.95703V13.707H15.125V9.95703H18.875ZM24.5 9.95703V13.707H20.75V9.95703H24.5Z" fill="white"/></mask><g mask="url(#mask4)"><path fill-rule="evenodd" clip-rule="evenodd" d="M9.4375 24.9822H24.5125V9.90723H9.4375V24.9822Z" fill="white"/></g></svg>', width: 34, height: 34 } },
      ],
      areas: [
        //{ name: "Heel West",
        //  value: "Heel West",
        //  polygon: [{ "lng": 4.8353454, "lat": 52.3731265 }, { "lng": 4.8422025, "lat": 52.3721002 }, { "lng": 4.8421761, "lat": 52.3695836 }, { "lng": 4.8455807, "lat": 52.3696369 }, { "lng": 4.8476385, "lat": 52.369853 }, { "lng": 4.8477361, "lat": 52.3695885 }, { "lng": 4.8484176, "lat": 52.369697 }, { "lng": 4.8504835, "lat": 52.3653302 }, { "lng": 4.8504956, "lat": 52.3643692 }, { "lng": 4.8501587, "lat": 52.3638376 }, { "lng": 4.8494487, "lat": 52.3633001 }, { "lng": 4.8495059, "lat": 52.3610989 }, { "lng": 4.8489152, "lat": 52.3608149 }, { "lng": 4.8487824, "lat": 52.3578658 }, { "lng": 4.8504012, "lat": 52.3578553 }, { "lng": 4.8518982, "lat": 52.357844 }, { "lng": 4.8538275, "lat": 52.3581295 }, { "lng": 4.854723, "lat": 52.3578629 }, { "lng": 4.854635, "lat": 52.3577532 }, { "lng": 4.85436, "lat": 52.3572975 }, { "lng": 4.8540881, "lat": 52.3564026 }, { "lng": 4.8547969, "lat": 52.3562758 }, { "lng": 4.8698903, "lat": 52.3601067 }, { "lng": 4.8699397, "lat": 52.3600231 }, { "lng": 4.8714122, "lat": 52.3603737 }, { "lng": 4.8712647, "lat": 52.3605634 }, { "lng": 4.8715288, "lat": 52.3605997 }, { "lng": 4.8716826, "lat": 52.3604277 }, { "lng": 4.8738605, "lat": 52.3608533 }, { "lng": 4.8738525, "lat": 52.3610213 }, { "lng": 4.8740097, "lat": 52.3610407 }, { "lng": 4.8741351, "lat": 52.3608935 }, { "lng": 4.8750611, "lat": 52.3608041 }, { "lng": 4.8756501, "lat": 52.3606138 }, { "lng": 4.876429, "lat": 52.3607996 }, { "lng": 4.8765642, "lat": 52.3606177 }, { "lng": 4.876929, "lat": 52.3606957 }, { "lng": 4.8768495, "lat": 52.360911 }, { "lng": 4.8771709, "lat": 52.3609696 }, { "lng": 4.8774, "lat": 52.3607583 }, { "lng": 4.8819952, "lat": 52.3620427 }, { "lng": 4.8813956, "lat": 52.3630818 }, { "lng": 4.8808146, "lat": 52.3634904 }, { "lng": 4.8793708, "lat": 52.3643261 }, { "lng": 4.8792691, "lat": 52.3649574 }, { "lng": 4.8787082, "lat": 52.3658206 }, { "lng": 4.8775395, "lat": 52.3667815 }, { "lng": 4.8767523, "lat": 52.3685117 }, { "lng": 4.8754901, "lat": 52.3697867 }, { "lng": 4.8745065, "lat": 52.3718772 }, { "lng": 4.8745782, "lat": 52.3725454 }, { "lng": 4.8753796, "lat": 52.373407 }, { "lng": 4.8755899, "lat": 52.3743025 }, { "lng": 4.8799131, "lat": 52.3813052 }, { "lng": 4.8796339, "lat": 52.3819128 }, { "lng": 4.880478, "lat": 52.3822531 }, { "lng": 4.8818058, "lat": 52.3843528 }, { "lng": 4.882637, "lat": 52.3854107 }, { "lng": 4.8846503, "lat": 52.3883466 }, { "lng": 4.8857963, "lat": 52.3881476 }, { "lng": 4.8911796, "lat": 52.3884502 }, { "lng": 4.8937804, "lat": 52.3886712 }, { "lng": 4.8956658, "lat": 52.3888313 }, { "lng": 4.8927982, "lat": 52.3933453 }, { "lng": 4.8850924, "lat": 52.398824 }, { "lng": 4.8762366, "lat": 52.3945287 }, { "lng": 4.8726422, "lat": 52.3948206 }, { "lng": 4.8719896, "lat": 52.3947192 }, { "lng": 4.8719508, "lat": 52.3952766 }, { "lng": 4.8715979, "lat": 52.39538 }, { "lng": 4.8667403, "lat": 52.393136 }, { "lng": 4.8643092, "lat": 52.3927072 }, { "lng": 4.8627057, "lat": 52.3938521 }, { "lng": 4.8603441, "lat": 52.3949382 }, { "lng": 4.858593, "lat": 52.3952782 }, { "lng": 4.8569204, "lat": 52.3953667 }, { "lng": 4.8569896, "lat": 52.3938363 }, { "lng": 4.8573172, "lat": 52.3938424 }, { "lng": 4.8574043, "lat": 52.3920751 }, { "lng": 4.8589526, "lat": 52.3912226 }, { "lng": 4.8592744, "lat": 52.3905434 }, { "lng": 4.8592929, "lat": 52.3887899 }, { "lng": 4.8449045, "lat": 52.3887733 }, { "lng": 4.8451066, "lat": 52.3850658 }, { "lng": 4.8446526, "lat": 52.3850638 }, { "lng": 4.8390117, "lat": 52.3850241 }, { "lng": 4.8392807, "lat": 52.3829687 }, { "lng": 4.838548, "lat": 52.3808766 }, { "lng": 4.836707, "lat": 52.3763581 }, { "lng": 4.8353454, "lat": 52.3731265 }] },
        //{ name: "De Baarsjes",
        //  value: "De Baarsjes",
        //  polygon: [{"lng":4.8558724,"lat":52.374202},{"lng":4.8577714,"lat":52.3681953},{"lng":4.8582878,"lat":52.3648623},{"lng":4.8592819,"lat":52.3648966},{"lng":4.8598228,"lat":52.364783},{"lng":4.8613989,"lat":52.3664539},{"lng":4.8661845,"lat":52.3717538},{"lng":4.8664001,"lat":52.3721596},{"lng":4.8663889,"lat":52.372566},{"lng":4.865846,"lat":52.3733281},{"lng":4.8646717,"lat":52.3734961},{"lng":4.8641583,"lat":52.3750737},{"lng":4.8640923,"lat":52.3752839},{"lng":4.8559599,"lat":52.3743342},{"lng":4.8558724,"lat":52.374202}] },
        //{ name: "Oud West",
        //  value: "Oud West",
        //  polygon: [{"lng":4.8546816,"lat":52.3568634},{"lng":4.855041,"lat":52.3563261},{"lng":4.858839,"lat":52.3572696},{"lng":4.8625458,"lat":52.3582427},{"lng":4.8646701,"lat":52.3588487},{"lng":4.868731,"lat":52.3597955},{"lng":4.8703188,"lat":52.3601231},{"lng":4.8717136,"lat":52.3604376},{"lng":4.8738218,"lat":52.3609651},{"lng":4.8763055,"lat":52.3607226},{"lng":4.8776842,"lat":52.3608635},{"lng":4.878167,"lat":52.3610044},{"lng":4.8812676,"lat":52.3618856},{"lng":4.8807043,"lat":52.3623966},{"lng":4.8798675,"lat":52.3633663},{"lng":4.8795778,"lat":52.3639428},{"lng":4.8792613,"lat":52.3644931},{"lng":4.8791272,"lat":52.3650598},{"lng":4.8787785,"lat":52.3656691},{"lng":4.8779202,"lat":52.3663734},{"lng":4.8773838,"lat":52.366809},{"lng":4.8772336,"lat":52.3676312},{"lng":4.8769385,"lat":52.3681389},{"lng":4.8754311,"lat":52.3697536},{"lng":4.8746211,"lat":52.3714043},{"lng":4.8744494,"lat":52.3720594},{"lng":4.8744602,"lat":52.3723083},{"lng":4.8752166,"lat":52.3729895},{"lng":4.8745943,"lat":52.3731762},{"lng":4.870925,"lat":52.3724033},{"lng":4.8680175,"lat":52.3717974},{"lng":4.8665959,"lat":52.3715648},{"lng":4.8654211,"lat":52.3703825},{"lng":4.8641176,"lat":52.3689905},{"lng":4.8628623,"lat":52.3676443},{"lng":4.8616499,"lat":52.3662554},{"lng":4.8604268,"lat":52.3648862},{"lng":4.8602505,"lat":52.3647431},{"lng":4.8591448,"lat":52.3634056},{"lng":4.8580772,"lat":52.3621247},{"lng":4.8575783,"lat":52.3615515},{"lng":4.857117,"lat":52.3604245},{"lng":4.856248,"lat":52.3592681},{"lng":4.8555345,"lat":52.3580035},{"lng":4.855299,"lat":52.357674},{"lng":4.855269,"lat":52.3576447},{"lng":4.855115,"lat":52.3574166},{"lng":4.8549071,"lat":52.3571512},{"lng":4.85479,"lat":52.3570018},{"lng":4.8546816,"lat":52.3568634}] },
      ],
      titleField: 'title',
      summaryField: 'summary',
      typeField: self.config.typeField || 'extraData.theme',
      areaField: self.config.areaField || 'extraData.gebied',
      user: {},
      api: {
        url: null,
        headers: null,
        isUserLoggedIn: false,
      },
      idea: {
        titleMinLength: 10,
        titleMaxLength: 20,
        summaryMinLength: 20,
        summaryMaxLength: 140,
        descriptionMinLength: 140,
        descriptionMaxLength: 5000,
      },
      argument: {
        descriptionMinLength: 30,
        descriptionMaxLength: 500,
      },
		};
		self.config = Object.assign(self.defaultConfig, props.config, self.config || {})

    // defaults
    self.config.doSearchFunction = self.config.doSearchFunction || self.doSearch.bind(self);
    self.config.map = self.config.map || {};
    self.config.map.onMapClick = self.config.map.onMapClick || self.onMapClick.bind(self);
    self.config.map.onMarkerClick = self.config.map.onMarkerClick || self.onMarkerClick.bind(self);
    self.config.map.clustering = self.config.map.clustering || {};
    self.config.map.clustering.onClusterClick = self.config.map.clustering.onClusterClick || self.onClusterClick.bind(self);
    this.config.map.autoZoomAndCenter = 'polygon';
    // Todo: configurabel
    self.config.map.polygon = [{"lng": 4.8909384,"lat": 52.3579326},{"lng": 4.8904851,"lat": 52.3551035},{"lng": 4.8905142,"lat": 52.3551068},{"lng": 4.8921449,"lat": 52.3554115},{"lng": 4.8929767,"lat": 52.3555589},{"lng": 4.8949429,"lat": 52.3559537},{"lng": 4.8963726,"lat": 52.3563288},{"lng": 4.8993847,"lat": 52.3572216},{"lng": 4.8991835,"lat": 52.3576721},{"lng": 4.8983413,"lat": 52.357505},{"lng": 4.8909384,"lat": 52.3579326}];

    self.state = {
      ideas: [],
      visibleIdeas: [],
      status: 'default', // default, idea-selected, location-selected, idea-details, idea-form
      mobileState: 'closed',
      // oud
      currentIdea: null,
      editIdea: null,
      // new, maar nog niet overal gebruikt
      selectedIdea: null,
      selectedLocation: null,
    }
    
  }

	componentDidMount(prevProps, prevState) {

    let self = this;

    // when the map is ready
		self.map.instance.addEventListener('mapIsReady', function(e) {

      // fetch the data
      self.fetchData({});

      // handle map changes
      self.map.map.on('zoomend', function() {
        self.onChangeMapBoundaries();
      });
      self.map.map.on('moveend', function() {
        self.onChangeMapBoundaries();
      });

    });

    // handle filter changes
		document.addEventListener('typeFilterUpdate', function(event) {
      self.onChangeTypeFilter(event.detail.value);
    });
		document.addEventListener('areaFilterUpdate', function(event) {
      self.onChangeAreaFilter(event.detail.value);
    });

    // handle infoblock changes
		document.addEventListener('updateSelectedIdea', function(event) {
      self.onUpdateSelectedIdea(event.detail.idea);
    });
		document.addEventListener('closeSelectedLocation', function(event) {
      self.onCloseSelectedLocation(event.detail.idea);
    });
		document.addEventListener('updateEditIdea', function(event) {
      self.onUpdateEditIdea(event.detail.idea);
    });
		document.addEventListener('ideaClick', function(event) {
      self.onIdeaClick(event.detail.idea);
    });
		document.addEventListener('selectedIdeaClick', function(event) {
      self.onSelectedIdeaClick(event.detail.idea);
    });
		document.addEventListener('newIdeaClick', function(event) {
      self.onNewIdeaClick();
    });
		document.addEventListener('clickMobileSwitcher', function(event) {
      self.onClickMobileSwitcher();
    });

    // details changes
		document.addEventListener('ideaLiked', function(event) {
      self.onIdeaLiked(event.detail);
    });
		document.addEventListener('reactionStored', function(event) {
      self.onReactionStored(event.detail);
    });
		document.addEventListener('reactionDeleted', function(event) {
      self.onReactionDeleted(event.detail);
    });

    // form changes
		document.addEventListener('newIdeaStored', function(event) {
      self.onNewIdeaStored(event.detail.idea);
    });
    
	}

  fetchData({ showIdeaDetails, showIdeaSelected }) {

    let self = this;
    let url = `${ self.config.api.url }/api/site/${  self.config.siteId  }/idea?includeVoteCount=1&includeArguments=1&includeUser=1`;

    // remove existing
    self.map.markers.map( marker => self.map.removeMarker(marker) );
    self.map.markers = [];

    fetch(url, {
      headers: {
        'Content-Type': 'application/json',
      },
    })
      .then((response) => {
        return response.json();
      })
      .then( json => {
        showIdeaDetails = showIdeaDetails || storage.get('osc-ideas-on-map-details'); //  document.location.hash.replace(/.*details=(\d+).*/, "$1");
        showIdeaSelected = showIdeaSelected || storage.get('osc-ideas-on-map-selected'); // document.location.hash.replace(/.*selected=(\d+).*/, "$1");
        let ideas = json.filter( idea => idea.location )
        ideas.map( idea => {
          if ( idea.id == showIdeaDetails) {
            showIdeaDetails = idea;
          }
          if ( idea.id == showIdeaSelected) showIdeaSelected = idea;
          idea.image = (idea.posterImage && idea.posterImage.key) || (idea.extraData && idea.extraData.images && idea.extraData.images[0]) || "https://stemvanwest.amsterdam.nl/img/placeholders/idea.jpg";
          self.map.addIdea(idea);
				});

        self.setState({ ideas }, function () {
          // self.setSelectedLocation({ lat: 52.37104644463586, lng: 4.900402911007405 })
          // return setTimeout(function(){ self.showIdeaForm() }, 500)
          if (typeof showIdeaSelected == 'object' && showIdeaSelected != null) {
						self.setNewIdea(null);
						self.setSelectedIdea(showIdeaSelected);
            self.setState({ status: 'idea-selected', currentIdea: showIdeaSelected }, function() {
              // todo: dit zou hij zelf via state moeten doen
              self.map.map.invalidateSize();
              self.map.showMarkers(self.map.markers)
              self.setSelectedIdea(self.state.currentIdea)
            });
          }
          if (typeof showIdeaDetails == 'object' && showIdeaDetails != null) {
						self.setSelectedIdea(showIdeaDetails);
						self.setNewIdea(null);
					  self.showIdeaDetails(showIdeaDetails);
          }
          self.onChangeMapBoundaries();
          // dev form
          //if (!showIdeaSelected) {
					//  self.setSelectedIdea(null);
					//  self.setNewIdea({ location: { coordinates: [52.37104644463586, 4.900402911007405] }, title: "Rutrum tincidunt", type: "Kans", theme: "Overig", summary: "rutrum tincidunt, dui sapien feugiat justo, eget egestas ligula nulla nec erat.", description: "rutrum tincidunt, dui sapien feugiat justo, eget egestas ligula nulla nec erat. maecenas tempus tempor eros. donec a justo. curabitur tellus. pellentesque risus. fusce at arcu. ut lacinia mi vel lectus. phasellus imperdiet. fusce luctus lacus a odio. in et turpis at libero tristique vulputate. sed varius ipsum. suspendisse potenti. suspendisse potenti. donec tempus arcu quis metus."});
					//  self.showIdeaForm();
          //}
				});

      })
      .catch((err) => {
        console.log('Niet goed');
        console.log(err);
      });

  }

  showIdeaDetails(idea) {
    let self = this;
    self.setSelectedIdea(idea);
    storage.set('osc-ideas-on-map-details', idea && idea.id );
    storage.set('osc-ideas-on-map-selected', null);
    // self.infoblock.setState({ mobileState: self.state.mobileState = 'opened' })
    self.setState({ status: 'idea-details', currentIdea: idea }, function() {
    // self.setState({ status: 'idea-details', currentIdea: idea, mobileState: self.state.mobileState = 'opened' }, function() {
      self.map.map.invalidateSize();
      self.map.hideMarkers({ exception: { location: { lat: idea.location.coordinates[0], lng: idea.location.coordinates[1] } } })
    });
  }

  hideIdeaDetails() {
    let self = this;
    self.setState({ status: 'idea-selected' }, function() {
      // todo: dit zou hij zelf via state moeten doen
      self.map.map.invalidateSize();
      self.map.showMarkers(self.map.markers)
      self.setSelectedIdea(self.state.currentIdea)
    });
  }

  showIdeaForm() {
    let self = this;
    self.setState({ status: 'idea-form' }, function() {
      self.map.map.invalidateSize();
      self.map.hideMarkers({ exception: { location: self.map.selectedLocation } })
    });
    // try {
    // } catch(err) {console.log(err);}
    // self.setState({ status: 'idea-details', currentIdea: idea });
  }

  hideIdeaForm() {
    let self = this;
    self.setState({ status: 'location-selected' }, function() {
      // todo: dit zou hij zelf via state moeten doen
      self.map.map.invalidateSize();
      self.map.showMarkers(self.map.markers)
      self.setNewIdea(self.state.editIdea)
    });
  }

	doSearch(searchValue, callback) {

		let self = this;
    let searchValueLc = searchValue.toLowerCase();

		let searchResult = { ideas: [], locations: [] };

    // search in ideas
		this.state.ideas.forEach((idea) => {
			let title = eval(`idea.${self.config.titleField}`) || '';
      let titlelLc = title.toLowerCase();
			let summary = eval(`idea.${self.config.summaryField}`) || '';
      let summaryLc = summary.toLowerCase();
			if (titlelLc.match(searchValueLc) || summaryLc.match(searchValueLc)) {
				searchResult.ideas.push({
					text: title,
					onClick: function() { self.onUpdateSelectedIdea(idea) },
				})
			}
		});

    // search for addresses
    fetch('https://geodata.nationaalgeoregister.nl/locatieserver/v3/suggest?rows=5&fq=gemeentenaam:amsterdam&fq=*:*&q=' + searchValueLc, {
      headers: {
        'Content-Type': 'application/json',
      },
    })
			.then((response) => {
				return response.json();
			})
      .then( json => {
        if (json && json.response && json.response.docs && json.response.docs.length) {
          searchResult.locations = json.response.docs.map( found => { return {
						text: found.weergavenaam,
						onClick: function() { onClickAddress(found.id) },
					}});
        }
        callback(searchValue, searchResult)
      })
      .catch((err) => {
        console.log('Search failed:', err);
        callback(searchValue, searchResult)
      });
    
    function onClickAddress(id) {
      fetch('https://geodata.nationaalgeoregister.nl/locatieserver/v3/lookup?fq=gemeentenaam:amsterdam&&id=' + id, {
        headers: {
          'Content-Type': 'application/json',
        },
      })
			  .then((response) => {
				  return response.json();
			  })
        .then( json => {
          if (json && json.response && json.response.docs && json.response.docs[0]) {
            let centroide_ll = json.response.docs[0].centroide_ll;
            let match = centroide_ll.match(/POINT\((\d+\.\d+) (\d+\.\d+)\)/);
            self.map.map.panTo(new L.LatLng(match[2], match[1]));
          }
        })
        .catch((err) => {
          console.log('Search failed:', err);
          callback(searchValue, searchResult)
        });
      
    }
		
	}

  setCurrentPolygon(polygon) {
    let state = { ...this.state };
    state.currentPolygon = polygon ? this.map.createCutoutPolygon(polygon): undefined;
    this.setState(state);
  }

  removeCurrentPolygon() {
    this.map.removePolygon(this.state.currentPolygon)
    let state = { ...this.state };
    state.currentPolygon = undefined;
    this.setState(state);
  }

  getVisibleIdeas() {
		if ( this.state.mobileState == 'opened' ) { // werkt omdat hij alleen op mobiel opend kan zijn
      return this.state.visibleIdeas;
    } else {
      let visibleIdeas = this.map.getVisibleIdeas()
      this.setState({ visibleIdeas });
      return visibleIdeas;
    }
  }

  setSelectedLocation(location) {
    let self = this;
    self.map.setSelectedLocation(location)
    if (self.ideaform) {
      if (!location) return;
      self.ideaform.handleLocationChange({ location, address: 'Bezig met adresgegevens ophalen...' });
			self.map.getPointInfo(location, null, function(json, marker) {
				let address = json && json._display || 'Geen adres gevonden';
				self.state.editIdea.address = address;
				self.ideaform.handleLocationChange({ location, address: address });
			})
    }
  }

  setNewIdea(idea) {
    let self = this;
    if (idea) idea.isPointInPolygon = idea.location && self.map.isPointInPolygon( { lat: idea.location.coordinates[0], lng: idea.location.coordinates[1] }, self.config.map.polygon )
    self.setState({ editIdea: idea }, function() {
      if (idea) {
        self.map.fadeMarkers({exception: [idea.location]});
        self.setSelectedLocation({ lat: idea.location.coordinates[0], lng: idea.location.coordinates[1] });  
        if (self.infoblock) {
          self.setState({ editIdea: self.state.editIdea });
          self.infoblock.setNewIdea({ ...self.state.editIdea, address: 'Bezig met adresgegevens ophalen...' });
          self.map.getPointInfo({ lat: idea.location.coordinates[0], lng: idea.location.coordinates[1] }, null, function(json, marker) {
            let address = json && json._display || 'Geen adres gevonden';
            let editIdea = self.state.editIdea;
            editIdea.address = address;
            self.setState({ editIdea });
            self.infoblock.setNewIdea({ ...self.state.editIdea, address });
          })
          //self.infoblock.updateIdeas({ ideas: self.getVisibleIdeas().filter( x => x.id != idea.id ), sortOrder: 'distance', showSortButton: false, center: { lat: idea.location.coordinates[0], lng: idea.location.coordinates[1] }, maxLength: 5 });
          self.infoblock.updateIdeas({ ideas: self.state.ideas.filter( x => x.id != idea.id ), sortOrder: 'distance', showSortButton: false, center: { lat: idea.location.coordinates[0], lng: idea.location.coordinates[1] }, maxLength: 5 });
        }
      } else {
        self.map.unfadeAllMarkers();
        self.setSelectedLocation(null);
        if (self.infoblock) {
          self.infoblock.setNewIdea(null);
          self.infoblock.updateIdeas({ ideas: self.getVisibleIdeas(), showSortButton: true });
        }
      }
    });
  }

  setSelectedIdea(idea) {
    storage.set('osc-ideas-on-map-selected', idea && idea.id );
    storage.set('osc-ideas-on-map-details', null);
    this.selectedIdea = idea;
    if (idea) {
      this.map.fadeMarkers({exception: idea});
      if (this.infoblock) {
        this.infoblock.setSelectedIdea(idea);
        // this.infoblock.updateIdeas({ ideas: this.getVisibleIdeas().filter( x => x.id != idea.id ), sortOrder: 'distance', showSortButton: false, center: { lat: idea.location.coordinates[0], lng: idea.location.coordinates[1] }, maxLength: 5 });
        this.infoblock.updateIdeas({ ideas: this.state.ideas.filter( x => x.id != idea.id ), sortOrder: 'distance', showSortButton: false, center: { lat: idea.location.coordinates[0], lng: idea.location.coordinates[1] }, maxLength: 5 });
      }
    } else {
      this.map.unfadeAllMarkers();
      if (this.infoblock) {
        this.infoblock.setSelectedIdea(null);
        this.infoblock.updateIdeas({ ideas: this.getVisibleIdeas(), showSortButton: true });
      }
    }
  }
  
	onMapClick(event) {

		if ( this.state.mobileState == 'opened' ) { // werkt omdat hij alleen op mobiel opend kan zijn
			this.infoblock.setState({ mobileState: 'closed' })
			this.setState({ mobileState: 'closed' }, function() {
				this.map.map.invalidateSize();
			})
			return;
		}

    switch (this.state.status) {

      case 'idea-details':
        break;

      case 'idea-form':
        let isPointInPolygon = this.map.isPointInPolygon( event.latlng, this.config.map.polygon );
        if (isPointInPolygon) this.setSelectedLocation(event.latlng)
        break;

      default:
        if (this.selectedIdea || this.map.selectedLocation) {
          this.setState({ ...this.state, status: 'default', currentIdea: null });
          this.setSelectedIdea(null);
          this.setNewIdea(null);
          this.infoblock.updateIdeas({ ideas: this.getVisibleIdeas(), showSortButton: true });
        } else {
          this.setState({ ...this.state, status: 'location-selected', currentIdea: null });
          this.setSelectedIdea(null);
          let newIdea = { id: 'New Idea', location: { coordinates: [ event.latlng.lat, event.latlng.lng ] } };
          this.setNewIdea(newIdea);
          // setTimeout( function() {
		      // var event = new CustomEvent('newIdeaClick', { detail: { newIdea } });
		      //   document.dispatchEvent(event);
          // }, 500 );
        }
        this.map.updateFading();
        document.querySelector('#openstad-component-ideas-on-map-info').scrollTo(0,0)
    }
  }

	onMarkerClick(event) {

		if ( this.state.mobileState == 'opened' ) { // werkt omdat hij alleen op mobiel opend kan zijn
			this.infoblock.setState({ mobileState: 'closed' })
			this.setState({ mobileState: 'closed' }, function() {
				this.map.map.invalidateSize();
			})
			return;
		}

		switch (this.state.status) {

      case 'idea-details':
        break;

      case 'idea-form':
        break;

      default:
        if (this.state.editIdea) {
          this.setState({ status: 'default', currentIdea: null });
          this.setNewIdea(null);
          this.setSelectedIdea(null);
          this.setSelectedIdea(null);
        } else {
          this.setState({ status: 'idea-selected', currentIdea: event.target.data });
          this.setNewIdea(null);
          this.setSelectedIdea(event.target.data);
        }
        document.querySelector('#openstad-component-ideas-on-map-info').scrollTo(0,0)

    }
  }

	onClusterClick(event) {

		if ( this.state.mobileState == 'opened' ) { // werkt omdat hij alleen op mobiel opend kan zijn
			this.infoblock.setState({ mobileState: 'closed' })
			this.setState({ mobileState: 'closed' }, function() {
				this.map.map.invalidateSize();
			})
			return;
		}

    this.setState({ ...this.state, status: 'default', currentIdea: null });
    this.setNewIdea(null);
    this.setSelectedIdea(null);
  }

  onChangeMapBoundaries() {
    let self = this;
    self.map.updateFading();
    switch (self.state.status) {

      case 'idea-details':
        break;

      case 'idea-form':
        break;

      case 'idea-selected':
      case 'location-selected':
        if (self.infoblock) {
          let selectedIdea = self.state.currentIdea || self.selectedIdea || self.state.editIdea;
          if (selectedIdea) {
            self.infoblock.updateIdeas({ ideas: self.state.ideas.filter( x => x.id != selectedIdea.id ), sortOrder: 'distance', showSortButton: false, center: { lat: selectedIdea.location.coordinates[0], lng: selectedIdea.location.coordinates[1] }, maxLength: 5 });
          }
        }
        break;

      default:
        if (self.infoblock) {
          self.infoblock.updateIdeas({ ideas: self.getVisibleIdeas(), showSortButton: true });
        }

    }
  }

	onUpdateEditIdea(idea) {
    this.setState({ ...this.state, editIdea: { ...idea }, currentIdea: idea });
  }

	onUpdateSelectedIdea(idea) {
    if (this.state.editIdea) this.setNewIdea(null);
    let status = idea ? 'idea-selected' : 'default';
    this.setState({ ...this.state, status, currentIdea: idea }, function() {
      this.setSelectedIdea(idea);
    });
  }

	onCloseSelectedLocation() {
    this.setState({ ...this.state, status: 'default', currentIdea: null }, function() {
      this.setSelectedIdea(null);
      this.setNewIdea(null);
      this.setSelectedLocation(null);
    });
  }
  
  onIdeaClick(idea) {
    // let showDetails = this.state.status == 'location-selected' || this.state.status == 'idea-selected';
    if (this.state.editIdea) this.setNewIdea(null);
    this.setState({ status: 'idea-selected', currentIdea: idea }, function() {
      this.setSelectedIdea(idea);
      // if (showDetails) this.showIdeaDetails(idea);
      this.showIdeaDetails(idea);
    });
  };

  onSelectedIdeaClick(idea) {
    this.showIdeaDetails(idea);
  };
  
  onNewIdeaClick() {
    this.showIdeaForm();
  };


  onNewIdeaStored(idea) {
    let self = this;
    self.setNewIdea(null);
    // reload
    // xxx
    self.fetchData({showIdeaSelected: idea.id});

    // self.setState({ ideas: [ ...self.state.ideas, idea ] }, function() {
    //   idea.image = (idea.posterImage && idea.posterImage.key) || (idea.extraData && idea.extraData.images && idea.extraData.images[0]) || "https://stemvanwest.amsterdam.nl/img/placeholders/idea.jpg";
    //   self.map.addIdea(idea);
    //   self.map.showMarkers()
    //   self.setState({ status: 'idea-selected', currentIdea: idea }, function() {
    //     self.setSelectedIdea(idea)
    //   })
    // })
  }

  onIdeaLiked(data) {
    let idea = this.state.ideas.find( idea => idea.id == data.ideaId );
    idea.yes += data.change;
  }

  onReactionStored(data) {
    let idea = this.state.ideas.find( idea => idea.id == data.ideaId );
    idea.argCount++;
    setTimeout(e => { window.location.hash = `#osc-reaction-${data.id}` }, 1000);
  }

  onReactionDeleted(data) {
    let idea = this.state.ideas.find( idea => idea.id == data.ideaId );
    idea.argCount--;
  }
  
  onChangeTypeFilter(value) {
    let self = this;
    self.setSelectedIdea(null);
    self.setNewIdea(null);
    self.setSelectedLocation(null);
	  self.map.setFilter(function(marker) {
		  if (value && value !== '0') {
			  return marker.data && eval(`marker.data.${self.config.typeField}`) && eval(`marker.data.${self.config.typeField}`) == value;
		  } else {
			  return true;
		  }
	  })
    self.setState({ status: 'default' })
    self.onChangeMapBoundaries(); // todo: rename
  }

  onChangeAreaFilter(area) {
    let self = this;
    self.setSelectedIdea(null);
    self.setNewIdea(null);
    self.removeCurrentPolygon();
    self.setCurrentPolygon( area && area.polygon );
    self.setState({ status: 'default' })
    self.map.setBoundsAndCenter(area && area.polygon || self.config.map.polygon || self.map.markers);
  }

  onClickMobileSwitcher() {
    let self = this;
    self.infoblock.setState({ mobileState: self.state.mobileState == 'closed' ? 'opened' : 'closed' })
    self.setState({ mobileState: self.state.mobileState == 'closed' ? 'opened' : 'closed' }, function() {
      self.map.map.invalidateSize();
      if (this.state.status == 'location-selected' || this.state.status == 'idea-selected') {
        let selectedIdea = self.state.currentIdea || self.selectedIdea || self.state.editIdea;
        self.map.setBoundsAndCenter([{ lat: selectedIdea.location.coordinates[0], lng: selectedIdea.location.coordinates[1] }]);
      }
    })
  }
  
	render() {

    let infoHTML = null; // todo: ik denk dat dit naar infoblock moet
    let filterHTML = null;
    let mobilePopupHTML = null;

    switch(this.state.status) {

      case 'idea-details':
        let config = { // TODO: niet bij elke render
          titleField: this.config.titleField,
          summaryField: this.config.summaryField,
          typeField: this.config.typeField,
          areaField: this.config.areaField,
          siteId: this.config.siteId,
          user: this.config.user,
          api: this.config.api,
          argument: this.config.argument,
          labels: {
            Kans: { text: 'Kans', color: 'black', backgroundColor: '#bed200' },
            Knelpunt: { text: 'Knelpunt', color: 'black', backgroundColor: '#ff9100' },
          }
        };
        infoHTML = (
			    <IdeaDetails id={this.divId + '-infoblock'} config={config} idea={this.state.currentIdea} label={this.state.currentIdea.extraData.type} id="openstad-component-ideas-on-map-info" className="openstad-component-ideas-on-map-info" mobileState={this.state.mobileState} ref={el => (this.ideadetails = el)}/>
        );
        filterHTML = (
				  <div className="openstad-component-ideas-on-map-filterbar"><div className="openstad-component-backbutton" onClick={() => this.hideIdeaDetails()}>Terug naar overzicht</div></div>
        );
        break;

      case 'idea-form':
        infoHTML = (
			    <IdeaForm id={this.divId + '-infoblock'} config={{ siteId: this.config.siteId, api: this.config.api, ...this.config.idea, formfields: { ...this.state.editIdea, userName: this.config.user.fullName } }} id="openstad-component-ideas-on-map-info" className="openstad-component-ideas-on-map-info" mobileState={this.state.mobileState} ref={el => (this.ideaform = el)}/>
        );
        filterHTML = (
				  <div className="openstad-component-ideas-on-map-filterbar"><div className="openstad-component-backbutton" onClick={() => this.hideIdeaForm()}>Terug naar overzicht</div></div>
        );
        break;

      case 'location-selected':
      case 'idea-selected':
        if (this.state.status == 'location-selected') {
          if (this.state.editIdea && this.state.editIdea.isPointInPolygon) {
            let buttonHTML = this.config.api.isUserLoggedIn
                ? (<button className="openstad-button openstad-button-blue" onClick={(event) => { this.onClickMobileSwitcher(event); this.onNewIdeaClick(event)} } ref={el => (self.newIdeaButton = el)}>Kans of knelpunt toevoegen</button>)
                : (<div>Wilt u een kans of knelpunt toevoegen? Dan moet u eerst <a href="javascript: document.location.href = '/oauth/login?returnTo=' + encodeURIComponent(document.location.href)">inloggen</a>.</div>);
            mobilePopupHTML = (
              <div className="ocs-mobile-popup">
                Een locatie vlakbij
                <h4>{this.state.editIdea && this.state.editIdea.address}</h4>
                {buttonHTML}
              </div>
            );
          }
        } else {
          mobilePopupHTML = (
            <div className="ocs-mobile-popup ocs-clickable" onClick={ () =>  { this.setState({ mobileState: 'opened' }); this.infoblock.setState({ mobileState: 'opened' }); this.showIdeaDetails(this.state.currentIdea) } }>
              <div className="openstad-component-image" style={{ backgroundImage: `url(${this.state.currentIdea && this.state.currentIdea.image})` }}></div>
              { eval(this.state.currentIdea && `this.state.currentIdea.${this.config.titleField}`) }
            </div>
          );
        }
        infoHTML = (
			    <InfoBlock id={this.divId + '-infoblock'} config={{ api: this.config.api, title: this.config.title, titleField: this.config.titleField, summaryField: this.config.summaryField, types: this.config.types  }} id="openstad-component-ideas-on-map-info" className="openstad-component-ideas-on-map-info" mobileState={this.state.mobileState} ref={el => (this.infoblock = el)}/>
        );
        filterHTML = (
				  <Filterbar id={this.divId + '-filterbar'} config={{ types: this.config.types, areas: this.config.areas, doSearchFunction: this.config.doSearchFunction, title: this.config.title }} className="openstad-component-ideas-on-map-filterbar" ref={el => (this.filterbar = el)}/>
        );
        break;

      default:
        infoHTML = (
			    <InfoBlock id={this.divId + '-infoblock'} config={{ api: this.config.api, title: this.config.title, titleField: this.config.titleField, summaryField: this.config.summaryField, types: this.config.types  }} id="openstad-component-ideas-on-map-info" className="openstad-component-ideas-on-map-info" mobileState={this.state.mobileState} ref={el => (this.infoblock = el)}/>
        );
        filterHTML = (
				  <Filterbar id={this.divId + '-filterbar'} config={{ types: this.config.types, areas: this.config.areas, doSearchFunction: this.config.doSearchFunction, title: this.config.title }} className="openstad-component-ideas-on-map-filterbar" ref={el => (this.filterbar = el)}/>
        );
        mobilePopupHTML = null;
        break;
            
    }

    return (
			<div id={this.divId} className={`openstad-component-ideas-on-map openstad-component-ideas-on-map-${this.state.status} osc-mobile-${this.state.mobileState}`} ref={el => (this.instance = el)}>
        {filterHTML}
        {infoHTML}
        <div className="openstad-component-ideas-on-map-map">
				  <Map id={this.divId + '-map'} className="" config={{ ...this.config.map, types: this.config.types, typeField: this.config.typeField }} ref={el => (this.map = el)}/>
        </div>
        {mobilePopupHTML}
			</div>
    );

  }

}
