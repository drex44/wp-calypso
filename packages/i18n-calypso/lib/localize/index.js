var React = require( 'react' ),
	assign = require( 'lodash.assign' );

/**
 * Localize a React component
 * @param ComposedComponent
 * @returns A new Localized React Component
 */
module.exports = function( i18n ) {
	var i18nProps = {
		moment: i18n.moment,
		numberFormat: i18n.numberFormat.bind( i18n ),
		translate: i18n.translate.bind( i18n )
	};

	return function( ComposedComponent ) {
		var componentName = ComposedComponent.displayName || ComposedComponent.name || '';

		return React.createClass( {
			displayName: 'Localized' + componentName,

			componentDidMount: function() {
				this.boundForceUpdate = this.forceUpdate.bind( this );
				i18n.stateObserver.addListener( 'change', this.boundForceUpdate );
			},

			componentWillUnmount: function() {
				i18n.stateObserver.removeListener( 'change', this.boundForceUpdate );
			},

			render: function() {
				var props = assign( {}, this.props, i18nProps );
				return React.createElement( ComposedComponent, props );
			}
		} );
	};
};