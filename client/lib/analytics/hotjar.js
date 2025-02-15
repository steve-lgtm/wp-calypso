import { getDoNotTrack } from '@automattic/calypso-analytics';
import config from '@automattic/calypso-config';
import debug from 'debug';
import { isE2ETest } from 'calypso/lib/e2e';
import isJetpackCloud from 'calypso/lib/jetpack/is-jetpack-cloud';
import { mayWeTrackCurrentUserGdpr, isPiiUrl } from './utils';

const hotjarDebug = debug( 'calypso:analytics:hotjar' );

let hotJarScriptLoaded = false;

export function addHotJarScript() {
	if (
		hotJarScriptLoaded ||
		! config( 'hotjar_enabled' ) ||
		isE2ETest() ||
		getDoNotTrack() ||
		isPiiUrl() ||
		! mayWeTrackCurrentUserGdpr()
	) {
		hotjarDebug( 'Not loading HotJar script' );
		return;
	}

	const hotjarSiteSettings = isJetpackCloud()
		? { hjid: 3165344, hjsv: 6 } // Calypso green (cloud.jetpack.com)
		: { hjid: 227769, hjsv: 5 }; // Calypso blue (wordpress.com)

	( function ( h, o, t, j, a, r ) {
		hotjarDebug( 'Loading HotJar script' );
		h.hj =
			h.hj ||
			function () {
				( h.hj.q = h.hj.q || [] ).push( arguments );
			};
		h._hjSettings = hotjarSiteSettings;
		a = o.getElementsByTagName( 'head' )[ 0 ];
		r = o.createElement( 'script' );
		r.async = 1;
		r.src = t + h._hjSettings.hjid + j + h._hjSettings.hjsv;
		a.appendChild( r );
	} )( window, document, '//static.hotjar.com/c/hotjar-', '.js?sv=' );

	hotJarScriptLoaded = true;
}
