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
import { getPurchases } from 'state/purchases/selectors';

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
	const recentRenewals = purchases.filter(
		( { mostRecentRenewMoment, productName, expiryMoment } ) => {
			const oldestMoment = i18n.moment().subtract( 30, 'days' );
			return (
				productName &&
				expiryMoment &&
				mostRecentRenewMoment &&
				mostRecentRenewMoment.isAfter( oldestMoment )
			);
		}
	);
	const productListItems = recentRenewals.map( product => {
		const domain = product.includedDomain || product.meta || product.domain;
		const link = 'https://' + domain;
		return (
			<RecentRenewalListItem
				key={ domain + product.productName }
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
	return {
		purchases: getPurchases( state ),
		siteId: getSelectedSiteId( state ),
	};
};

export default connect( mapStateToProps )( localize( RecentRenewals ) );
