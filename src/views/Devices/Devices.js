import React, { Component, Fragment } from 'react'
import { getAllDevices, getDevice } from 'variables/dataDevices';
import { withStyles, Paper, Dialog, DialogTitle, DialogContent,
	DialogContentText, DialogActions, Button, IconButton, Menu, MenuItem } from "@material-ui/core";
import { Switch, Route, Redirect } from 'react-router-dom'
import projectStyles from 'assets/jss/views/projects';
import DeviceTable from 'components/Devices/DeviceTable';
import CircularLoader from 'components/Loader/CircularLoader';
import { Maps } from 'components/Map/Maps';
import GridContainer from 'components/Grid/GridContainer';
import { ViewList, ViewModule, Map, Add, FilterList, Build, Business, DataUsage, Edit, LayersClear } from 'variables/icons'
import Toolbar from 'components/Toolbar/Toolbar'
import { filterItems, handleRequestSort } from 'variables/functions';
import DeviceCard from 'components/Devices/DeviceCard'
import { boxShadow } from "assets/jss/material-dashboard-react";
import { unassignDeviceFromCollection } from 'variables/dataCollections';
import { Info, AssignDC, AssignOrg } from 'components';
import TableToolbar from 'components/Table/TableToolbar';
import { connect } from 'react-redux'

class Devices extends Component {
	constructor(props) {
		super(props)

		this.state = {
			devices: null,
			selected: [],
			openAssignCollection: false,
			openAssignOrg: false,
			openUnassign: false,
			deviceHeaders: [],
			loading: true,
			anchorElMenu: null,
			route: 0,
			order: 'desc',
			orderBy: 'id',
			filters: {
				keyword: '',
				startDate: null,
				endDate: null,
				activeDateFilter: false
			}
		}
		props.setHeader("devices.pageTitle", false, '', "devices")
	}
	tabs = [
		{ id: 0, title: this.props.t("devices.tabs.listView"), label: <ViewList />, url: `${this.props.match.path}/list` },
		{ id: 1, title: this.props.t("devices.tabs.mapView"), label: <Map />, url: `${this.props.match.path}/map` },
		{ id: 2, title: this.props.t("devices.tabs.cardView"), label: <ViewModule />, url: `${this.props.match.path}/grid` },
	]

	options = () => {
		const { t, accessLevel } = this.props
		if (accessLevel.apisuperuser)
			return [
				{ label: t("menus.edit"), func: this.handleDeviceEdit, single: true, icon: Edit },
				{ label: t("menus.assignCollection"), func: this.handleOpenAssignCollection, single: true, icon: DataUsage },
				{ label: t("menus.assignOrg"), func: this.handleOpenAssignOrg, single: false, icon: Business },
				{ label: t("menus.unassignCollection"), func: this.handleOpenUnassignDialog, single: false, icon: LayersClear },
				{ label: t("menus.calibrate"), func: this.handleCalibrateFlow, single: true, icon: Build },
				// { label: t("menus.delete"), func: this.handleDeleteProjects, single: false, icon: Delete }, 
			]
		else {
			return [
				{ label: t("menus.exportPDF"), func: () => { }, single: false }
			]
		}
	}
	snackBarMessages = (msg) => {
		const { s, t } = this.props
		switch (msg) {
			case 1: 
				s("snackbars.assignDevice", { device: "", what: t("collections.fields.id") })
				break
			case 2:
				s("snackbars.assignDevice", { device: "", what: t("orgs.fields.org") })
				break
			case 3: 
				s("snackbars.unassignDevice", {
					device: "",
					what: t("collections.fields.id")
				})
				break
			default:
				break;
		}
	}
	componentDidMount = async () => {
		this._isMounted = 1
		await this.getDevices()
		// No more bullcrap
		// this.liveStatus = setInterval(this.getDevices, 10000);
		if (this.props.location.pathname.includes('/map'))
			this.setState({ route: 1 })
		else {
			if (this.props.location.pathname.includes('/grid'))
				this.setState({ route: 2 })
			else {
				this.setState({ route: 0 })
			}
		}
	}

	componentDidUpdate = (prevProps, prevState) => {
		if (this.props.location.pathname !== prevProps.location.pathname) {
			if (this.props.location.pathname.includes('/map'))
				this.setState({ route: 1 })
			else {
				if (this.props.location.pathname.includes('/grid'))
					this.setState({ route: 2 })
				else {
					this.setState({ route: 0 })
				}
			}
		}
	}

	filterItems = (data) => {
		return filterItems(data, this.state.filters)
	}

	getDevices = async () => {
		const { t } = this.props
		await getAllDevices().then(rs => this._isMounted ? this.setState({
			devices: rs ? rs : [],
			deviceHeaders: [
				{ id: "name", label: t("devices.fields.name") },
				{ id: "id", label: t("devices.fields.id") },
				{ id: "liveStatus", label: t("devices.fields.status") },
				{ id: "address", label: t("devices.fields.address") },
				{ id: "org.name", label: t("devices.fields.org") },
				{ id: "project.id", label: t("devices.fields.availability") }
			],
			loading: false
		}, () => this.handleRequestSort(null, "id", "asc")) : null)
	}

