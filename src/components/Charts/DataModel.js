import { dateTimeFormatter, datesToArr, hoursToArr, minutesToArray } from 'variables/functions';
import { teal } from '@material-ui/core/colors'
import moment from 'moment'
import { colors } from 'variables/colors';

export const setSummaryData = (dataArr, from, to) => {
	let displayTo = dateTimeFormatter(to)
	let displayFrom = dateTimeFormatter(from)
	let state = {
		loading: false,
		timeType: 2,
		lineDataSets: null,
		roundDataSets: null,
		barDataSets: null
	}
	if (dataArr.length > 0) {
		 state = {
			title: `${displayFrom} - ${displayTo}`,
			loading: false,
			timeType: 3,
			roundDataSets: {
				labels: Object.entries(dataArr[0].data).map(l => [moment(l[0]).format('ll'), moment(l[0]).format('dddd'), l[1]]),
				datasets: dataArr.map((d) => ({
					id: d.id,
					lat: d.lat,
					long: d.long,
					backgroundColor: Object.entries(d.data).map((d, i) => colors[i]),
					label: [d.name],
					data: Object.entries(d.data).map(d => d[1])
				}))
		
			}
		}
	}
	return state
}
export const setDailyData = (dataArr, from, to, hoverID) => {
	let labels = datesToArr(from, to)
	let state = {
		loading: false,
		timeType: 2,
		lineDataSets: null,
		roundDataSets: null,
		barDataSets: null
	}
	if (dataArr.length > 0) {
		 state = {
			loading: false,
			timeType: 2,
			lineDataSets: {
				labels: labels,
				datasets: dataArr.map((d) => ({
					id: d.id,
					lat: d.lat,
					long: d.long,
					backgroundColor: d.color,
					borderColor: d.color,
					borderWidth: hoverID === d.id ? 8 : 3,
					fill: false,
					label: [d.name],
					data: Object.entries(d.data).map(d => ({ x: d[0], y: d[1] }))
				}))
			},
			barDataSets: {
				labels: labels,
				datasets: dataArr.map((d) => ({
					id: d.id,
					lat: d.lat,
					long: d.long,
					backgroundColor: d.color,
					borderColor: teal[500],
					borderWidth: hoverID === d.id ? 4 : 0,
					fill: false,
					label: [d.name],
					data: Object.entries(d.data).map(d => ({ x: d[0], y: d[1] }))
				}))
			},
			roundDataSets: {
				labels: Object.entries(dataArr[0].data).map(l => [moment(l[0]).format('ll'), moment(l[0]).format('dddd'), l[1]]),
				datasets: dataArr.map((d) => ({
					id: d.id,
					lat: d.lat,
					long: d.long,
					backgroundColor: Object.entries(d.data).map((d, i) => colors[i]),
					label: [d.name],
					data: Object.entries(d.data).map(d => d[1])
				}))

			}	
		}
	}
	return state
}
export const setHourlyData = (dataArr, from, to, hoverID) => {
	let labels = hoursToArr(from, to)
	let state = {
		loading: false,
		timeType: 2,
		lineDataSets: null,
		roundDataSets: null,
		barDataSets: null
	}
	if (dataArr.length > 0) {
		state = {
			loading: false,
			timeType: 1,
			lineDataSets: {
				labels: labels,
				datasets: dataArr.map((d) => ({
					id: d.id,
					lat: d.lat,
					long: d.long,
					backgroundColor: d.color,
					borderColor: d.color,
					borderWidth: hoverID === d.id ? 8 : 3,
					fill: false,
					label: [d.name],
					data: Object.entries(d.data).map(d => ({ x: d[0], y: d[1] }))
				}))
			},
			barDataSets: {
				labels: labels,
				datasets: dataArr.map((d) => ({
					id: d.id,
					lat: d.lat,
					long: d.long,
					backgroundColor: d.color,
					borderColor: d.color,
					borderWidth: hoverID === d.id ? 4 : 0,
					fill: false,
					label: [d.name],
					data: Object.entries(d.data).map(d => ({ x: d[0], y: d[1] }))
				}))
			},
			roundDataSets: {
				labels: Object.entries(dataArr[0].data).map(l => [moment(l[0]).format('HH:mm'), moment(l[0]).format('dddd'), l[1]]),
				datasets: dataArr.map((d, i) => ({
					id: d.id,
					lat: d.lat,
					long: d.long,
					backgroundColor: Object.entries(d.data).map((d, i) => colors[i]),
					fill: false,
					label: [d.name],
					data: Object.entries(d.data).map(d => d[1])
				}))
			},
		}
	}
	return state
}
export const setMinutelyData = (dataArr, from, to, hoverID) => {
	let labels = minutesToArray(from, to)
	let state = {
		loading: false,
		timeType: 2,
		lineDataSets: null,
		roundDataSets: null,
		barDataSets: null
	}
	if (dataArr.length > 0) {
		state = {
			loading: false,
			lineDataSets: {
				labels: labels,
				datasets: dataArr.map((d) => ({
					id: d.id,
					lat: d.lat,
					long: d.long,
					backgroundColor: d.color,
					borderColor: d.color,
					borderWidth: hoverID === d.id ? 8 : 3,
					fill: false,
					label: [d.name],
					data: Object.entries(d.data).map(d => ({ x: d[0], y: d[1] }))
				})),
				barDataSets: {
					labels: labels,
					datasets: dataArr.map((d) => ({
						id: d.id,
						lat: d.lat,
						long: d.long,
						backgroundColor: d.color,
						borderColor: d.color,
						borderWidth: hoverID === d.id ? 4 : 0,
						fill: false,
						label: [d.name],
						data: Object.entries(d.data).map(d => ({ x: d[0], y: d[1] }))
					}))
				},
				roundDataSets: {
					labels: Object.entries(dataArr[0].data).map(l => [moment(l[0]).format('HH:mm'), moment(l[0]).format('dddd'), l[1]]),
					datasets: dataArr.map((d, i) => ({
						id: d.id,
						lat: d.lat,
						long: d.long,
						backgroundColor: Object.entries(d.data).map((d, i) => colors[i]),
						fill: false,
						label: [d.name],
						data: Object.entries(d.data).map(d => d[1])
					}))
				},
			}
		}
	}
	return state
}