import { Onboard } from '@automattic/data-stores';
import { useIsEnglishLocale } from '@automattic/i18n-utils';
import { useTranslate } from 'i18n-calypso';
import type { Goal } from './types';

const SiteGoal = Onboard.SiteGoal;
const HIDE_GOALS = [ SiteGoal.DIFM, SiteGoal.Import ];

const shouldDisplayGoal = ( { key }: Goal ) => ! HIDE_GOALS.includes( key );

export const useGoals = ( displayAllGoals = false ): Goal[] => {
	const translate = useTranslate();
	const isEnglishLocale = useIsEnglishLocale();

	const goals = [
		{
			key: SiteGoal.Write,
			title: translate( 'Write & Publish' ),
		},
		{
			key: SiteGoal.Sell,
			title: translate( 'Sell online' ),
		},
		{
			key: SiteGoal.Promote,
			title: translate( 'Promote myself or business' ),
		},
		{
			key: SiteGoal.DIFM,
			title: translate( 'Hire a professional to design my website' ),
			isPremium: true,
		},
		{
			key: SiteGoal.Import,
			title: translate( 'Import my existing website content' ),
		},
		{
			key: SiteGoal.Other,
			title: translate( 'Other' ),
		},
	];

	const hideDIFMGoalForNonEN = ( { key }: Goal ) => {
		if ( key === SiteGoal.DIFM && ! isEnglishLocale ) {
			return false;
		}
		return true;
	};

	return displayAllGoals ? goals.filter( hideDIFMGoalForNonEN ) : goals.filter( shouldDisplayGoal );
};