	componentWillUnmount = () => {
		this._isMounted = 0
	}

	//region Handlers

	handleCalibrateFlow = () => {
		this.props.history.push(`/device/${this.state.selected[0]}/setup`)
	}

	handleDeviceEdit = () => {
		const { selected } = this.state
		this.props.history.push({
			pathname: `/device/${selected[0]}/edit`,
			prevURL: '/devices/list'
		})
	}

	handleToolbarMenuOpen = e => {
		e.stopPropagation()
		this.setState({ anchorElMenu: e.currentTarget });
	}

	handleToolbarMenuClose = e => {
		e.stopPropagation();
		this.setState({ anchorElMenu: null })
	}

	handleFilterStartDate = (value) => {
		this.setState({
			filters: {
				...this.state.filters,
				startDate: value,
				activeDateFilter: value !== null ? true : false
			}
		})
	}

	handleOpenAssignOrg = () => {
		this.setState({ openAssignOrg: true, anchorElMenu: null })
	}

	handleCloseAssignOrg = async reload => {
		if (reload) {
			this.setState({ loading: true, openAssignOrg: false })
			await this.getDevices().then(rs => {
				this.snackBarMessages(2)
			})
		}
		else { this.setState({ openAssignOrg: false  })}
	}

	handleOpenAssignCollection = () => {
		this.setState({ openAssignCollection: true, anchorElMenu: null  })
	}

	handleCloseAssignCollection = async reload => {
		if (reload) {
			this.setState({ loading: true, openAssignCollection: false })
			await this.getDevices().then(rs => {
				this.snackBarMessages(1)
			})
		}
		else { this.setState({ openAssignCollection: false,  }) }

	}

	handleFilterEndDate = (value) => {
		this.setState({
			filters: {
				...this.state.filters,
				endDate: value,
				activeDateFilter: value !== null ? true : false
			}
		})
	}

	handleFilterKeyword = (value) => {
		this.setState({
			filters: {
				...this.state.filters,
				keyword: value
			}
		})
	}

	handleSelectAllClick = (event, checked) => {
		if (checked) {
			this.setState({ selected: this.state.devices.map(n => n.id) });
			return;
		}
		this.setState({ selected: [] });
	};

	handleClick = (event, id) => {
		event.stopPropagation()
		const { selected } = this.state;
		const selectedIndex = selected.indexOf(id);
		let newSelected = [];

		if (selectedIndex === -1) {
			newSelected = newSelected.concat(selected, id);
		} else if (selectedIndex === 0) {
			newSelected = newSelected.concat(selected.slice(1));
		} else if (selectedIndex === selected.length - 1) {
			newSelected = newSelected.concat(selected.slice(0, -1));
		} else if (selectedIndex > 0) {
			newSelected = newSelected.concat(
				selected.slice(0, selectedIndex),
				selected.slice(selectedIndex + 1),
			);
		}

		this.setState({ selected: newSelected });
	};

	handleUnassignDevices = async () => {
		// const { data } = this.props
		const { selected } = this.state
		let devices = []
		devices = await Promise.all(selected.map(s => getDevice(s))).then(rs => rs)
		await Promise.all(devices.map(d => unassignDeviceFromCollection({
			id: d.dataCollection,
			deviceId: d.id
		}))).then(() => this.handleCloseUnassignDialog)
	}

	handleOpenUnassignDialog = () => {
		this.setState({ openUnassign: true, anchorElMenu: null })
	}

	handleCloseUnassignDialog = async () => {
		this.setState({ openUnassign: false })
		await this.getData().then(() => {
			this.snackBarMessages(3)
		})
	}

	handleRequestSort = (event, property, way) => {
		let order = way ? way : this.state.order === 'desc' ? 'asc' : 'desc'
		let newData = handleRequestSort(property, order, this.state.devices)
		this.setState({ devices: newData, order, orderBy: property })
	}

	//endregion

