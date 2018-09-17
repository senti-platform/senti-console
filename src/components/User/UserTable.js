import {
	Checkbox, Hidden, Paper, Table, TableBody, TableCell, TablePagination,
	TableRow, /* Typography, */ withStyles, Snackbar, DialogTitle, Dialog, DialogContent,
	DialogContentText, DialogActions, Button, Typography, /* IconButton, Menu, MenuItem*/
} from "@material-ui/core"
import TC from 'components/Table/TableCell'
import { Delete, /* Devices, */ Edit, PictureAsPdf } from '@material-ui/icons'
import devicetableStyles from "assets/jss/components/devices/devicetableStyles"
import PropTypes from "prop-types"
import React from "react"
import { withRouter } from 'react-router-dom'
// import { dateFormatter } from "variables/functions"
import EnhancedTableHead from '../Table/TableHeader'
import EnhancedTableToolbar from '../Table/TableToolbar'
import { ItemGrid, Info } from ".."
import { connect } from "react-redux"
import Caption from '../Typography/Caption';
// import { Add, FilterList } from '@material-ui/icons';
// import { boxShadow } from 'assets/jss/material-dashboard-react';
import UserPlaceHolder from 'assets/img/userplaceholder.png'
import { pF } from 'variables/functions';

var moment = require("moment")
class UserTable extends React.Component {
	constructor(props) {
		super(props);

		this.state = {
			order: 'asc',
			orderBy: 'title',
			selected: [],
			page: 0,
			rowsPerPage: props.rowsPerPage,
			anchorElMenu: null,
			anchorFilterMenu: null,
			openSnackbar: 0,
			openDelete: false
		}
	}

