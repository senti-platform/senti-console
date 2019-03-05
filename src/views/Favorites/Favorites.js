import React, { Component, Fragment } from 'react'
import { Route, Switch, Redirect } from 'react-router-dom'
import { connect } from 'react-redux'
// import Toolbar from 'components/Toolbar/Toolbar'
import { ViewList, StarBorder } from 'variables/icons'
import TableToolbar from 'components/Table/TableToolbar'
import FavoritesTable from 'components/Favorites/FavoritesTable'
import { GridContainer, CircularLoader } from 'components'
import { Paper, withStyles } from '@material-ui/core'
import projectStyles from 'assets/jss/views/projects'
import { filterItems, handleRequestSort } from 'variables/functions'
import { finishedSaving, removeFromFav, addToFav, isFav } from 'redux/favorites'
import { LibraryBooks, DeviceHub, Person, Business, DataUsage } from 'variables/icons';
import { customFilterItems } from 'variables/Filters';

class Favorites extends Component {
	constructor(props) {
		super(props)

		this.state = {
			selected: [],
			order: 'asc',
			orderBy: 'name',
			route: 0,
			filters: {
				keyword: '',
			}
		}
		props.setBC('favorites')
		props.setHeader('sidebar.favorites', false, '', 'favorites')
		props.setTabs({
			id: 'favorits',
			tabs: this.tabs(),
			route: 0
		})
	}
	options = () => {
		const { t } = this.props
		return [
			{ label: t('menus.favorites.remove'), icon: StarBorder, func: this.removeFromFavs }
		]
	}
	removeFromFavs = () => { 
		const { selected } = this.state
		const { favorites } = this.props
		selected.forEach(f => {
			let fav = favorites[favorites.findIndex(fe => fe.id === f)]
			this.props.removeFromFav(fav)
		})
		this.setState({ anchorElMenu: null })
	}
	favoritesHeaders = () => { 
		const { t } = this.props
		return [
			{ id: 'type', label: '' },
			{ id: 'name', label: t('favorites.fields.name') },
			{ id: 'type', label: t('favorites.fields.type') }
		]
	}
	tabs = () => {
		return [{ id: 0, title: this.props.t('devices.tabs.listView'), label: <ViewList />, url: `${this.props.match.path}/list` }]
	}
	dTypes = () => { 
		const { t } = this.props
		return [
			{ value: 'project', label: t('favorites.types.project'), icon: <LibraryBooks/> },
			{ value: 'collection', label: t('favorites.types.collection'), icon: <DataUsage/> },
			{ value: 'device', label: t('favorites.types.device'), icon: <DeviceHub/> },
			{ value: 'user', label: t('favorites.types.user'), icon: <Person/> },
			{ value: 'org', label: t('favorites.types.org'), icon: <Business/> },
		]
	}
	ft = () => {
		const { t } = this.props
		return [
			{ key: 'name', name: t('favorites.fields.name'), type: 'string' },
			{ key: 'type', name: t('favorites.fields.type'), type: 'dropDown', options: this.dTypes() },
			{ key: '', name: t('filters.freeText'), type: 'string', hidden: true },
		]
	}
	addFilter = (f) => {
		let cFilters = this.state.filters.custom
		let id = cFilters.length
		cFilters.push({ ...f, id: id })
		this.setState({
			filters: {
				...this.state.filters,
				custom: cFilters
			}
		})
		return id
	}
	editFilter = (f) => {
		let cFilters = this.state.filters.custom
		let filterIndex = cFilters.findIndex(fi => fi.id === f.id)
		cFilters[filterIndex] = f
		this.setState({
			filters: {
				...this.state.filters,
				custom: cFilters
			}
		})
	}
	removeFilter = (fId) => {
		let cFilters = this.state.filters.custom
		cFilters = cFilters.reduce((newFilters, f) => {
			if (f.id !== fId) {
				newFilters.push(f)
			}
			return newFilters
		}, [])
		this.setState({
			filters: {
				...this.state.filters,
				custom: cFilters
			}
		})
	}
	filterItems = (data) => {
		const rFilters = this.props.filters
		const { filters } = this.state
		return customFilterItems(filterItems(data, filters), rFilters)
	}
	componentDidMount = () => {
		this.handleRequestSort(null, 'name', 'asc')
	}
	componentDidUpdate = () => {
		if (this.props.saved === true) {
			this.props.s('snackbars.favorite.manyRemoved')
			this.props.finishedSaving()
			this.setState({ selected: [] })
		}
	}
	handleToolbarMenuOpen = e => {
		e.stopPropagation()
		this.setState({ anchorElMenu: e.currentTarget })
	}

