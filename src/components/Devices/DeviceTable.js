import { Checkbox, Hidden, Paper, Table, TableBody, TableCell, TablePagination, TableRow, Typography, withStyles } from "@material-ui/core";
import { SignalWifi2Bar, SignalWifi2BarLock } from '@material-ui/icons';
import devicetableStyles from "assets/jss/components/devices/devicetableStyles";
import PropTypes from "prop-types";
import React from "react";
import { withRouter } from 'react-router-dom';
import AssignProject from "./AssignProject";
import EnhancedTableHead from './DeviceTableHeader';
import EnhancedTableToolbar from './TableToolBar';

class EnhancedTable extends React.Component {
	constructor(props) {
		super(props);

		this.state = {
			order: 'asc',
			orderBy: 'device_id',
			selected: [],
			page: 0,
			rowsPerPage: props.theme.breakpoints.width("md") < window.innerWidth ? 10 : 5,
			anchorElMenu: null,
			anchorFilterMenu: null,
			openAssignProject: false
		};
	}
	options = () => {
		const { t } = this.props
		return [
			{ label: t("menus.edit"), func: this.handleDeviceEdit, single: true },
			{ label: t("menus.assign"), func: this.handleAssignToProject, single: false },
			{ label: t("menus.exportPDF"), func: () => { }, single: false },
			{ label: t("menus.calibrate"), func: this.handleCalibrateFlow, single: true },
			{ label: t("menus.delete"), func: this.handleDeleteProjects, single: false },
		]
	}
	handleDeviceEdit = () => {
		const { selected } = this.state
		this.props.history.push(`/device/${selected[0]}/edit`)
	}
	handleAssignToProject = () => {
		this.setState({ openAssignProject: true })
	}
	handleCloseAssignToProject = reload => {
		this.setState({ openAssignProject: false })
	}
	handleToolbarMenuOpen = e => {
		e.stopPropagation()
		this.setState({ anchorElMenu: e.currentTarget });
	};
	handleToolbarMenuClose = e => {
		e.stopPropagation();
		this.setState({ anchorElMenu: null })
	}
	handleFilterMenuOpen = e => {
		e.stopPropagation()
		this.setState({ anchorFilterMenu: e.currentTarget })
	}
	handleFilterMenuClose = e => {
		e.stopPropagation()
		this.setState({ anchorFilterMenu: null })
	}
	handleFilter = e => {
	}
	handleSearch = value => {
		this.setState({
			searchFilter: value
		})
	}
	handleRequestSort = (event, property) => {
		const orderBy = property;
		let order = 'desc';

		if (this.state.orderBy === property && this.state.order === 'desc') {
			order = 'asc';
		}

		const data =
			order === 'desc'
				? this.props.data.sort((a, b) => (b[orderBy] < a[orderBy] ? -1 : 1))
				: this.props.data.sort((a, b) => (a[orderBy] < b[orderBy] ? -1 : 1));

		this.setState({ data, order, orderBy });
	};

