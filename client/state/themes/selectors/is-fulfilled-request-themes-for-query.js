import { getSerializedThemesQuery } from 'calypso/state/themes/utils';

import 'calypso/state/themes/init';

/**
 * Returns true if currently the themes query was already fullfiled, or false
 * otherwise.
 *
 * @param  {object}  state  Global state tree
 * @param  {number}  siteId Site ID
 * @param  {object}  query  Theme query object
 * @returns {boolean}        Whether themes are being requested
 */
export function isFulfilledThemesForQuery( state, siteId, query ) {
	const serializedQuery = getSerializedThemesQuery( query, siteId );
	return state.themes.queryRequests[ serializedQuery ] === false;
}
