import React from 'react'
import AddFishForm from './AddFishForm'
import base from '../base'

class Inventory extends React.Component {
	constructor() {
		super();
		this.renderInventory = this.renderInventory.bind(this);
		this.renderLogin = this.renderLogin.bind(this);
		this.handleChange = this.handleChange.bind(this);
		this.authenticate = this.authenticate.bind(this);
		this.authHandler = this.authHandler.bind(this);
		this.logout = this.logout.bind(this);
		this.state = {
			uid: null,
			owner: null
		}
	}

	componentDidMount(){
		base.onAuth((user)=>{
			if(user){
				this.authHandler(null, {user});
			}
		});
	}

	handleChange(e, key) {
		const fish = this.props.fishes[key];
		const updateFish = {
			...fish,
			[e.target.name]: e.target.value
		}
		this.props.updateFish(key, updateFish);
	}

	renderLogin() {
		return (
			<nav className="login">
				<h2>Inventory</h2>
				<p>Sing in to manage your store's inventory</p>
				<button className="github" onClick={()=>this.authenticate('github')}>Log in with Github</button>
				<button className="facebook" onClick={()=>this.authenticate('facebook')}>Log in with Facebook</button>
				<button className="twitter" onClick={()=>this.authenticate('twitter')}>Log in with Twitter</button>
			</nav>
		);
	}

	renderInventory(key) {
		const fish = this.props.fishes[key];

		return (
			<div className="fish-edit" key={key}>
				<input name="name" value={fish.name} type="text" placeholder="Fish Name" onChange={ (e) => this.handleChange(e, key) }/>
				<input name="price" value={fish.price} type="text" placeholder="Fish Price" onChange={ (e) => this.handleChange(e, key) }/>
				<select name="status" value={fish.status} onChange={ (e) => this.handleChange(e, key) }>
					<option value="available">Fresh!</option>
					<option value="unavailable">Sold Out!</option>
				</select>
				<textarea name="desc" value={fish.desc} placeholder="Fish Desc" onChange={ (e) => this.handleChange(e, key) }></textarea>
				<input name="image" value={fish.image} type="text" placeholder="Fish Image" onChange={ (e) => this.handleChange(e, key) }/>
				<button onClick={()=>this.props.removeFish(key)}>Remove Fish</button>
			</div>
		);
	}

	authenticate(provider) {
		console.log(`Trying to logd in with ${provider}`);
		console.log(base)
		base.authWithOAuthPopup(provider, this.authHandler);
	}

	logout() {
		base.unauth();
		this.setState({uid:null});
	}

	authHandler(err, authData) {
		console.log(authData);
		if(err) {
			console.error(err);
			return;
		}
		
		// grab store info
		const storeRef = base.database().ref(this.props.storeId);

		// query the firebase once for the store data
		storeRef.once('value', (snapshot)=>{
			const data = snapshot.val() || {};

			// claim it as our own if there is no owner already
			if (!data.owner) {
				storeRef.set({
					owner: authData.user.uid
				})
			}

			this.setState({
				uid: authData.user.uid,
				owner: data.owner || authData.user.uid
			})
		});


	}

	render() {
		const logout = <button onClick={this.logout}>Log Out!</button>;
		// Check not logged in
		if(!this.state.uid){
			return (
				<div>{this.renderLogin()}</div>
			);
		}

		if (this.state.uid !== this.state.owner) {
			return (
				<div>
					<p>Sorry you aren't the owner of this store!</p>
					{logout}
				</div>
			);
		}

		return (
			<div>
				<p>Inventory</p>
				{logout}
				{Object.keys(this.props.fishes).map(this.renderInventory)}
				<AddFishForm addFish={this.props.addFish}/>
				<button onClick={this.props.loadSamples}>Load Sample Fishes</button>
			</div>
		);
	}
}

Inventory.propTypes = {
	fishes: React.PropTypes.object.isRequired,
	updateFish: React.PropTypes.func.isRequired,
	removeFish: React.PropTypes.func.isRequired,
	addFish: React.PropTypes.func.isRequired,
	loadSamples: React.PropTypes.func.isRequired,
	storeId: React.PropTypes.string.isRequired
}

export default Inventory;