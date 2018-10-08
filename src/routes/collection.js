
import React from 'react';
import {  Route, Switch, withRouter } from 'react-router-dom';
// import Device from 'views/Devices/Device';
// import CalibrateDevice from 'views/Devices/CalibrateDevice';
// import EditDetails from 'components/Devices/EditDetails';
// import ResetDevice from 'views/Devices/ResetDevice';
// import EditHardware from 'components/Devices/EditHardware';
import withLocalization from 'components/Localization/T';
import withSnackbar from 'components/Localization/S';
import { compose } from 'recompose';
import Collection from 'views/Collections/Collection';

const collection = (props) => {
	return (
		<Switch>
			{/* <Route path={`${props.match.url}/edit-hardware`} render={() => <EditHardware {...props} />} />
			<Route path={`${props.match.url}/setup`} render={() => <CalibrateDevice {...props} />} /> */}
			{/* <Route path={`${props.match.url}/edit`} render={() => <EditDetails {...props} />} /> */}
			{/* <Route path={`${props.match.url}/reset`} render={() => <ResetDevice {...props}/>}/> */}
			<Route path={`${props.match.url}`} render={() => <Collection {...props} />} /> 
		</Switch>
	)
}

export default compose(withRouter, withLocalization(), withSnackbar())(collection)