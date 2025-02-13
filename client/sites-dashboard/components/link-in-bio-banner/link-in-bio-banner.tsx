import { useMobileBreakpoint } from '@automattic/viewport-react';
import { useSelector } from 'react-redux';
import { SiteExcerptData } from 'calypso/data/sites/site-excerpt-types';
import { getPreference } from 'calypso/state/preferences/selectors';
import { LINK_IN_BIO_BANNER_PREFERENCE } from './link-in-bio-banner-parts';
import { LinkInBioBanners, BannerType } from './link-in-bio-banners';

type Props = {
	displayMode: 'row' | 'grid';
	sites: SiteExcerptData[];
};

const hasLinkInBioSite = ( sites: SiteExcerptData[] ) => {
	return Boolean(
		sites.find( ( site ) => {
			const option = site.options || {};
			return option.site_intent === 'link-in-bio';
		} )
	);
};

export const LinkInBioBanner = ( props: Props ) => {
	const { displayMode, sites } = props;
	const siteCount = sites.length;
	const doesNotAlreadyHaveALinkInBioSite = ! hasLinkInBioSite( sites );
	const isMobile = useMobileBreakpoint();
	const isBannerVisible = useSelector( ( state ) =>
		getPreference( state, LINK_IN_BIO_BANNER_PREFERENCE )
	);
	const showBanner =
		( doesNotAlreadyHaveALinkInBioSite && isBannerVisible == null ) || isBannerVisible;

	let bannerType: BannerType = 'none';
	if ( showBanner ) {
		if ( isMobile ) {
			bannerType = 'tile';
		} else if ( displayMode === 'row' && siteCount === 1 ) {
			bannerType = 'row';
		} else if ( displayMode === 'grid' ) {
			if ( siteCount === 1 ) {
				bannerType = 'double-tile';
			} else if ( siteCount === 2 ) {
				bannerType = 'tile';
			}
		}
	}

	return LinkInBioBanners[ bannerType ];
};
