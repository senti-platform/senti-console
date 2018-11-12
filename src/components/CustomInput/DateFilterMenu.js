import React, { Component, Fragment } from 'react'
import PropTypes from 'prop-types'
import { Hidden, FormControl, Select, Divider, MenuItem, FormHelperText } from '@material-ui/core';
import { DateRange } from 'variables/icons';
import { ItemGrid, Caption, Info, CustomDateTime } from 'components';
import { dateTimeFormatter } from 'variables/functions';
import moment from 'moment'

/**
* @augments {Component<{	classes:object,	to:instanceOf(Date),	from:instanceOf(Date),	t:Function,	dateFilterInputID:number,	handleDateFilter:Function,>}
*/
class DateFilterMenu extends Component {
	constructor(props) {
	  super(props)
	
	  this.state = {
		  dateFilterInputID: 3,
		  from: moment().subtract(7, 'd').startOf('day'),
		  to: moment().endOf('day'),
	  }
	}
	timeTypes = [
		{ id: 0, format: "lll", chart: "minute" },
		{ id: 1, format: "lll", chart: "hour" },
		{ id: 2, format: "ll", chart: "day" },
		{ id: 3, format: "ll", chart: "day" },
	]
	options = [
		{ id: 0, label: this.props.t("filters.dateOptions.today") },
		{ id: 1, label: this.props.t("filters.dateOptions.yesterday") },
		{ id: 2, label: this.props.t("filters.dateOptions.thisWeek") },
		{ id: 3, label: this.props.t("filters.dateOptions.7days") },
		{ id: 4, label: this.props.t("filters.dateOptions.30days") },
		{ id: 5, label: this.props.t("filters.dateOptions.90days") },
		{ id: 6, label: this.props.t("filters.dateOptions.custom") },
	]
	handleSetDate = (id) => {

		let to = null
		let from = null
		switch (id) {
			case 0: // Today
				from = moment().startOf('day')
				to = moment().endOf('day')
				break;
			case 1: // Yesterday
				from = moment().subtract(1, 'd').startOf('day')
				to = moment().subtract(1, 'd').endOf('day')
				break;
			case 2: // This week
				from = moment().startOf('week').startOf('day')
				to = moment().endOf('day')
				break;
			case 3: // Last 7 days
				from = moment().subtract(7, 'd').startOf('day')
				to = moment().endOf('day')
				break;
			case 4: // last 30 days
				from = moment().subtract(30, 'd').startOf('day')
				to = moment().endOf('day')
				break;
			case 5: // last 90 days
				from = moment().subtract(90, 'd').startOf('day')
				to = moment().endOf('day')
				break;
			default:
				break;
		}
		this.setState({
			dateFilterInputID: id,
			to: to,
			from: from,
			loading: true,
			roundDataSets: null,
			barDataSets: null
		}, this.props.handleSetDate(id, to, from))
	}
	handleCustomDate = date => e => {
		this.setState({
			[date]: e
		})
	}

	handleCloseDialog = () => {
		this.setState({ openCustomDate: false })
		this.customDisplay()
	}
	handleDateFilter = (event) => {
		let id = event.target.value
		if (id !== 6) {
			this.handleSetDate(id)
		}
		else {
			//this.props.handleDateFilter(loading, dateFilterInputID)
			this.setState({ loading: true, openCustomDate: true, dateFilterInputID: id })
		}
	}

	handleCustomCheckBox = (e) => {
		this.setState({ timeType: parseInt(e.target.value, 10) })
	}

	handleCancelCustomDate = () => {
		this.setState({
			loading: false, openCustomDate: false
		})
	}
	renderCustomDateDialog = () => {
		const { classes, t } = this.props
		const { openCustomDate, to, from, timeType } = this.state
		return openCustomDate ? <CustomDateTime
			openCustomDate={openCustomDate}
			handleCloseDialog={this.handleCloseDialog}//
			handleCustomDate={this.handleCustomDate}
			to={to}
			from={from}
			timeType={timeType}
			handleCustomCheckBox={this.handleCustomCheckBox}//
			handleCancelCustomDate={this.handleCancelCustomDate}//
			t={t}
			classes={classes}
		/> : null
	}
	render() {
		const { to, from, dateFilterInputID } = this.state
		const { classes, /* to, from, */ t, /* dateFilterInputID  */} = this.props
		// const { handleDateFilter } = this.props
		let displayTo = dateTimeFormatter(to)
		let displayFrom = dateTimeFormatter(from)
		return (<Fragment>
			{this.renderCustomDateDialog()}
			<div className={classes.root}>
				<Hidden smDown>
					<DateRange className={classes.leftIcon} />
				</Hidden>
				<FormControl className={classes.formControl}>
					<Select
						value={dateFilterInputID}
						onChange={this.handleDateFilter}
						inputProps={{
							name: 'data-dateFilter',
							id: 'data-dateFilterInput',
						}}
					>
						<ItemGrid>
							<Caption>{this.options[this.options.findIndex(d => d.id === dateFilterInputID ? true : false)].label}</Caption>
							<Info>{`${displayFrom} - ${displayTo}`}</Info>
						</ItemGrid>
						<Divider />
						<MenuItem value={0}>{t("filters.dateOptions.today")}</MenuItem>
						<MenuItem value={1}>{t("filters.dateOptions.yesterday")}</MenuItem>
						<MenuItem value={2}>{t("filters.dateOptions.thisWeek")}</MenuItem>
						<MenuItem value={3}>{t("filters.dateOptions.7days")}</MenuItem>
						<MenuItem value={4}>{t("filters.dateOptions.30days")}</MenuItem>
						<MenuItem value={5}>{t("filters.dateOptions.90days")}</MenuItem>
						<Divider />
						<MenuItem value={6}>{t("filters.dateOptions.custom")}</MenuItem>
					</Select>
					<FormHelperText>{`${displayFrom} - ${displayTo}`}</FormHelperText>
				</FormControl>
			</div>
		</Fragment>
		)
	}
}
DateFilterMenu.propTypes = {
	classes: PropTypes.object,
	to: PropTypes.instanceOf(moment),
	from: PropTypes.instanceOf(moment),
	t: PropTypes.func,
	dateFilterInputID: PropTypes.number,
	handleDateFilter: PropTypes.func,
}
export default DateFilterMenu
