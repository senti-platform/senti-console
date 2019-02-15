import { Button, DialogActions, DialogContentText, DialogContent, Dialog, DialogTitle, withStyles } from '@material-ui/core'
import { ItemGrid, GridContainer, CircularLoader } from 'components'
import React, { Component, Fragment } from 'react'
import { getProject, deleteProject } from 'variables/dataProjects'
import ProjectData from './ProjectCards/ProjectData'
import ProjectDetails from './ProjectCards/ProjectDetails'
import ProjectCollections from './ProjectCards/ProjectCollections'
import { ProjectContact } from './ProjectCards/ProjectContact'
import AssignDCs from 'components/AssignComponents/AssignDCs';
import { colors } from 'variables/colors';
import ProjectMap from './ProjectCards/ProjectMap';
import deviceStyles from 'assets/jss/views/deviceStyles';
import { getDataSummary } from 'variables/dataCollections';
import { getWifiDaily, getWifiMinutely, getWifiHourly, setMinutelyData, setHourlyData, setDailyData, setSummaryData, getWifiSummary } from 'components/Charts/DataModel';
import moment from 'moment'
import Toolbar from 'components/Toolbar/Toolbar';
import { Timeline, Map, DataUsage, Person, LibraryBooks } from 'variables/icons';
import { compose } from 'recompose';
import { finishedSaving, removeFromFav, addToFav, isFav } from 'redux/favorites';
import { connect } from 'react-redux'
import ProjectDataPanel from './ProjectCards/ProjectDataPanel';

class Project extends Component {
	constructor(props) {
		super(props)

		this.state = {
			raw: props.rawData ? props.rawData : false,
			project: {},
			heatData: [],
			openAssignDC: false,
			loading: true,
			openSnackbar: 0,
			openDelete: false,
			hoverID: 0,
			data: []
		}
		let prevURL = props.location.prevURL ? props.location.prevURL : '/projects/list'
		props.setHeader('collections.fields.project', true, prevURL, 'projects')

	}
	format = 'YYYY-MM-DD+HH:mm'
	tabs = [
		{ id: 0, title: '', label: <LibraryBooks />, url: `#details` },
		{ id: 1, title: '', label: <Timeline />, url: `#data` },
		{ id: 2, title: '', label: <DataUsage />, url: `#collections` },
		{ id: 3, title: '', label: <Map />, url: `#map` },
		{ id: 4, title: '', label: <Person />, url: `#contact` }
	]
	componentDidMount = async () => {
		const { history, match/* , location */ } = this.props

		if (match)
			if (match.params.id) {
				await this.getProject(match.params.id)

			}
			else {
				history.push({
					pathname: '/404',
					prevURL: window.location.pathname
				})
			}
	}
	componentDidUpdate = (prevProps) => {
		if (this.props.id !== prevProps.id || this.props.to !== prevProps.to || this.props.timeType !== prevProps.timeType || this.props.from !== prevProps.from) {
			// this.handleSwitchDayHourSummary()
			this.getHeatMapData()
		}
		if (this.props.saved === true) {
			const { project } = this.state
			if (this.props.isFav({ id: project.id, type: 'project' })) {
				this.props.s('snackbars.favorite.saved', { name: project.title, type: this.props.t('favorites.types.project') })
				this.props.finishedSaving()
			}
			if (!this.props.isFav({ id: project.id, type: 'project' })) {
				this.props.s('snackbars.favorite.removed', { name: project.title, type: this.props.t('favorites.types.project') })
				this.props.finishedSaving()
			}
		}
		if (prevProps.periods.length < this.props.periods.length) {
			let el = document.getElementById(this.props.periods.length - 1)
			setTimeout(() => {
				let topOfElement = el.offsetTop - 130
				window.scroll({ top: topOfElement, behavior: 'smooth' })
			}, 300);
		}
	}
	getProject = async id => {
		const { history } = this.props

		await getProject(id).then(async rs => {
			if (rs === null)
				history.push({
					pathname: '/404',
					prevURL: window.location.pathname
				})
			else {
				this.setState({
					project: {
						...rs,
						dataCollections: rs.dataCollections.map((dc, i) => ({ ...dc, color: colors[i] })),
						devices: rs.dataCollections.filter(dc => dc.activeDevice ? true : false).map((dc, i) => dc.activeDevice ? { ...dc.activeDevice, color: colors[i] } : null)
					}, loading: false
				})
			}
		})
	}
	getWifiHourly = async (p) => {
		const { raw, project, hoverID } = this.state
		let dcs = project.dataCollections.map(d => {
			return {
				dcId: d.id,
				dcName: d.name,
				project: project ? project.title : "",
				org: d.org ? d.org.name : "",
				name: d.name,
				id: d.id,
				color: d.color,
				lat: d.activeDevice ? d.activeDevice.lat : 0,
				long: d.activeDevice ? d.activeDevice.long : 0
			}
		})
		let newState = await getWifiHourly('collection', dcs, p.from, p.to, hoverID, raw)
		return newState
	}
	getWifiMinutely = async (p) => {
		const { raw, project, hoverID } = this.state
		// this.setState({ loadingData: true })
		let dcs = project.dataCollections.map(d => {
			return {
				dcId: d.id,
				dcName: d.name,
				project: project ? project.title : "",
				org: d.org ? d.org.name : "",
				name: d.name,
				id: d.id,
				color: d.color,
				lat: d.activeDevice ? d.activeDevice.lat : 0,
				long: d.activeDevice ? d.activeDevice.long : 0
			}
		})
		let newState = await getWifiMinutely('collection', dcs, p.from, p.to, hoverID, raw)
		return newState
	}

