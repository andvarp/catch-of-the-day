import React from 'react'



const Header = (props) => {
	return (
		<header className="top">
			<h1>
				Catch 
				<span className="ofThe">
					<span className="of">of</span>
					<span className="the">the</span>
				</span>
				Day
			</h1>
			<h3 className="tagLine">{props.tagLine}</h3>
		</header>
	);
}

Header.propTypes = {
	tagLine: React.PropTypes.string.isRequired
}


export default Header;