	handleToolbarMenuClose = e => {
		e.stopPropagation();
		this.setState({ anchorElMenu: null })
	}
	handleSelectAllClick = (event, checked) => {
		if (checked) {
			this.setState({ selected: this.props.favorites.map(n => n.id) })
			return;
		}
		this.setState({ selected: [] })
	}

	handleRequestSort = (event, property, way) => {
		let order = way ? way : this.state.order === 'desc' ? 'asc' : 'desc'
		if (property !== this.state.orderBy) {
			order = 'asc'
		}
		handleRequestSort(property, order, this.props.favorites)
		this.setState({ order, orderBy: property })
	}

	handleFilterKeyword = (value) => {
		this.setState({
			filters: {
				...this.state.filters,
				keyword: value
			}
		})
	}
	handleCheckboxClick = (event, id) => {
		event.stopPropagation()
		const { selected } = this.state;
		const selectedIndex = selected.indexOf(id)
		let newSelected = [];

		if (selectedIndex === -1) {
			newSelected = newSelected.concat(selected, id);
		} else if (selectedIndex === 0) {
			newSelected = newSelected.concat(selected.slice(1))
		} else if (selectedIndex === selected.length - 1) {
			newSelected = newSelected.concat(selected.slice(0, -1))
		} else if (selectedIndex > 0) {
			newSelected = newSelected.concat(
				selected.slice(0, selectedIndex),
				selected.slice(selectedIndex + 1),
			);
		}

		this.setState({ selected: newSelected })
	}

	handleClick = id => e => {
		e.stopPropagation()
		this.props.history.push({ pathname: id, prevURL: this.props.match.path })
	}
	renderTableToolBar = () => {
		const { t } = this.props
		const { selected } = this.state
		return <TableToolbar
			ft={this.ft()}
			addFilter={this.addFilter}
			editFilter={this.editFilter}
			removeFilter={this.removeFilter}
			reduxKey={'favorites'}
			anchorElMenu={this.state.anchorElMenu}
			handleToolbarMenuClose={this.handleToolbarMenuClose}
			handleToolbarMenuOpen={this.handleToolbarMenuOpen}
			numSelected={selected.length}
			options={this.options}
			t={t}
		/>
	}
	renderTable = () => {
		const { t, favorites } = this.props
		const { selected, orderBy, order } = this.state
		return <FavoritesTable
			selected={selected}
			handleClick={this.handleClick}
			handleCheckboxClick={this.handleCheckboxClick}
			handleSelectAllClick={this.handleSelectAllClick}
			data={this.filterItems(favorites)}
			tableHead={this.favoritesHeaders()}
			handleFilterEndDate={this.handleFilterEndDate}
			handleFilterKeyword={this.handleFilterKeyword}
			handleFilterStartDate={this.handleFilterStartDate}
			handleRequestSort={this.handleRequestSort}
			handleOpenUnassignDevice={this.handleOpenUnassignDevice}
			orderBy={orderBy}
			order={order}
			filters={this.state.filters}
			t={t}
		/>
	}
	renderFavorites = () => {
		const { classes } = this.props
		const { loading } = this.state
		return <GridContainer justify={'center'}>
			{loading ? <CircularLoader /> : <Paper className={classes.root}>
				{this.renderTableToolBar()}
				{this.renderTable()}
				{/* {this.renderConfirmDelete()} */}
			</Paper>
			}
		</GridContainer>
	}
	render() {
		// const { filters, route } = this.state
		// const { favorites } = this.props
		return (
			<Fragment>
				{/* <Toolbar
					data={favorites}
					filters={filters}
					history={this.props.history}
					route={route}
					match={this.props.match}
					handleFilterKeyword={this.handleFilterKeyword}
					tabs={this.tabs()}
				/> */}
				<Switch>
					<Route path={`${this.props.match.path}/list`} render={() => this.renderFavorites()} />
					<Redirect path={`${this.props.match.path}`} to={`${this.props.match.path}/list`} />
				</Switch>
			</Fragment>
		)
	}
}

const mapStateToProps = (state) => ({
	accessLevel: state.settings.user.privileges,
	favorites: state.favorites.favorites,
	saved: state.favorites.saved,
	filters: state.appState.filters.favorites
})

const mapDispatchToProps = (dispatch) => ({
	isFav: (favObj) => dispatch(isFav(favObj)),
	addToFav: (favObj) => dispatch(addToFav(favObj)),
	removeFromFav: (favObj) => dispatch(removeFromFav(favObj)),
	finishedSaving: () => dispatch(finishedSaving())
})

export default connect(mapStateToProps, mapDispatchToProps)(withStyles(projectStyles)(Favorites))