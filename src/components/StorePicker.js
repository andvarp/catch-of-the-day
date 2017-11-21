import React from 'react'
import { getFunName } from '../helpers'

class StorePicker extends React.Component {

	goToStore(event) {
		event.preventDefault();
		const storeId = this.storeInput.value;
		console.log('GotoStore', storeId);
		this.context.router.transitionTo(`/store/${storeId}`);
	}

	render() {
		return (
			<form className="store-selector" onSubmit={this.goToStore.bind(this)}>
				{ /* Comment in jsx */ }
				<h2>Please enter a store</h2>
				<input type="text" required placeholder="Store Name" defaultValue={getFunName()} ref={(input)=>{this.storeInput = input}}/>
				<button type="submit">Visit Store =></button>
			</form>
		);
	}
}

StorePicker.contextTypes = {
	router: React.PropTypes.object
}

export default StorePicker;