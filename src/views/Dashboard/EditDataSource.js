import React, { } from "react";
import { ItemG } from 'components';
import { useSelector } from 'react-redux'

import { editGraph } from 'redux/dsSystem';
import ESChart from './EditSources/Chart'
import ESGauge from './EditSources/Gauge';
import ESScorecard from './EditSources/Scorecard';
import ESMap from './EditSources/Map';
import ESMSChart from './EditSources/MSChart';
import { useLocalization, useDispatch } from 'hooks';
import ESScorecardAB from './EditSources/ScorecardAB';

// const mapStateToProps = (state, props) => ({
// 	g: state.dsSystem.eGraph,
// 	sensor: state.data.sensor,
// 	cfs: [...state.data.functions, { id: -1, name: props.t('no.cloudfunction') }],
// 	sensors: state.data.sensors,
// 	deviceType: state.data.deviceType
// })

// const mapDispatchToProps = dispatch => ({
// 	editGraph: (newG) => dispatch(editGraph(newG)),
// 	getSensor: async id => dispatch(await getSensorLS(id)),
// 	getDeviceType: async id => dispatch(await getDeviceTypeLS(id)),
// 	unassignSensor: () => dispatch(unassignSensor())
// })


const EditDataSource = props => {
	//Hooks
	const t = useLocalization()
	const dispatch = useDispatch()
	//Redux
	const g = useSelector(s => s.dsSystem.eGraph)
	const sensor = useSelector(s => s.data.sensor)
	const cfs = useSelector(s => [...s.data.functions, { id: -1, name: t('no.cloudfunction') }])
	const deviceType = useSelector(s => s.data.deviceType)



	//Const
	const { getSensor, getDeviceType } = props

	//useCallbacks

	//useEffects

	//Handlers


	const handleEditGraph = (newG) => {
		dispatch(editGraph(newG))
	}



	switch (g.type) {
		case 0:
			return <ESChart
				handleEditGraph={handleEditGraph}
				getSensor={getSensor}
				sensor={sensor}
				g={g}
				cfs={cfs}
			/>
		case 6:
			return <ESMSChart
				handleEditGraph={handleEditGraph}
				getSensor={getSensor}
				getDeviceType={getDeviceType}
				sensor={sensor}
				deviceType={deviceType}
				g={g}
				cfs={cfs}
			/>
		case 1:
			return <ESGauge
				handleEditGraph={handleEditGraph}
				getSensor={getSensor}
				sensor={sensor}
				g={g}
				cfs={cfs}
			/>
		case 2:
			return <ESScorecardAB
				handleEditGraph={handleEditGraph}
				getSensor={getSensor}
				sensor={sensor}
				g={g}
				cfs={cfs}
			/>
		case 3:
			return <ESScorecard
				handleEditGraph={handleEditGraph}
				getSensor={getSensor}
				sensor={sensor}
				g={g}
				cfs={cfs}
			/>
		case 4:
			return <ItemG>WindCard</ItemG>
		case 5:
			return <ESMap
				handleEditGraph={handleEditGraph}
				getSensor={getSensor}
				sensor={sensor}
				g={g}
				cfs={cfs}
			/>
		default:
			break;
	}
}


export default EditDataSource
