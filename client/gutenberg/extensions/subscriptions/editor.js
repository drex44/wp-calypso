/** @format */

/**
 * External dependencies
 */
import { Fragment } from '@wordpress/element';

/**
 * Internal dependencies
 */
//import './editor.scss';
import edit from './edit';
import save from './save';
import { __ } from 'gutenberg/extensions/presets/jetpack/utils/i18n';
import registerJetpackBlock from '../presets/jetpack/utils/register-jetpack-block';
import renderMaterialIcon from 'gutenberg/extensions/presets/jetpack/utils/render-material-icon';

export const name = 'subscriptions';
export const settings = {
	title: __( 'Subscription form' ),

	description: (
		<Fragment>
			<p>
				{ __(
					'A form enabling readers to get notifications when new posts are published from this site.'
				) }
			</p>
		</Fragment>
	),
	icon: renderMaterialIcon(
		<path d="M23 16v2h-3v3h-2v-3h-3v-2h3v-3h2v3h3zM20 2v9h-4v3h-3v4H4c-1.1 0-2-.9-2-2V2h18zM8 13v-1H4v1h4zm3-3H4v1h7v-1zm0-2H4v1h7V8zm7-4H4v2h14V4z" />
	),
	category: 'jetpack',

	keywords: [ __( 'subscribe' ), __( 'join' ), __( 'follow' ) ],

	attributes: {
		subscriber_count_string: { type: 'string', default: '' },
		subscribe_placeholder: { type: 'string', default: 'Email Address' },
		subscribe_button: { type: 'string', default: 'Subscribe' },
		show_subscribers_total: { type: 'boolean', default: false },
	},
	edit,
	save,
};

registerJetpackBlock( name, settings );
