/** @format */

/**
 * External dependencies
 */
import React from 'react';
import { connect } from 'react-redux';
import i18n, { localize } from 'i18n-calypso';
import PropTypes from 'prop-types';

/**
 * Internal dependencies
 */
import QuerySitePurchases from 'components/data/query-site-purchases';
import { getSelectedSiteId } from 'state/ui/selectors';
import { getSitePurchases } from 'state/purchases/selectors';

function RecentRenewalListItem( { link, domain, productName, expiryMoment, translate } ) {
	return (
		expiryMoment && (
			<li>
				<a href={ link }>{ domain }</a>{' '}
				{ translate( '%(productName)s recently renewed and will expire on %(expiryDate)s', {
					args: {
						productName,
						expiryDate: expiryMoment.format( 'LL' ),
					},
				} ) }
				.
			</li>
		)
	);
}

RecentRenewalListItem.propTypes = {
	link: PropTypes.string.isRequired,
	domain: PropTypes.string.isRequired,
	productName: PropTypes.string.isRequired,
	expiryMoment: PropTypes.object.isRequired,
	translate: PropTypes.func.isRequired,
};

export function RecentRenewals( { purchases, siteId, translate } ) {
	const oldestMoment = i18n.moment().subtract( 30, 'days' );
	const recentRenewals = purchases.filter( product => {
		return (
			product.siteId === siteId &&
			product.subscriptionStatus === 'active' &&
			product.productName &&
			product.expiryMoment &&
			product.renewMoment &&
			product.mostRecentRenewMoment &&
			product.mostRecentRenewMoment.isAfter( oldestMoment )
		);
	} );
	const productListItems = recentRenewals.map( product => {
		const domain = product.isDomainRegistration
			? product.meta || product.domain
			: product.includedDomain || product.domain;
		const link = 'https://' + domain;
		return (
			<RecentRenewalListItem
				key={ product.id }
				link={ link }
				domain={ domain }
				productName={ product.productName }
				expiryMoment={ product.expiryMoment }
				translate={ translate }
			/>
		);
	} );
	const productList = productListItems.length ? (
		<ul className="checkout__recent-renewals">{ productListItems }</ul>
	) : null;
	return (
		<React.Fragment>
			{ siteId && <QuerySitePurchases siteId={ siteId } /> }
			{ productList }
		</React.Fragment>
	);
}

RecentRenewals.propTypes = {
	purchases: PropTypes.array.isRequired,
	siteId: PropTypes.number.isRequired,
	translate: PropTypes.func.isRequired,
};

const mapStateToProps = state => {
	const siteId = getSelectedSiteId( state );
	return {
		purchases: getSitePurchases( state, siteId ),
		siteId,
	};
};

export default connect( mapStateToProps )( localize( RecentRenewals ) );
