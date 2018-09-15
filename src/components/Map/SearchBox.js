import React, { Fragment } from 'react';
import { TextF } from '..';
const { compose, withProps, lifecycle } = require("recompose");
const {
	withScriptjs,
} = require("react-google-maps");
const { StandaloneSearchBox } = require("react-google-maps/lib/components/places/StandaloneSearchBox");

export const PlacesWithStandaloneSearchBox = compose(
	withProps({
		googleMapURL: 
			"https://maps.googleapis.com/maps/api/js?key=" + process.env.REACT_APP_SENTI_MAPSKEY + "&v=3.exp&libraries=geometry,drawing,places",
		loadingElement: <div style={{ height: `100%` }} />,
		containerElement: <div style={{ height: `400px` }} />,
	}),
	lifecycle({
		componentWillMount() {
			const refs = {}
			this.setState({
				places: [],
				onSearchBoxMounted: ref => {
					refs.searchBox = ref;
				},
				handleChange: (e) => {
					this.props.handleChange(e.target.value)
				},
				onPlacesChanged: () => {
					const places = refs.searchBox.getPlaces();
					if (places[0])
						this.props.handleChange(places[0].formatted_address)
				},
			})
		},
	}),
	withScriptjs  
)(props => { 
	// console.log(props)
	return <Fragment>
		<StandaloneSearchBox
			ref={props.onSearchBoxMounted}
			bounds={props.bounds}
			onPlacesChanged={props.onPlacesChanged}
		>
			<TextF
				id={"calibrate-address"}
				label={props.t("devices.fields.address")}
				handleChange={props.handleChange}
				noFullWidth
				value={props.address}
			/>
		
		</StandaloneSearchBox>
		{/* <ol> //For debugging purposes
			{props.places.map(({ place_id, formatted_address, geometry: { location } }) =>
				<li key={place_id}>
					{formatted_address}
					{" at "}
					({location.lat()}, {location.lng()})
				</li>
			)}
		</ol> */}
	</Fragment>
}
);
