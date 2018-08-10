import React, { Component } from 'react'
// import PropTypes from 'prop-types'
import { InfoCard, ItemGrid, DSelect, Caption } from 'components';
import { Build } from '@material-ui/icons'
import { Grid, ListItem, List, ListItemText, withStyles, Collapse } from '@material-ui/core';
import { settingsStyles } from 'assets/jss/components/settings/settingsStyles';
import DInput from 'components/CustomInput/DInput';

//Method ( Time/ Hits) + how many minutes/hits
//Notifications
//
class CalibrationSettings extends Component {
	static propTypes = {
	}

	changeCalType = e => {
		this.props.changeCount(0)//Temporary
		this.props.changeCalType(e.target.value)
	}
	changeMinutesCount = e => this.props.changeCount(e.target.value)
	changeCalNotif = e => this.props.changeCalNotif(e.target.value)
	changeCount = val => this.props.changeCount(val)

	render() {
		const { classes, t } = this.props
		const { calibration, count, calNotifications } = this.props
		const calibrations = [
			{ value: 0, label: t("settings.calibration.time") },
			{ value: 1, label: t("settings.calibration.count") }
		]
		const counts = [ 200, 10, 20, 30, 40, 50]
		const minutes = [
			{ value: 0, label: "10 minutes" },
			{ value: 1, label: "20 minutes" },
			{ value: 3, label: "30 minutes" }
		]
		const notifications = [
			{ value: 0, label: t("settings.calibration.3months") },
			{ value: 1, label: t("settings.calibration.6months") },
			{ value: 2, label: t("settings.calibration.9months") },
			{ value: 3, label: t("settings.calibration.12months") }
		]
		return (
			<InfoCard
				noExpand
				avatar={<Build />}
				title={"Calibration"}
				content={
					<Grid container>
						<List className={classes.list}>
							<ListItem divider>
								<ItemGrid container zeroMargin noPadding alignItems={"center"}>
									<ListItemText>{t("settings.calibration.text")}</ListItemText>
									<DSelect menuItems={calibrations} value={calibration} func={this.changeCalType} />
								</ItemGrid>
							</ListItem>
							<Collapse in={calibration === 1 ? true : false} style={{ width: "100%" }}>
								<ListItem divider>
									<ItemGrid container zeroMargin noPadding alignItems={"center"}>
										<ListItemText>{t("settings.calibration.byCount")}</ListItemText>
										<DInput menuItems={counts} value={count} func={this.changeCount} />
									</ItemGrid>
								</ListItem>
							</Collapse>
							<Collapse in={calibration === 0 ? true : false} style={{ width: "100%" }}>
								<ListItem divider>
									<ItemGrid container zeroMargin noPadding alignItems={"center"}>
										<ListItemText>{t("settings.calibration.byTime")}</ListItemText>
										<DSelect menuItems={minutes} value={count} func={this.changeMinutesCount} />
									</ItemGrid>
								</ListItem>
							</Collapse>
							<ListItem divider>
								<ItemGrid container zeroMargin noPadding alignItems={"center"}>
									<ListItemText>{t("settings.calibration.notification")}</ListItemText>
									<DSelect menuItems={notifications} value={calNotifications} func={this.changeCalNotif} />
								</ItemGrid>
							</ListItem>
							<ListItem >
								<ItemGrid container zeroMargin noPadding alignItems={"center"}>
									<ListItemText>{t("settings.calibration.history")}</ListItemText>
									<Caption>*Work in progress*</Caption>
								</ItemGrid>
							</ListItem>
						</List>
					</Grid>
				}
			/>
		)
	}
}

export default withStyles(settingsStyles)(CalibrationSettings)