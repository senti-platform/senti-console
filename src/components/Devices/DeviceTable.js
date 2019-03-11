import {
	Checkbox, Hidden, Table, TableBody, TableCell,
	TableRow, Typography, withStyles,
} from '@material-ui/core';
import { SignalWifi2Bar, SignalWifi2BarLock } from 'variables/icons';
import devicetableStyles from 'assets/jss/components/devices/devicetableStyles';
import PropTypes from 'prop-types';
import React, { Fragment } from 'react';
import { withRouter } from 'react-router-dom';
import EnhancedTableHead from 'components/Table/TableHeader'
import { connect } from 'react-redux'
import { Info, Caption, ItemG } from 'components';
import TC from 'components/Table/TC'
import TP from 'components/Table/TP';
import DeviceHover from 'components/Hover/DeviceHover';

class DeviceTable extends React.Component {
	constructor(props) {
		super(props);

		this.state = {
			page: 0,
			rowHover: null
		};
	}

	timer = []

	handleRequestSort = (event, property) => {
		this.props.handleRequestSort(event, property)
	}

	handleChangePage = (event, page) => {
		this.setState({ page });
	};

	isSelected = id => this.props.selected.indexOf(id) !== -1;

	setHover = (e, n) => {
		// e.persist()
		const { rowHover } = this.state
		// console.log(rowHover.id !== n.id)
		let target = e.target
		// console.log(target)
		let timer = setTimeout(() => {
			if (rowHover !== null) {
				if (rowHover.id !== n.id) {
					this.setState({
						rowHover: null
					})
					setTimeout(() => {
						this.setState({ rowHover: target, hoverDevice: n })
					}, 200);
				}
			}
			else {
				this.setState({ rowHover: target, hoverDevice: n })
			}
		}, 700);
		this.timer.push(timer)
	}
	unsetTimeout = () => {
		if (this.timer.length > 0)
			this.timer.forEach(e => clearTimeout(e))
	}
	unsetHover = () => {
		// console.trace()
		this.setState({
			rowHover: null
		})
	}
	renderHover = () => {
		return <DeviceHover anchorEl={this.state.rowHover} handleClose={this.unsetHover} device={this.state.hoverDevice} />
	}

	renderIcon = (status) => {
		const { classes, t } = this.props
		switch (status) {
			case 1:
				return <ItemG container justify={'center'} title={t('devices.status.yellow')}>
					<SignalWifi2Bar className={classes.yellowSignal} />
				</ItemG>
			case 2:
				return <ItemG container justify={'center'} title={t('devices.status.green')}>
					<SignalWifi2Bar className={classes.greenSignal} />
				</ItemG>
			case 0:
				return <ItemG container justify={'center'} title={t('devices.status.red')}>
					<SignalWifi2Bar className={classes.redSignal} />
				</ItemG>
			case null:
				return <SignalWifi2BarLock />
			default:
				break;
		}
	}
	render() {
		const { selected, classes, t, data, order, orderBy, handleClick, handleCheckboxClick, handleSelectAllClick, rowsPerPage } = this.props;
		const { page } = this.state;
		let emptyRows
		if (data)
			emptyRows = rowsPerPage - Math.min(rowsPerPage, data.length - page * rowsPerPage);
		return (
			<Fragment>
				<div className={classes.tableWrapper} onMouseLeave={this.unsetHover}>
					{this.renderHover()}
					<Table className={classes.table} aria-labelledby='tableTitle'>
						<EnhancedTableHead
							numSelected={selected.length}
							order={order}
							orderBy={orderBy}
							onSelectAllClick={handleSelectAllClick}
							onRequestSort={this.handleRequestSort}
							rowCount={data ? data.length : 0}
							columnData={this.props.tableHead}
							classes={classes}
							customColumn={[
								{
									id: 'liveStatus', label: <ItemG container justify={'center'}>
										<SignalWifi2Bar />
									</ItemG>, checkbox: true
								},
								{
									id: 'id',
									label: <Typography paragraph classes={{ root: classes.paragraphCell + ' ' + classes.headerCell }}>
										{t('collections.fields.device')}
									</Typography>
								}
							]}
						/>
						<TableBody>
							{data ? data.slice(page * rowsPerPage, page * rowsPerPage + rowsPerPage).map(n => {
								const isSelected = this.isSelected(n.id);
								return (
									<TableRow
										onMouseOver={e => { this.setHover(e, n) }}
										onMouseLeave={this.unsetTimeout}
										hover
										onClick={handleClick(n.id)}
										role='checkbox'
										aria-checked={isSelected}
										tabIndex={-1}
										key={n.id}
										selected={isSelected}
										style={{ cursor: 'pointer' }}
									>
										<Hidden lgUp>
											<TC checkbox content={<Checkbox checked={isSelected} onClick={e => handleCheckboxClick(e, n.id)} />} />
											<TC checkbox content={this.renderIcon(n.liveStatus)} />
											<TC content={
												<ItemG container alignItems={'center'}>
													<ItemG xs={12}>
														<Info noWrap paragraphCell={classes.noMargin}>
															{n.name ? n.name : n.id}
														</Info>
													</ItemG>
													<ItemG xs={12}>
														<Caption noWrap className={classes.noMargin}>
															{`${n.name ? n.id : t('devices.noName')} - ${n.org ? n.org.name : ''}`}
														</Caption>
													</ItemG>
												</ItemG>} />
										</Hidden>
										<Hidden mdDown>
											<TC checkbox content={<Checkbox checked={isSelected} onClick={e => handleCheckboxClick(e, n.id)} />} />
											<TC label={n.name ? n.name : t('devices.noName')} />
											<TC label={n.id} />
											<TC content={this.renderIcon(n.liveStatus)} />
											<TC label={n.address ? n.address : t('devices.noAddress')} />
											<TC label={n.org ? n.org.name : t('no.org')} />
											<TC label={n.dataCollection ? t('devices.fields.notfree') : t('devices.fields.free')} />
										</Hidden>
									</TableRow>
								);
							}) : null}
							{emptyRows > 0 && (
								<TableRow style={{ height: 49 }}>
									<TableCell colSpan={8} />
								</TableRow>
							)}
						</TableBody>
					</Table>
				</div>
				<TP
					count={data ? data.length : 0}
					classes={classes}
					// rowsPerPage={rowsPerPage}
					page={page}
					t={t}
					handleChangePage={this.handleChangePage}
				/>
			</Fragment>
		);
	}
}

DeviceTable.propTypes = {
	classes: PropTypes.object.isRequired,
};
const mapStateToProps = (state) => ({
	rowsPerPage: state.appState.trp ? state.appState.trp : state.settings.trp,
	accessLevel: state.settings.user.privileges
})

const mapDispatchToProps = {

}

export default withRouter(connect(mapStateToProps, mapDispatchToProps)(withStyles(devicetableStyles, { withTheme: true })(DeviceTable)));