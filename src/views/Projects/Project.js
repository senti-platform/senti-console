import { Button, DialogActions, DialogContentText, DialogContent, Dialog, DialogTitle, withStyles, Fade } from '@material-ui/core'
import { ItemGrid, GridContainer, CircularLoader } from 'components'
import React, { Component, Fragment } from 'react'
import { deleteProject } from 'variables/dataProjects'
import ProjectDetails from './ProjectCards/ProjectDetails'
import ProjectCollections from './ProjectCards/ProjectCollections'
import { ProjectContact } from './ProjectCards/ProjectContact'
import AssignDCs from 'components/AssignComponents/AssignDCs';
import deviceStyles from 'assets/jss/views/deviceStyles';
import { getWifiDaily, getWifiMinutely, getWifiHourly, getWifiSummary } from 'components/Charts/DataModel';
import moment from 'moment'
// import Toolbar from 'components/Toolbar/Toolbar';
import { Timeline, Map, DataUsage, Person, LibraryBooks } from 'variables/icons';
import { compose } from 'recompose';
import { finishedSaving, removeFromFav, addToFav, isFav } from 'redux/favorites';
import { connect } from 'react-redux'
import ChartData from 'views/Charts/ChartData';
import ChartDataPanel from 'views/Charts/ChartDataPanel';
import Maps from 'views/Maps/MapCard';
import { scrollToAnchor } from 'variables/functions';
import { getProjectLS } from 'redux/data';

class Project extends Component {
	constructor(props) {
		super(props)

		this.state = {
			heatData: [],
			openAssignDC: false,
			openSnackbar: 0,
			openDelete: false,
			hoverID: 0,
			data: []
		}
		let prevURL = props.location.prevURL ? props.location.prevURL : '/projects/list'
		props.setHeader('collections.fields.project', true, prevURL, 'projects')

	}
	format = 'YYYY-MM-DD+HH:mm'
	tabs = () => {
		const { t } = this.props
		return [
			{ id: 0, title: t('tabs.details'), label: <LibraryBooks />, url: `#details` },
			{ id: 1, title: t('tabs.data'), label: <Timeline />, url: `#data` },
			{ id: 2, title: t('tabs.collections'), label: <DataUsage />, url: `#collections` },
			{ id: 3, title: t('tabs.map'), label: <Map />, url: `#map` },
			{ id: 4, title: t('tabs.contact'), label: <Person />, url: `#contact` }
		]
	}
	componentDidMount = async () => {
		const { history, match/* , location */ } = this.props
		if (match)
			if (match.params.id) {
				await this.getProject(match.params.id).then(() => {
					this.props.setBC('project', this.props.project ? this.props.project.title : '')
				})
				// this.props.getProject(match.params.id)
				this.props.setTabs({
					id: 'project',
					hashLinks: true,
					tabs: this.tabs()
				})
				if (this.props.location.hash !== '') {
					scrollToAnchor(this.props.location.hash)
				}
			}
			else {
				history.push({
					pathname: '/404',
					prevURL: window.location.pathname
				})
			}
	}
	componentDidUpdate = async (prevProps) => {
		if (prevProps.match.params.id !== this.props.match.params.id)
			await this.componentDidMount()
		if (this.props.saved === true) {
			const { project } = this.props
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
		const { getProject } = this.props
		await getProject(id)
	}
	getWifiHourly = async (p) => {
		const { hoverID } = this.state
		const { project } = this.props
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
		let newState = await getWifiHourly('collection', dcs, p.from, p.to, hoverID, p.raw)
		return newState
	}
	getWifiMinutely = async (p) => {
		const { hoverID } = this.state
		const { project } = this.props
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
		let newState = await getWifiMinutely('collection', dcs, p.from, p.to, hoverID, p.raw)
		return newState
	}

	getWifiDaily = async (p) => {
		const { hoverID } = this.state
		const { project } = this.props
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
		let newState = await getWifiDaily('collection', dcs, p.from, p.to, hoverID, p.raw)
		return newState
	}
	getWifiSummary = async (p) => {
		const { hoverID } = this.state
		const { project } = this.props
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
		let newState = await getWifiSummary('collection', dcs, p.from, p.to, hoverID, p.raw)
		return newState
	}

	handleSwitchDayHourSummary = async (p) => {
		let diff = moment.duration(moment(p.to).diff(moment(p.from))).days()
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
				return await this.handleSetCustomRange(p)

			default:
				return await this.getWifiDaily(p);
		}
	}