	snackBarMessages = () => {
		let msg = this.state.openSnackbar
		const { t } = this.props
		switch (msg) {
			case 1:
				return t("snackbars.deletedSuccess")
			case 2:
				return t("snackbars.exported")
			default:
				break;
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
				: this.props.data.sort((a, b) => (a[orderBy] < b[orderBy] ? -1 : 1))

		this.setState({ data, order, orderBy })
	}

	handleSelectAllPage = (event, checked) => {
		if (checked) {
			const { data } = this.props
			const { rowsPerPage, page } = this.state
			this.setState({ selected: data.slice(page * rowsPerPage, page * rowsPerPage + rowsPerPage).map(n => n.id) })
			return;
		}
	}

	handleSelectAllClick = (event, checked) => {
		if (checked) {
			this.setState({ selected: this.props.data.map(n => n.id) })
			return;
		}
		this.setState({ selected: [] })
	}

	handleClick = (event, id) => {
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

	handleChangePage = (event, page) => {
		this.setState({ page });
	}

	handleChangeRowsPerPage = event => {
		this.setState({ rowsPerPage: event.target.value })
	}

	handleDeleteProjects = async () => {
		await this.props.deleteProjects(this.state.selected)
		this.setState({
			selected: [],
			anchorElMenu: null,
			openSnackbar: 1,
			openDelete: false
		})
	}

	handleOpenDeleteDialog = () => {
		this.setState({ openDelete: true, anchorElMenu: null })
	}

	handleCloseDeleteDialog = () => {
		this.setState({ openDelete: false })
	}

	isSelected = id => this.state.selected.indexOf(id) !== -1

	options = () => {
		const { t } = this.props
		return [
			{ label: t("menus.edit"), func: this.handleEdit, single: true, icon: Edit },
			// { label: t("menus.assignDevices"), func: this.assignDevice, single: true, icon: Devices },
			{ label: t("menus.exportPDF"), func: () => { }, icon: PictureAsPdf },
			{ label: t("menus.delete"), func: this.handleOpenDeleteDialog, icon: Delete }
		]
	}

	renderConfirmDelete = () => {
		const { openDelete, selected } = this.state
		const { data, t } = this.props
		return <Dialog
			open={openDelete}
			onClose={this.handleCloseDeleteDialog}
			aria-labelledby="alert-dialog-title"
			aria-describedby="alert-dialog-description"
		>
			<DialogTitle id="alert-dialog-title">{t("projects.projectDelete")}</DialogTitle>
			<DialogContent>
				<DialogContentText id="alert-dialog-description">
					{t("projects.projectDeleteConfirm")}
				</DialogContentText>
				<div>
					{selected.map(s => <Info key={s}>&bull;{data[data.findIndex(d => d.id === s)].title}</Info>)}
				</div>
			</DialogContent>
			<DialogActions>
				<Button onClick={this.handleCloseDeleteDialog} color="primary">
					{t("actions.no")}
				</Button>
				<Button onClick={this.handleDeleteProjects} color="primary" autoFocus>
					{t("actions.yes")}
				</Button>
			</DialogActions>
		</Dialog>
	}

	render() {
		const { classes, data, t } = this.props
		const { order, orderBy, selected, rowsPerPage, page } = this.state
		let emptyRows;
		if (data)
			emptyRows = rowsPerPage - Math.min(rowsPerPage, data.length - page * rowsPerPage)

		return (
			<Paper className={classes.root}>
			
				<EnhancedTableToolbar
					anchorElMenu={this.state.anchorElMenu}
					handleToolbarMenuClose={this.handleToolbarMenuClose}
					handleToolbarMenuOpen={this.handleToolbarMenuOpen}
					numSelected={selected.length}
					options={this.options}
					t={t}
					// content={this.renderTableToolBarContent()}
				/>
				<div className={classes.tableWrapper}>
					<Table className={classes.table} aria-labelledby="tableTitle">
						<EnhancedTableHead // ./ProjectTableHeader
							numSelected={selected.length}
							order={order}
							orderBy={orderBy}
							onSelectAllClick={this.handleSelectAllClick}
							onRequestSort={this.handleRequestSort}
							rowCount={data ? data.length : 0}
							columnData={this.props.tableHead}
							t={t}
							classes={classes}
							// mdDown={[0]} //Which Columns to display on small Screens
							customColumn={[{ id: "avatar", label: "" }, {
								id: "firstName", label: <Typography paragraph classes={{ root: classes.paragraphCell + " " + classes.headerCell }}>Users</Typography> }]}
						/>
						<TableBody>
							{data ? data.slice(page * rowsPerPage, page * rowsPerPage + rowsPerPage).map(n => {
								const isSelected = this.isSelected(n.id);
								const lastLoggedIn = moment(n.lastLoggedIn).isValid() ? moment(n.lastLoggedIn).format("DD.MM.YYYY HH:mm") : t("users.fields.neverLoggedIn")
								return (
									<TableRow
										hover
										onClick={e => { e.stopPropagation(); this.props.history.push('/user/' + n.id) }}
										// onContextMenu={this.handleToolbarMenuOpen}
										role="checkbox"
										aria-checked={isSelected}
										tabIndex={-1}
										key={n.id}
										selected={isSelected}
										style={{ cursor: 'pointer' }}
									>
										<Hidden lgUp>
											<TableCell padding="checkbox" className={classes.tablecellcheckbox} onClick={e => this.handleClick(e, n.id)}>
												<Checkbox checked={isSelected} />
											</TableCell>
											<TableCell padding="checkbox" className={classes.tablecellcheckbox}>
												<ItemGrid container zeroMargin noPadding justify={"center"}>
													<img src={UserPlaceHolder} alt="brken" className={classes.img} />
												</ItemGrid>
											</TableCell>
											<TableCell classes={{ root: classes.tableCell }}>
												<ItemGrid container zeroMargin noPadding alignItems={"center"}>
													{/* <ItemGrid zeroMargin noPadding xs={2}>
													<ItemGrid container zeroMargin noPadding justify={"center"}>
														<img src={UserPlaceHolder} alt="brken" className={classes.img}/>
													</ItemGrid>
												</ItemGrid> */}
													{/* <ItemGrid xs={10} zeroMargin> */}
													<ItemGrid zeroMargin noPadding zeroMinWidth xs={12}>
														<Info noWrap paragraphCell={classes.noMargin}>
															{`${n.firstName} ${n.lastName}`}
														</Info>
													</ItemGrid>
													<ItemGrid zeroMargin noPadding zeroMinWidth xs={12}>
														<Caption noWrap className={classes.noMargin}>
															{`${n.org ? n.org.name : t("users.fields.noOrg")} - ${n.email}`}
														</Caption>
													</ItemGrid>
													{/* </ItemGrid> */}
												</ItemGrid>
											</TableCell>
										</Hidden>
										<Hidden mdDown>
											<TableCell padding="checkbox" className={classes.tablecellcheckbox} onClick={e => this.handleClick(e, n.id)}>
												<Checkbox checked={isSelected} />
											</TableCell>
											<TableCell padding="checkbox" className={classes.tablecellcheckbox}>
												<ItemGrid container zeroMargin noPadding justify={"center"}>	
													<img src={UserPlaceHolder} alt="brken" className={classes.img} />
												</ItemGrid>
											</TableCell>
											{/* <TC label={n.userName} /> */}
											<TC FirstC label={`${n.firstName} ${n.lastName}`} />
											<TC label={<a onClick={e => e.stopPropagation()} href={`tel:${n.phone}`}>{n.phone ? pF(n.phone) : n.phone}</a>} />
											<TC label={<a onClick={e => e.stopPropagation()} href={`mailto:${n.email}`}>{n.email}</a>} />
											<TC label={n.org ? n.org.name : t("users.noOrg")} />
											<TC label={lastLoggedIn}/>
										</Hidden>
									</TableRow>

								)
							}) : null}
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
					classes={{
						spacer: classes.spacer,
						input: classes.spaceBetween,
						caption: classes.tablePaginationCaption
					}}
					onChangePage={this.handleChangePage}
					onChangeRowsPerPage={this.handleChangeRowsPerPage}
					labelRowsPerPage={t("tables.rowsPerPage")}
					rowsPerPageOptions={[5, 10, 25, 50, 100]}
					SelectProps={{
						classes: {
							select: classes.SelectIcon
						}
					}}
				/>
				<Snackbar
					anchorOrigin={{ vertical: "bottom", horizontal: "right" }}
					open={this.state.openSnackbar !== 0 ? true : false}
					onClose={() => { this.setState({ openSnackbar: 0 }) }}
					autoHideDuration={5000}
					message={
						<ItemGrid zeroMargin noPadding justify={'center'} alignItems={'center'} container id="message-id">
							{this.snackBarMessages()}
						</ItemGrid>
					}
				/>
				{this.renderConfirmDelete()}
			
			</Paper>
		)
	}
}
const mapStateToProps = (state) => ({
	rowsPerPage: state.settings.trp
})

const mapDispatchToProps = {

}

UserTable.propTypes = {
	classes: PropTypes.object.isRequired,
}

export default withRouter(connect(mapStateToProps, mapDispatchToProps)(withStyles(devicetableStyles, { withTheme: true })(UserTable)))