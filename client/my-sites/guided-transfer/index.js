/**
 * External dependencies
 */
import { connect } from 'react-redux';
import page from 'page';

/**
 * Internal dependencies
 */
import GuidedTransfer from './guided-transfer';
import { getSelectedSiteId } from 'state/ui/selectors';
import { getSiteSlug } from 'state/sites/selectors';

function mapStateToProps( state ) {
	return {
		showExporter: () => {
			const siteId = getSelectedSiteId( state );
			const siteSlug = getSiteSlug( state, siteId );

			page( `/settings/export/${siteSlug}` );
		}
	};
}

export default connect( mapStateToProps )( GuidedTransfer );