	handleSetCustomRange = (p) => {
		switch (p.timeType) {
			case 0:
				return this.getWifiMinutely(p)
			case 1:
				return this.getWifiHourly(p)
			case 2:
				return this.getWifiDaily(p)
			case 3:
				return this.getWifiSummary(p)
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
		if (this.props.isFav(this.props.project.id))
			this.removeFromFav()
		await deleteProject([this.props.project.id]).then(() => {
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

	addToFav = () => {
		const { project } = this.props
		let favObj = {
			id: project.id,
			name: project.title,
			type: 'project',
			path: this.props.match.url
		}
		this.props.addToFav(favObj)
	}

	removeFromFav = () => {
		const { project } = this.props
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
			this.setState({ hoverID: id })
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
			<DialogTitle disableTypography id='alert-dialog-title'>{t('dialogs.delete.title.project')}</DialogTitle>
			<DialogContent>
				<DialogContentText id='alert-dialog-description'>
					{t('dialogs.delete.message.project', { project: this.props.project.title }) + '?'}
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


	handleDataSize = (i) => {
		let visiblePeriods = 0
		this.props.periods.forEach(p => p.hide === false ? visiblePeriods += 1 : visiblePeriods)
		if (visiblePeriods === 1)
			return 12
		if (i === this.props.periods.length - 1 && visiblePeriods % 2 !== 0 && visiblePeriods > 2)
			return 12
		return 6
	}
	render() {
		const { openAssignDC, hoverID } = this.state
		const { project, loading } = this.props

		const { t, classes } = this.props
		const rp = { history: this.props.history, match: this.props.match }
		return (
			<Fragment>
				{/* <Toolbar
					hashLinks
					noSearch
					history={rp.history}
					match={rp.match}
					tabs={this.tabs}
				/> */}
				{!loading ?
					<Fade in={true}>
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
								<ChartDataPanel />
							</ItemGrid>
							{this.props.periods.map((period, i) => {
								if (period.hide) { return null }
								return <ItemGrid xs={12} md={this.handleDataSize(i)} noMargin key={i} id={i}>
									<ChartData
										period={period}
										getData={this.handleSwitchDayHourSummary}
										setHoverID={this.setHoverID}
										project={project}
										hoverID={hoverID}
										{...rp}
										t={this.props.t}
									/>
								</ItemGrid>
							})
							}

							<ItemGrid xs={12} noMargin id='collections'>
								<ProjectCollections
									setHoverID={this.setHoverID}
									t={t}
									project={project}
									{...rp} />
							</ItemGrid >
							{project.devices ? <ItemGrid xs={12} noMargin id='map'>
								<Maps
									mapTheme={this.props.mapTheme}
									markers={this.props.project.devices}
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
						</GridContainer></Fade>
					: this.renderLoader()}
			</Fragment>
		)
	}
}
const mapStateToProps = (state) => ({
	accessLevel: state.settings.user.privileges,
	language: state.settings.language,
	saved: state.favorites.saved,
	mapTheme: state.settings.mapTheme,
	periods: state.dateTime.periods,
	project: state.data.project,
	loading: !state.data.gotProject
})

const mapDispatchToProps = (dispatch) => ({
	isFav: (favObj) => dispatch(isFav(favObj)),
	addToFav: (favObj) => dispatch(addToFav(favObj)),
	removeFromFav: (favObj) => dispatch(removeFromFav(favObj)),
	finishedSaving: () => dispatch(finishedSaving()),
	getProject: async (id) => dispatch(await getProjectLS(id))
})

const ProjectComposed = compose(connect(mapStateToProps, mapDispatchToProps), withStyles(deviceStyles))(Project)

export default ProjectComposed