	getWifiDaily = async (p) => {
		const { raw, project, hoverID } = this.state
		let dcs = project.dataCollections.map(d => {
			return {
				dcId: d.id,
				dcName: d.name,
				project: project ? project.title : "",
				org: d.org ? d.org.name : "",
				name: d.name,
				id: d.id,
				color: d.color,
				lat: d.activeDevice ? d.activeDevice.lat : 0,
				long: d.activeDevice ? d.activeDevice.long : 0
			}
		})
		let newState = await getWifiDaily('collection', dcs, p.from, p.to, hoverID, raw)
		return newState
	}
	getWifiSummary = async () => {
		const { raw, project, hoverID } = this.state
		const { from, to } = this.props
		let dcs = project.dataCollections.map(d => {
			return {
				dcId: d.id,
				dcName: d.name,
				project: project ? project.title : "",
				org: d.org ? d.org.name : "",
				name: d.name,
				id: d.id,
				color: d.color,
				lat: d.activeDevice ? d.activeDevice.lat : 0,
				long: d.activeDevice ? d.activeDevice.long : 0
			}
		})
		let newState = await getWifiSummary('collection', dcs, from, to, hoverID, raw)
		return newState
	}
	getHeatMapData = async () => {
		const { project, raw } = this.state
		const { from, to } = this.props
		let startDate = moment(from).format(this.format)
		let endDate = moment(to).format(this.format)
		let dataArr = []
		await Promise.all(project.dataCollections.map(async d => {
			let dataSet = null
			let data = await getDataSummary(d.id, startDate, endDate, raw)
			dataSet = {
				name: d.name,
				id: d.activeDevice ? d.activeDevice.id : 0,
				data: data,
				color: d.color,
				liveStatus: d.activeDevice ? d.activeDevice.liveStatus : 0,
				lat: d.activeDevice ? d.activeDevice.lat : 0,
				long: d.activeDevice ? d.activeDevice.long : 0
			}
			return dataArr.push(dataSet)
		}))
		dataArr = dataArr.reduce((newArr, d) => {
			if (d.data !== null)
				newArr.push(d)
			return newArr
		}, [])
		this.setState({
			heatData: dataArr,
			loadingMap: false
		})
	}

