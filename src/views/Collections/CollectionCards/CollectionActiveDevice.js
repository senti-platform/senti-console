import { Button, Typography } from '@material-ui/core';
import { Caption, Info, InfoCard, ItemG, ItemGrid } from 'components/index';
import React from 'react';
import { dateFormat, dateFormatter } from 'variables/functions';
import { DeviceHub, SignalWifi2Bar, SignalWifi2BarLock } from 'variables/icons';
import { useLocalization } from 'hooks';

// @Andrei
const CollectionActiveDevice = props => {
	const t = useLocalization()

	const renderStatus = (status) => {
		const { classes } = props
		switch (status) {
			case 1:
				return <SignalWifi2Bar className={classes.yellowSignal} />
			case 2:
				return <SignalWifi2Bar className={classes.greenSignal} />
			case 0:
				return <SignalWifi2Bar className={classes.redSignal} />
			case null:
				return <div>
					<SignalWifi2BarLock className={classes.redSignal} />
					<Typography>
						Error
					</Typography>
				</div>
			default:
				break;
		}
	}
	// const LocationTypes = () => {
	// 	// const { t } = this.props
	// 	return [
	// 		{ id: 1, label: t('devices.locationTypes.pedStreet') },
	// 		{ id: 2, label: t('devices.locationTypes.park') },
	// 		{ id: 3, label: t('devices.locationTypes.path') },
	// 		{ id: 4, label: t('devices.locationTypes.square') },
	// 		{ id: 5, label: t('devices.locationTypes.crossroads') },
	// 		{ id: 6, label: t('devices.locationTypes.road') },
	// 		{ id: 7, label: t('devices.locationTypes.motorway') },
	// 		{ id: 8, label: t('devices.locationTypes.port') },
	// 		{ id: 9, label: t('devices.locationTypes.office') },
	// 		{ id: 0, label: t('devices.locationTypes.unspecified') }]
	// }


	// const renderDeviceLocType = () => {
	// 	const { device } = props
	// 	let deviceLoc = LocationTypes()[LocationTypes().findIndex(r => r.id === device.locationType)]
	// 	return deviceLoc ? deviceLoc.label : t('devices.noLocType')
	// }

	const { /*  classes, */ device, /* accessLevel, */ history, collection } = props
	return (
		<InfoCard
			title={device ? t('collections.fields.activeDevice') : t('no.activeDevice')}
			avatar={<DeviceHub />}
			subheader={device ? <ItemG container alignItems={'center'}>
				<Caption>{t('devices.fields.id')}:</Caption>&nbsp;{device ? device.id : ''}
			</ItemG> : null}
			noRightExpand
			leftActions={
				device ? <ItemG xs={12} container justify={'flex-end'}>
					<Button variant={'text'} color={'primary'} onClick={() => { history.push({ pathname: `/device/${device.id}`, prevURL: `/collection/${collection.id}` }) }}>
						{t('menus.seeMore')}
					</Button>
				</ItemG> : null
			}
			content={
				device ?
					<ItemG container>

						<ItemGrid>
							<Caption>{t('devices.fields.status')}:</Caption>
							{renderStatus(device.state)}
						</ItemGrid>
						<ItemGrid>
							<Caption>{t('devices.fields.temp')}:</Caption>
							<Info>{device.temperature ? `${device.temperature}\u2103` : `-\u2103`}</Info>
						</ItemGrid>
						<ItemGrid xs={12}>
							<Caption>{t('devices.fields.address')}</Caption>
							<Info>{device.address}</Info>
						</ItemGrid>
						{/* <ItemGrid xs={12}>
								<Caption>{t('devices.fields.description')}:</Caption>
								<Info>{device.description ? device.description : ''}</Info>
							</ItemGrid> */}
						<ItemGrid xs={12}>
							<Caption>{t('devices.fields.lastData')}:</Caption>
							<Info title={dateFormatter(device.latestData)}>
								{dateFormat(device.latestData)}
							</Info>
						</ItemGrid>
						<ItemGrid xs={12}>
							<Caption>{t('devices.fields.lastStats')}:</Caption>
							<Info title={dateFormatter(device.latestActivity)}>
								{dateFormat(device.latestActivity)}
							</Info>
						</ItemGrid>
					</ItemG>
					: null
			} />)
}

export default CollectionActiveDevice
