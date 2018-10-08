import {
	Checkbox, Hidden, Paper, Table, TableBody, TableCell,
	TableRow, withStyles, DialogTitle, Dialog, DialogContent,
	DialogContentText, DialogActions, Button, /* MenuItem, Menu, */ IconButton, ListItem, ListItemIcon, ListItemText, List,
} from "@material-ui/core"
import TC from 'components/Table/TC'
import { Delete, Edit, PictureAsPdf, /* FilterList, */ Add } from 'variables/icons'
import devicetableStyles from "assets/jss/components/devices/devicetableStyles"
import PropTypes from "prop-types"
import React, { Fragment } from "react"
import { withRouter } from 'react-router-dom'
import EnhancedTableHead from 'components/Table/TableHeader'
import EnhancedTableToolbar from 'components/Table/TableToolbar'
import { Info, ItemG, Caption } from ".."
import { connect } from "react-redux"
import TP from 'components/Table/TP'
var countries = require("i18n-iso-countries")

class OrgTable extends React.Component {
	constructor(props) {
		super(props);

		this.state = {
			selected: [],
			page: 0,
			rowsPerPage: props.rowsPerPage,
			anchorElMenu: null,
			anchorFilterMenu: null,
			openDelete: false,
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

	handleRequestSort = (event, property) => {
		this.props.handleRequestSort(event, property)
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


	handleOpenDeleteDialog = () => {
		this.setState({ openDelete: true, anchorElMenu: null })
	}

	handleCloseDeleteDialog = () => {
		this.setState({ openDelete: false })
	}
	handleDeleteOrg = async () => {
		await this.props.handleDeleteOrgs(this.state.selected)
		this.setState({
			selected: [],
			anchorElMenu: null,
			openDelete: false
		})
	}
	isSelected = id => this.state.selected.indexOf(id) !== -1

	handleEdit = () => {
		this.props.history.push(`/org/${this.state.selected[0]}/edit`)
	}
	options = () => {
		const { t, accessLevel } = this.props
		let allOptions = [
			{ label: t("menus.edit"), func: this.handleEdit, single: true, icon: Edit },
			{ label: t("menus.exportPDF"), func: () => { }, icon: PictureAsPdf },
			{ label: t("menus.delete"), func: this.handleOpenDeleteDialog, icon: Delete }
		]
		if (accessLevel.apiorg.edit)
			return allOptions
		else return [
			{ label: t("menus.exportPDF"), func: () => { }, icon: PictureAsPdf }
		]
	}
	addNewOrg = () => { this.props.history.push('/orgs/new') }

	renderTableToolBarContent = () => {
		const { accessLevel } = this.props
		// const { anchorFilterMenu } = this.state
		let access = accessLevel.apiorg ? accessLevel.apiorg.edit ? true : false : false
		return <Fragment>
			{access ? <IconButton aria-label="Add new organisation" onClick={this.addNewOrg}>
				<Add />
			</IconButton> : null
			}
		</Fragment>
	}
renderConfirmDelete = () => {
	const { openDelete, selected } = this.state
	const { data, t, classes } = this.props
	return <Dialog
		open={openDelete}
		onClose={this.handleCloseDeleteDialog}
		aria-labelledby="alert-dialog-title"
		aria-describedby="alert-dialog-description"
	>
		<DialogTitle id="alert-dialog-title">{t("orgs.orgsDelete")}</DialogTitle>
		<DialogContent>
			<DialogContentText id="alert-dialog-description">
				{t("orgs.orgsDeleteConfirm")}:
			</DialogContentText>
			<List>
				{selected.map(s => <ListItem classes={{ root: classes.deleteListItem }} key={s}><ListItemIcon><div>&bull;</div></ListItemIcon>
					<ListItemText primary={data[data.findIndex(d => d.id === s)].name} /></ListItem>)}
			</List>
		</DialogContent>
		<DialogActions>
			<Button onClick={this.handleCloseDeleteDialog} color="primary">
				{t("actions.no")}
			</Button>
			<Button onClick={this.handleDeleteOrg} color="primary" autoFocus>
				{t("actions.yes")}
			</Button>
		</DialogActions>
	</Dialog>
}

render() {
	const { classes, t, order, orderBy, data } = this.props
	const { selected, rowsPerPage, page } = this.state
	let emptyRows;
	if (data)
		emptyRows = rowsPerPage - Math.min(rowsPerPage, data.length - page * rowsPerPage)

	return (

		<Paper className={classes.root}>
			<EnhancedTableToolbar //	./TableToolbar.js
				anchorElMenu={this.state.anchorElMenu}
				handleToolbarMenuClose={this.handleToolbarMenuClose}
				handleToolbarMenuOpen={this.handleToolbarMenuOpen}
				numSelected={selected.length}
				options={this.options}
				t={t}
				content={this.renderTableToolBarContent()}
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
						customColumn={[{ id: "name", label: t("orgs.fields.org") }]}
					/>
					<TableBody>
						{data ? data.slice(page * rowsPerPage, page * rowsPerPage + rowsPerPage).map(n => {
							const isSelected = this.isSelected(n.id);
							return (
								<TableRow
									hover
									onClick={e => { e.stopPropagation(); this.props.history.push('/org/' + n.id) }}
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
										<TC content={
											<ItemG container alignItems={"center"}>
												<ItemG>
													<Info noWrap paragraphCell={classes.noMargin}>
														{n.name}
													</Info>
													<ItemG>
														<Caption noWrap className={classes.noMargin}>
															{n.address && n.zip && n.city && n.country ?
																`${n.address}, ${n.zip} ${n.city}, ${countries.getName(n.country, this.props.language)}` : null}
														</Caption>
													</ItemG>
												</ItemG>
											</ItemG>
										} />
									</Hidden>
									<Hidden mdDown>
										<TableCell padding="checkbox" className={classes.tablecellcheckbox} onClick={e => this.handleClick(e, n.id)}>
											<Checkbox checked={isSelected} />
										</TableCell>
										<TC FirstC label={n.name} />
										<TC label={n.address} />
										<TC label={`${n.zip} ${n.city}`} />
										<TC label={n.url} />
									</Hidden>
								</TableRow>
							)
						}) : null}
						{emptyRows > 0 && (
							<TableRow style={{ height: 49 /* * emptyRows */ }}>
								<TableCell colSpan={8} />
							</TableRow>
						)}
					</TableBody>
				</Table>
			</div>
			<TP
				count={data ? data.length : 0}
				classes={classes}
				rowsPerPage={rowsPerPage}
				page={page}
				t={t}
				handleChangePage={this.handleChangePage}
				handleChangeRowsPerPage={this.handleChangeRowsPerPage}
			/>
			{this.renderConfirmDelete()}
		</Paper>
	)
}
}
const mapStateToProps = (state) => ({
	rowsPerPage: state.settings.trp,
	language: state.localization.language,
	accessLevel: state.settings.user.privileges
})

const mapDispatchToProps = {

}

OrgTable.propTypes = {
	classes: PropTypes.object.isRequired,
}

export default withRouter(connect(mapStateToProps, mapDispatchToProps)(withStyles(devicetableStyles, { withTheme: true })(OrgTable)))