	handleSwitchDayHourSummary = async (p) => {
		let diff = moment.duration(p.to.diff(p.from)).days()
		switch (p.menuId) {
			case 0:// Today
			case 1:// Yesterday
				return await this.getWifiHourly(p);

			case 2:// This week
				return parseInt(diff, 10) > 0 ? this.getWifiDaily(p) : this.getWifiHourly(p)

			case 3:// Last 7 days
			case 4:// 30 days
			case 5:// 90 Days
				return await this.getWifiDaily(p);

			case 6:
				return await this.handleSetCustomRange()

			default:
				return await this.getWifiDaily(p);

		}
	}

	handleSetCustomRange = () => {
		const { timeType } = this.props
		switch (timeType) {
			case 0:
				this.getWifiMinutely()
				break;
			case 1:
				this.getWifiHourly()
				break
			case 2:
				this.getWifiDaily()
				break
			case 3:
				this.getWifiSummary()
				break
			default:
				break;
		}
	}

	snackBarMessages = (msg) => {
		const { s } = this.props
		switch (msg) {
			case 1:
				s('snackbars.projectDeleted')
				break
			case 2:
				s('snackbars.projectExported')
				break
			case 3:
				s('snackbars.assign.collectionsToProject')
				break
			default:
				break
		}
	}

	handleDeleteProject = async () => {
		if (this.props.isFav(this.state.project.id))
			this.removeFromFav()
		await deleteProject([this.state.project.id]).then(() => {
			this.setState({ openDelete: false })
			this.snackBarMessages(1)
			this.props.history.push('/projects/list')
		})
	}
	reload = () => {
		this.componentDidMount()
	}
	handleCloseAssignCollection = async (reload) => {
		if (reload) {
			this.setState({ loading: true, openAssignDC: false })
			await this.componentDidMount().then(() => {
				this.snackBarMessages(3)
			})
		}
		else {
			this.setState({ openAssignDC: false })
		}
	}

	handleOpenAssignCollection = () => {
		this.setState({ openAssignDC: true, anchorElMenu: null })
	}

	handleOpenDeleteDialog = () => {
		this.setState({ openDelete: true })
	}

	handleCloseDeleteDialog = () => {
		this.setState({ openDelete: false })
	}

	handleRawData = () => {
		this.setState({ loadingData: true, raw: !this.state.raw }, () => this.handleSwitchDayHourSummary())
	}

	addToFav = () => {
		const { project } = this.state
		let favObj = {
			id: project.id,
			name: project.title,
			type: 'project',
			path: this.props.match.url
		}
		this.props.addToFav(favObj)
	}

	removeFromFav = () => {
		const { project } = this.state
		let favObj = {
			id: project.id,
			name: project.title,
			type: 'project',
			path: this.props.match.url
		}
		this.props.removeFromFav(favObj)
	}

	setHoverID = (id) => {
		if (id !== this.state.hoverID) {
			this.setState({ hoverID: id }, () => this.hoverGrow())
		}

	}
	hoverGrow = () => {
		const { dataArr, hoverID } = this.state
		const { timeType, to, from } = this.props
		if (dataArr)
			if (dataArr.findIndex(dc => dc.id === hoverID) !== -1 || hoverID === 0) {
				let newState = {}
				switch (timeType) {
					case 0:
						newState = setMinutelyData(dataArr, from, to, hoverID)
						break;
					case 1:
						newState = setHourlyData(dataArr, from, to, hoverID)
						break
					case 2:
						newState = setDailyData(dataArr, from, to, hoverID)
						break
					case 3:
						newState = setSummaryData(dataArr, from, to, hoverID)
						break
					default:
						break;
				}
				this.setState({
					...newState
				})
			}

	}
	renderDeleteDialog = () => {
		const { openDelete } = this.state
		const { t } = this.props
		return <Dialog
			open={openDelete}
			onClose={this.handleCloseDeleteDialog}
			aria-labelledby='alert-dialog-title'
			aria-describedby='alert-dialog-description'
		>
			<DialogTitle id='alert-dialog-title'>{t('dialogs.delete.title.project')}</DialogTitle>
			<DialogContent>
				<DialogContentText id='alert-dialog-description'>
					{t('dialogs.delete.message.project', { project: this.state.project.title }) + '?'}
				</DialogContentText>

			</DialogContent>
			<DialogActions>
				<Button onClick={this.handleCloseDeleteDialog} color='primary'>
					{t('actions.cancel')}
				</Button>
				<Button onClick={this.handleDeleteProject} color='primary' autoFocus>
					{t('actions.yes')}
				</Button>
			</DialogActions>
		</Dialog>
	}

