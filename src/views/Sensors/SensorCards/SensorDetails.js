import { withStyles } from '@material-ui/core';
import registryStyles from 'assets/jss/views/deviceStyles';
import { Caption, ItemG, Info } from 'components';
import InfoCard from 'components/Cards/InfoCard';
import Dropdown from 'components/Dropdown/Dropdown';
import React, { Component } from 'react';
// import { Link } from 'react-router-dom';
import { DataUsage, Edit, /* DeviceHub, LibraryBooks, LayersClear, */ Star, StarBorder, Block, CheckCircle, /* Delete */ } from 'variables/icons';
import { connect } from 'react-redux'
import { Link } from 'react-router-dom';

class SensorDetails extends Component {

	registryState = () => {
		const { registry, t } = this.props
		switch (registry.state) {
			case 1:
				return t('registries.fields.state.active')
			case 2:
				return t('registries.fields.state.inactive')
			default:
				break;
		}
	}
	renderProtocol = (id) => {
		const { t } = this.props
		switch (id) {
			case 0:
				return t('registries.fields.protocols.none')
			case 1: 
				return t('registries.fields.protocols.mqtt')
			case 2: 
				return t('registries.fields.protocols.http')
			case 3: 
				return `${t('registries.fields.protocols.mqtt')} & ${t('registries.fields.protocols.http')}`
			default:
				break;
		}
	}
	renderCommunication = (val) => {
		const { t, classes } = this.props
		switch (val) {
			case 0:
				return <ItemG container><Block className={classes.blocked} /> <Info>{t('sensors.fields.communications.blocked')}</Info></ItemG>
			case 1:
				return <ItemG container><CheckCircle className={classes.allowed} /> <Info>{t('sensors.fields.communications.allowed')}</Info></ItemG>
			default:
				break;
		}
	}
	render() {
		const { classes, sensor, t, isFav, addToFav, removeFromFav, /* accessLevel ,*/ history } = this.props
		return (
			<InfoCard
				title={sensor.name ? sensor.name : sensor.id}
				avatar={<DataUsage />}
				// noPadding
				// noRightExpand
				// menuExpand
				noExpand
				// expanded={Boolean(detailsPanel)}
				topAction={<Dropdown menuItems={
					[
						{ label: t('menus.edit'), icon: <Edit className={classes.leftIcon} />, func: () => history.push({ pathname: `/sensor/${sensor.id}/edit`, prevURL: `/sensor/${sensor.id}` }) },
						// { label: t('menus.delete'), icon: <Delete className={classes.leftIcon} />, func: handleOpenDeleteDialog },
						{ label: isFav ? t('menus.favorites.remove') : t('menus.favorites.add'), icon: isFav ? <Star className={classes.leftIcon} /> : <StarBorder className={classes.leftIcon} />, func: isFav ? removeFromFav : addToFav }

					]
				} />

				}
				subheader={<ItemG container alignItems={'center'}>
					<Caption>{t('registries.fields.id')}:</Caption>&nbsp;{sensor.id}
				</ItemG>}
				content={
					<ItemG container spacing={16}>
						<ItemG>
							<Caption>{t('registries.fields.protocol')}</Caption>
							<Info>{this.renderProtocol(sensor.protocol)}</Info>
						</ItemG>
						<ItemG xs>
							<Caption>{t('sensors.fields.communication')}</Caption>
							{this.renderCommunication(sensor.communication)}
						</ItemG>
						<ItemG xs={12}>
							<Caption>{t('registries.fields.registry')}</Caption>
							<Info>
								<Link to={{ pathname: `/registry/${sensor.regId}`, prevURL: `/sensor/${sensor.id}` }} >
									{sensor.regName}
								</Link>
							</Info>
						</ItemG>
					</ItemG>
				}
			/>
		)
	}
}

const mapStateToProps = (state) => ({
	detailsPanel: state.settings.detailsPanel
})

export default connect(mapStateToProps)(withStyles(registryStyles)(SensorDetails))