	handleSelectAllClick = (event, checked) => {
		if (checked) {
			this.setState({ selected: this.props.data.map(n => n.device_id) });
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

	handleChangePage = (event, page) => {
		this.setState({ page });
	};

	handleChangeRowsPerPage = event => {
		this.setState({ rowsPerPage: event.target.value });
	};

	isSelected = id => this.state.selected.indexOf(id) !== -1;

	suggestionSlicer = (obj) => {
		var arr = [];

		for (var prop in obj) {
			if (obj.hasOwnProperty(prop)) {
				var innerObj = {};
				if (typeof obj[prop] === 'object') {
					arr.push(...this.suggestionSlicer(obj[prop]))
				}
				else {
					innerObj = {
						id: prop.toString().toLowerCase(),
						label: obj[prop] ? obj[prop].toString() : ''
					};
					arr.push(innerObj)
				}
			}
		}
		return arr;
	}
	suggestionGen = (arrayOfObjs) => {
		let arr = [];
		arrayOfObjs.map(obj => {
			arr.push(...this.suggestionSlicer(obj))
			return ''
		})
		return arr;
	}
	renderIcon = (status) => {
		const { classes, t } = this.props
		switch (status) {
			case 1: 
				return <div title={t("devices.status.yellow")}><SignalWifi2Bar className={classes.yellowSignal}/></div>
			case 2: 
				return <div title={t("devices.status.green")}><SignalWifi2Bar className={classes.greenSignal} /></div>
			case 0:
				return <div title={t("devices.status.red")}><SignalWifi2Bar className={classes.redSignal} /></div>
			case null:
				return <SignalWifi2BarLock className={classes.redSignal} />
			default:
				break;
		}
	}
	render() {
		const { classes, data, t } = this.props;
		const { order, orderBy, selected, rowsPerPage, page, openAssignProject } = this.state;
		const emptyRows = rowsPerPage - Math.min(rowsPerPage, data.length - page * rowsPerPage);
		return (
			<Paper className={classes.root}>
				<AssignProject
					open={openAssignProject}
					handleClose={this.handleCloseAssignToProject}
					device_id={selected}
					t={t} />
				<EnhancedTableToolbar
					anchorElMenu={this.state.anchorElMenu}
					anchorFilterMenu={this.state.anchorFilterMenu}
					handleToolbarMenuClose={this.handleToolbarMenuClose}
					handleToolbarMenuOpen={this.handleToolbarMenuOpen}
					handleFilterMenuOpen={this.handleFilterMenuOpen}
					handleFilterMenuClose={this.handleFilterMenuClose}
					handleFilterKeyword={this.props.handleFilterKeyword}
					handleFilterStartDate={this.props.handleFilterStartDate}
					handleFilterEndDate={this.props.handleFilterEndDate}
					filters={this.props.filters}
					filterOptions={this.props.tableHead}
					numSelected={selected.length}
					options={this.options}
					suggestions={this.suggestionGen(data)}
					noAdd
					t={t}
				/>
				<div className={classes.tableWrapper}>
					<Table className={classes.table} aria-labelledby="tableTitle">
						<EnhancedTableHead
							numSelected={selected.length}
							order={order}
							orderBy={orderBy}
							onSelectAllClick={this.handleSelectAllClick}
							onRequestSort={this.handleRequestSort}
							rowCount={data.length}
							columnData={this.props.tableHead}
							classes={classes}
						/>
						<TableBody>
							{data.slice(page * rowsPerPage, page * rowsPerPage + rowsPerPage).map(n => {
								const isSelected = this.isSelected(n.device_id);
								return (
									<TableRow
										hover
										onClick={e => { e.stopPropagation(); this.props.history.push('/device/' + n.device_id) }}
										role="checkbox"
										aria-checked={isSelected}
										tabIndex={-1}
										key={n.device_id}
										selected={isSelected}
										style={{ cursor: 'pointer' }}
									>
										<TableCell padding="checkbox" className={classes.tablecellcheckbox} onClick={e => this.handleClick(e, n.device_id)}>
											<Checkbox checked={isSelected} />
										</TableCell>
										<Hidden mdDown>
											 <TableCell className={classes.tableCell}>
												<Typography paragraph classes={{ root: classes.paragraphCell }}>
													{n.device_name ?  n.device_name : t("devices.noName")} 
												</Typography>
											</TableCell>
											<TableCell className={classes.tableCell}>
												<Typography paragraph classes={{ root: classes.paragraphCell }}>
													{n.device_id}
												</Typography>
											</TableCell>
											<TableCell className={classes.tableCell}>
												<div className={classes.paragraphCell}>
													{this.renderIcon(n.liveStatus)}
												</div>
											</TableCell>
											<TableCell className={classes.tableCell}>
												<Typography paragraph classes={{ root: classes.paragraphCell }}>
													{n.address ? n.address : t("devices.noAddress")}
												</Typography>
											</TableCell>
											<TableCell className={classes.tableCell}>
												<Typography paragraph classes={{ root: classes.paragraphCell }}>
													{n.organisation ? n.organisation.vcName  : t("devices.noProject")}
												</Typography>
											</TableCell>
										</Hidden>
										<Hidden lgUp>
											<TableCell className={classes.tableCellID}>
												<Typography paragraph classes={{ root: classes.paragraphCell }}>
													{n.device_id}
												</Typography>
											</TableCell>
											<TableCell className={classes.tableCell}>
												<Typography paragraph classes={{ root: classes.paragraphCell }}>
													{n.device_name ? n.device_name : t("devices.noName")}
												</Typography>
											</TableCell>
											<TableCell className={classes.tableCellID}>
												<div className={classes.paragraphCell}>
													{this.renderIcon(n.liveStatus)}
												</div>
											</TableCell>
										</Hidden>
									</TableRow>
								);
							})}
							{emptyRows > 0 && (
								<TableRow style={{ height: 49 * emptyRows }}>
									<TableCell colSpan={8} />
								</TableRow>
							)}
						</TableBody>
					</Table>
				</div>
				<TablePagination
					component="div"
					count={data.length}
					rowsPerPage={rowsPerPage}
					page={page}
					backIconButtonProps={{
						'aria-label': t("actions.nextPage"),
					}}
					nextIconButtonProps={{
						'aria-label': t("actions.previousPage"),
					}}
					onChangePage={this.handleChangePage}
					onChangeRowsPerPage={this.handleChangeRowsPerPage}
					labelRowsPerPage={<Hidden mdDown>{t("tables.rowsPerPage")}</Hidden>}

				/>
			</Paper>
		);
	}
}

EnhancedTable.propTypes = {
	classes: PropTypes.object.isRequired,
};

export default withRouter(withStyles(devicetableStyles, { withTheme: true })(EnhancedTable));