	renderLoader = () => {
		return <CircularLoader />
	}



	render() {
		const { project, loading, openAssignDC } = this.state
		const { t, classes } = this.props
		const rp = { history: this.props.history, match: this.props.match }
		return (
			<Fragment>
				<Toolbar
					noSearch
					history={rp.history}
					match={rp.match}
					tabs={this.tabs}
				/>
				{!loading ?
					<GridContainer justify={'center'} alignContent={'space-between'}>
						<ItemGrid xs={12} noMargin id='details'>
							<ProjectDetails
								isFav={this.props.isFav({ id: project.id, type: 'project' })}
								addToFav={this.addToFav}
								removeFromFav={this.removeFromFav}
								t={t}
								project={project} {...rp}
								deleteProject={this.handleOpenDeleteDialog}
								handleOpenAssignCollection={this.handleOpenAssignCollection}
							/>
						</ItemGrid>

						<ItemGrid xs={12} noMargin id={'data'}>
							<ProjectDataPanel
								t={t}
							/>
						</ItemGrid>
						{this.state.data ? this.props.periods.map((period, i) => {
							return <ItemGrid xs={i === this.props.periods.length - 1 ? i % 2 === 0 ? 12 : 6 : 6} noMargin key={i} id={i}>
								<ProjectData
									period={period}
									getData={this.handleSwitchDayHourSummary}
									setHoverID={this.setHoverID}
									project={project}
									{...rp}
									t={this.props.t}
								/>
							</ItemGrid>
						}) : null
						}

						<ItemGrid xs={12} noMargin id='collections'>
							<ProjectCollections
								setHoverID={this.setHoverID}
								t={t}
								project={project}
								{...rp} />
						</ItemGrid >
						{project.devices ? <ItemGrid xs={12} noMargin id='map'>
							<ProjectMap
								mapTheme={this.props.mapTheme}
								devices={this.state.project.devices}
								heatData={this.state.heatData}
								t={t}
							/>
						</ItemGrid> : null
						}
						<ItemGrid xs={12} noMargin id='contact' >
							<ProjectContact
								reload={this.reload}
								classes={classes}
								history={this.props.history}
								t={t}
								project={project} />
						</ItemGrid>
						{this.renderDeleteDialog()}
						<AssignDCs
							open={openAssignDC}
							handleClose={this.handleCloseAssignCollection}
							project={project.id}
							t={t}
						/>
					</GridContainer>
					: this.renderLoader()}
			</Fragment>
		)
	}
}
const mapStateToProps = (state) => ({
	accessLevel: state.settings.user.privileges,
	language: state.settings.language,
	saved: state.favorites.saved,
	rawData: state.settings.rawData,
	mapTheme: state.settings.mapTheme,
	id: state.dateTime.id,
	to: state.dateTime.to,
	from: state.dateTime.from,
	timeType: state.dateTime.timeType,
	periods: state.dateTime.periods
})

const mapDispatchToProps = (dispatch) => ({
	isFav: (favObj) => dispatch(isFav(favObj)),
	addToFav: (favObj) => dispatch(addToFav(favObj)),
	removeFromFav: (favObj) => dispatch(removeFromFav(favObj)),
	finishedSaving: () => dispatch(finishedSaving())
})

const ProjectComposed = compose(connect(mapStateToProps, mapDispatchToProps), withStyles(deviceStyles))(Project)

export default ProjectComposed