import { withStorageKey } from '@automattic/state-utils';
import {
	COUNTRIES_DOMAINS_UPDATED,
	COUNTRIES_PAYMENTS_UPDATED,
	COUNTRIES_SMS_UPDATED,
	COUNTRIES_WOOCOMMERCE_UPDATED,
} from 'calypso/state/action-types';
import { combineReducers } from 'calypso/state/utils';

const createListReducer =
	( updatedActionType ) =>
	( state = [], action ) => {
		switch ( action.type ) {
			case updatedActionType:
				return action.countries;
			default:
				return state;
		}
	};

const combinedReducer = combineReducers( {
	domains: createListReducer( COUNTRIES_DOMAINS_UPDATED ),
	payments: createListReducer( COUNTRIES_PAYMENTS_UPDATED ),
	sms: createListReducer( COUNTRIES_SMS_UPDATED ),
	woocommerce: createListReducer( COUNTRIES_WOOCOMMERCE_UPDATED ),
} );

const countriesReducer = withStorageKey( 'countries', combinedReducer );
export default countriesReducer;
