import PluginDetailsSidebar from 'calypso/my-sites/plugins/plugin-details-sidebar';
import PluginSections from 'calypso/my-sites/plugins/plugin-sections';
import PluginSectionsCustom from 'calypso/my-sites/plugins/plugin-sections/custom';

interface Props {
	fullPlugin: any;
	isMarketplaceProduct: boolean;
	isWpcom: boolean;
}

export default function PluginDetailsBody( { fullPlugin, isMarketplaceProduct, isWpcom }: Props ) {
	return (
		<div className="plugin-details__layout plugin-details__body">
			<div className="plugin-details__layout-col-left">
				{ fullPlugin.wporg || isMarketplaceProduct ? (
					<PluginSections
						className="plugin-details__plugins-sections"
						plugin={ fullPlugin }
						isWpcom={ isWpcom }
						addBanner
						removeReadMore
					/>
				) : (
					<PluginSectionsCustom plugin={ fullPlugin } />
				) }
			</div>
			<div className="plugin-details__layout-col-right">
				<PluginDetailsSidebar plugin={ fullPlugin } />
			</div>
		</div>
	);
}
