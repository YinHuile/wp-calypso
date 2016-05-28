/**
 * External dependencies
 */
import { combineReducers } from 'redux';
import union from 'lodash/union';
import findIndex from 'lodash/findIndex';
import forEach from 'lodash/forEach';
import filter from 'lodash/filter';
import has from 'lodash/has';
import debugModule from 'debug';

/**
 * Internal dependencies
 */
import {
	READER_START_RECOMMENDATIONS_RECEIVE,
	READER_START_RECOMMENDATIONS_REQUEST,
	READER_START_RECOMMENDATIONS_REQUEST_SUCCESS,
	READER_START_RECOMMENDATIONS_REQUEST_FAILURE,
	READER_START_RECOMMENDATION_INTERACTION,
	SERIALIZE,
	DESERIALIZE,
} from 'state/action-types';
import { itemsSchema } from './schema';
import { isValidStateWithSchema } from 'state/utils';

/**
 * Module variables
 */
const debug = debugModule( 'calypso:redux:reader-start-recommendations' );

/**
 * Tracks all known list objects, indexed by list ID.
 *
 * @param  {Array} state  Current state
 * @param  {Object} action Action payload
 * @return {Array}        Updated state
 */
export function items( state = [], action ) {
	switch ( action.type ) {
		case READER_START_RECOMMENDATIONS_RECEIVE:
			let updatedRecommendations = state;

			// Filter out any recommendations we already have
			const newRecommendations = filter( action.recommendations, ( incomingRecommendation ) => {
				if ( findIndex( state, ( existingRecommendation ) => {
					return existingRecommendation.ID === incomingRecommendation.ID;
				} ) >= 0 ) {
					return false;
				}
				return true;
			} );

			const totalRecommendationsCount = state.length + newRecommendations.length;

			forEach( newRecommendations, ( recommendation ) => {
				// We want to insert the new recommendation immediately after its parent, if there is one
				let parentPosition = findIndex( state, ( item ) => {
					if ( ! has( item, 'recommended_site_ID' ) ) {
						return false;
					}
					return item.recommended_site_ID === recommendation.origin_site_ID && item.recommended_post_ID === recommendation.origin_post_ID;
				} );

				if ( parentPosition < 0 ) {
					parentPosition = totalRecommendationsCount - 1;
				}

				updatedRecommendations = insertItemAtArrayPosition( updatedRecommendations, recommendation, parentPosition );
			} );
			return updatedRecommendations;

		case SERIALIZE:
			return state;
		case DESERIALIZE:
			if ( ! isValidStateWithSchema( state, itemsSchema ) ) {
				return [];
			}
			return state;
	}
	return state;
}

/**
 * Returns the updated requests state after an action has been dispatched.
 *
 * @param  {Object} state  Current state
 * @param  {Object} action Action payload
 * @return {Object}        Updated state
 */
export function isRequestingRecommendations( state = false, action ) {
	switch ( action.type ) {
		case READER_START_RECOMMENDATIONS_REQUEST:
		case READER_START_RECOMMENDATIONS_REQUEST_SUCCESS:
		case READER_START_RECOMMENDATIONS_REQUEST_FAILURE:
			return READER_START_RECOMMENDATIONS_REQUEST === action.type;

		case SERIALIZE:
		case DESERIALIZE:
			return false;
	}

	return state;
}

export function recommendationsInteractedWith( state = [], action ) {
	switch ( action.type ) {
		case READER_START_RECOMMENDATION_INTERACTION:
			return union( state, [ action.recommendationId ] );

		case SERIALIZE:
		case DESERIALIZE:
			return state;
	}

	return state;
}

function insertItemAtArrayPosition( array, item, position ) {
	const beforeSlice = array.slice( 0, position );
	const afterSlice = array.slice( position );
	return beforeSlice.concat( item, afterSlice );
}

export default combineReducers( {
	items,
	isRequestingRecommendations,
	recommendationsInteractedWith
} );
