/**
 * External dependencies
 */
import React, { PropTypes } from 'react';

/**
 * Internal dependencies
 */
import CompactCard from 'components/card/compact';
import Button from 'components/forms/form-button';

export default React.createClass( {
	displayName: 'GuidedTransferOptions',

	propTypes: {
		purchaseGuidedTransfer: PropTypes.func.isRequired
	},

	render: function() {
		return (
			<div>
				<CompactCard>
					<div className="exporter__guided-transfer-options-header-title-container">
						<h1 className="exporter__title">
							{ this.translate( 'Guided Transfer' ) }
						</h1>
					</div>
					<div className="exporter__guided-transfer-options-header-button-container">
						<Button
							onClick={ this.props.purchaseGuidedTransfer }
							isPrimary={ true }>
							{ this.translate( 'Purchase a Guided Transfer' ) }
						</Button>
					</div>
				</CompactCard>
			</div>
		);
	}
} );
