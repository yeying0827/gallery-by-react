import React from 'react';

class TestComponent extends React.Component {
	render(){
		return (
			<div style={{color:'red'}}>test component</div>
		);
	}
}

TestComponent.defaultProps = {
};

export default TestComponent;