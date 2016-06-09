/**
 * External dependencies
 */
import React, { PropTypes } from 'react';

/**
 * Internal dependencies
 */
import HeaderCake from 'components/header-cake';

export default React.createClass( {
	displayName: 'GuidedTransfer',

	propTypes: {
		showExporter: PropTypes.func.isRequired
	},

	render: function() {
		return (
			<div className="guided-transfer">
				<HeaderCake onClick={ this.props.showExporter } isCompact={ true }>{ this.translate( 'Guided Transfer' ) }</HeaderCake>
			</div>
		);
	}
} );