	renderConfirmUnassign = () => {
		const { openUnassign, selected, devices } = this.state
		const { t } = this.props
		return <Dialog
			open={openUnassign}
			onClose={this.handleCloseUnassignDialog}
			aria-labelledby="alert-dialog-title"
			aria-describedby="alert-dialog-description"
		>
			<DialogTitle id="alert-dialog-title">{t("devices.confirmUnassignTitle")}</DialogTitle>
			<DialogContent>
				<DialogContentText id="alert-dialog-description">
					{t("devices.confirmUnassignMessage")}
				</DialogContentText>
				<div>
					{selected.map(s => {
						let device = devices[devices.findIndex(d => d.id === s)]
						return <Info key={s}>&bull;{`${device.id} ${device.name}`}</Info>
					})
					}
				</div>
			</DialogContent>
			<DialogActions>
				<Button onClick={this.handleCloseUnassignDialog} color="primary">
					{t("actions.no")}
				</Button>
				<Button onClick={this.handleUnassignDevices} color="primary" autoFocus>
					{t("actions.yes")}
				</Button>
			</DialogActions>
		</Dialog>
	}
	renderLoader = () => {
		// const { classes } = this.props

		return <CircularLoader />
	}
	renderTableToolBarContent = () => {
		const { classes, t } = this.props
		const { anchorFilterMenu, deviceHeaders } = this.state
		return <Fragment>
			<IconButton aria-label="Add new organisation" onClick={this.addNewOrg}>
				<Add />
			</IconButton>
			<IconButton
				className={classes.secondAction}
				aria-label={t("tables.filter")}
				aria-owns={anchorFilterMenu ? "filter-menu" : null}
				onClick={this.handleFilterMenuOpen}>
				<FilterList />
			</IconButton>
			<Menu
				id="filter-menu"
				anchorEl={anchorFilterMenu}
				open={Boolean(anchorFilterMenu)}
				onClose={this.handleFilterMenuClose}
				PaperProps={{ style: { width: 200, boxShadow: boxShadow } }}>

				{deviceHeaders.map(option => {
					return <MenuItem key={option.id} onClick={this.handleFilter}>
						{option.label}
					</MenuItem>
				})}
			</Menu>
		</Fragment>
	}
	renderList = () => {
		const { t, classes } = this.props
		const { devices, deviceHeaders, loading, order, orderBy, selected, filters,
			openAssignCollection, openAssignOrg } = this.state
		return loading ? this.renderLoader() : <GridContainer justify={'center'}>
			<Paper className={classes.root}>
				<AssignDC
					deviceId={selected[0] ? selected[0] : 0}
					open={openAssignCollection}
					handleClose={this.handleCloseAssignCollection}
					handleCancel={this.handleCancelAssign}
					t={this.props.t}
				/>
				<AssignOrg
					devices
					open={openAssignOrg}
					handleClose={this.handleCloseAssignOrg}
					deviceId={selected.map(s => devices[devices.findIndex(d => d.id === s)])}
					t={t} />
				{this.renderConfirmUnassign()}
				<TableToolbar
					// ft={this.ft()}
					anchorElMenu={this.state.anchorElMenu}
					handleToolbarMenuClose={this.handleToolbarMenuClose}
					handleToolbarMenuOpen={this.handleToolbarMenuOpen}
					numSelected={selected.length}
					options={this.options}
					t={t}
					content={this.renderTableToolBarContent()}
				/>
				<DeviceTable
					handleOpenAssignCollection={this.handleOpenAssignCollection}
					handleOpenAssignOrg={this.handleOpenAssignOrg}
					handleOpenUnassignDialog={this.handleOpenUnassignDialog}
					selected={selected}
					filter={this.filter}
					data={this.filterItems(devices)}
					handleSelectAllClick={this.handleSelectAllClick}
					tableHead={deviceHeaders}
					handleFilterEndDate={this.handleFilterEndDate}
					handleFilterKeyword={this.handleFilterKeyword}
					handleFilterStartDate={this.handleFilterStartDate}
					handleRequestSort={this.handleRequestSort}
					handleClick={this.handleClick}
					order={order}
					orderBy={orderBy}
					filters={filters}
					deleteProjects={this.deleteProjects}
					t={t}
				/>
			</Paper>
		</GridContainer>
	}
	renderCards = () => {
		const { loading } = this.state
		return loading ? this.renderLoader() : <GridContainer container justify={ 'center' }>
			{ this.filterItems(this.state.devices).map((d, k) => {
				return <DeviceCard key={k} t={ this.props.t } d={ d } />
			}) }
		</GridContainer>
	}
	renderMap = () => {
		const { devices, loading } = this.state
		const { classes } = this.props
		return loading ? <CircularLoader /> : <GridContainer container justify={ 'center' } >
			<Paper className={ classes.paper }>
				<Maps t={ this.props.t } isMarkerShown centerDenmark markers={ this.filterItems(devices) } /* zoom={10} */ />
			</Paper>
		</GridContainer>
	}

	render () {
		const { devices, filters } = this.state
		return (
			<Fragment>
				<Toolbar
					data={ devices }
					filters={ filters }
					history={ this.props.history }
					match={ this.props.match }
					handleFilterKeyword={ this.handleFilterKeyword }
					tabs={ this.tabs }
				/>
				<Switch>
					<Route path={ `${this.props.match.path}/map` } render={ () => this.renderMap() } />
					<Route path={ `${this.props.match.path}/list` } render={ () => this.renderList() } />
					<Route path={ `${this.props.match.path}/grid` } render={ () => this.renderCards() } />
					<Redirect path={ `${this.props.match.path}` } to={ `${this.props.match.path}/list` } />
				</Switch>
			</Fragment>
		)
	}
}
const mapStateToProps = (state) => ({
	accessLevel: state.settings.user.privileges
})

const mapDispatchToProps = {
  
}

export default connect(mapStateToProps, mapDispatchToProps)(withStyles(projectStyles)(Devices))