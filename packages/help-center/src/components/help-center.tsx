/* eslint-disable no-restricted-imports */
/**
 * External Dependencies
 */
import { recordTracksEvent } from '@automattic/calypso-analytics';
import { useSupportAvailability } from '@automattic/data-stores';
import { useHappychatAvailable } from '@automattic/happychat-connection';
import { useSelect, useDispatch } from '@wordpress/data';
import { createPortal, useEffect, useRef } from '@wordpress/element';
import { useSelector } from 'react-redux';
import getIsSimpleSite from 'calypso/state/sites/selectors/is-simple-site';
import { getSelectedSiteId } from 'calypso/state/ui/selectors';
/**
 * Internal Dependencies
 */
import { useHCWindowCommunicator } from '../happychat-window-communicator';
import { useStillNeedHelpURL } from '../hooks/use-still-need-help-url';
import { HELP_CENTER_STORE, USER_STORE } from '../stores';
import { Container } from '../types';
import { SITE_STORE } from './help-center-contact-form';
import HelpCenterContainer from './help-center-container';

import '../styles.scss';

const HelpCenter: React.FC< Container > = ( { handleClose, hidden } ) => {
	const portalParent = useRef( document.createElement( 'div' ) ).current;
	const { data: chatStatus } = useSupportAvailability( 'CHAT' );
	const { data } = useHappychatAvailable( Boolean( chatStatus?.is_user_eligible ) );
	const { setShowHelpCenter } = useDispatch( HELP_CENTER_STORE );
	const { setUnreadCount } = useDispatch( HELP_CENTER_STORE );

	const { show, isMinimized } = useSelect( ( select ) => ( {
		isMinimized: select( HELP_CENTER_STORE ).getIsMinimized(),
		show: select( HELP_CENTER_STORE ).isHelpCenterShown(),
	} ) );

	const { unreadCount, closeChat } = useHCWindowCommunicator( isMinimized || ! show );

	useEffect( () => {
		setUnreadCount( unreadCount );
	}, [ unreadCount, setUnreadCount ] );

	useEffect( () => {
		if ( data?.status === 'assigned' ) {
			setShowHelpCenter( true );
		}
	}, [ data, setShowHelpCenter ] );

	const { siteId, isSimpleSite } = useSelector( ( state ) => {
		return {
			siteId: getSelectedSiteId( state ),
			isSimpleSite: getIsSimpleSite( state ),
		};
	} );

	// prefetch the current site and user
	useSelect( ( select ) => select( SITE_STORE ).getSite( siteId ) );
	useSelect( ( select ) => select( USER_STORE ).getCurrentUser() );
	useSupportAvailability( 'CHAT', isSimpleSite );
	useStillNeedHelpURL();

	useEffect( () => {
		const classes = [ 'help-center' ];
		portalParent.classList.add( ...classes );

		portalParent.setAttribute( 'aria-modal', 'true' );
		portalParent.setAttribute( 'aria-labelledby', 'header-text' );

		document.body.appendChild( portalParent );
		const start = Date.now();

		return () => {
			recordTracksEvent( 'calypso_helpcenter_activity_time', {
				elapsed: ( Date.now() - start ) / 1000,
			} );
			document.body.removeChild( portalParent );
			closeChat();
			handleClose();
		};
	}, [ portalParent ] );

	return createPortal(
		<HelpCenterContainer handleClose={ handleClose } hidden={ hidden } />,
		portalParent
	);
};

export default HelpCenter;
