import React, { Component } from 'react';
import { Redirect,Route, Switch } from 'react-router-dom';
import { uploadItem, getItemFromKVPair, getAllItems } from '../shared/Firebase';

export default class JunTest extends Component {
	constructor() {
		super();
		this.state = {
			users : []
		};
	}

	componentDidMount() {
		console.log('ComDidMount by JunTest');
		// uploadItem('james','abc',20,'etc', '5555', 'hahaha');
		getItemFromKVPair('seller', 'james').then(res => {
			console.log(res.val())
		});
		// console.log(getAllItems());
		console.log('Mount End');
	}

	render() {
		return (
			<div className="container">
				<h4>Testing!!</h4>
				<h4>{ this.state.users }</h4>
			</div>
		);
	}
}