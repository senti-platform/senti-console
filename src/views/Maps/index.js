import React, { PureComponent, Fragment } from 'react'
import { InfoCard, Caption, Dropdown, CircularLoader, ItemG, TextF, AddressInput, Danger } from 'components';
import { Map, Layers, Smartphone, Save, Clear, EditLocation, WhatsHot } from 'variables/icons'
import { Grid/*,  Checkbox, */, IconButton, Menu, MenuItem, Collapse, Dialog, DialogContent, DialogTitle, DialogActions, Button } from '@material-ui/core';
import { red, teal } from "@material-ui/core/colors"
import OpenStreetMap from 'components/Map/OpenStreetMap';
import { getAddressByLocation, updateDevice } from 'variables/dataDevices';
import { connect } from 'react-redux'
import { changeMapTheme, changeHeatMap } from 'redux/appState';

class MapCard extends PureComponent {
	constructor(props) {
		super(props)
		this.state = {
			actionAnchorVisibility: null,
			editLocation: false,
			openModalEditLocation: false,
			markers: props.markers
		}
	}
	visibilityOptions = [
		{ id: 0, label: this.props.t("map.themes.0") },
		{ id: 1, label: this.props.t("map.themes.1") },
		{ id: 2, label: this.props.t("map.themes.2") },
		{ id: 3, label: this.props.t("map.themes.3") },
		{ id: 4, label: this.props.t("map.themes.4") },
		{ id: 5, label: this.props.t("map.themes.5") },
		{ id: 6, label: this.props.t("map.themes.6") },
		{ id: 7, label: this.props.t('map.themes.7') }
	]

	handleVisibility = e => (event) => {
		if (event)
			event.preventDefault()
		this.props.changeMapTheme(e)
		this.setState({ actionAnchorVisibility: null })
	}
	handleSaveEditAddress = async () => {
		let device = this.state.markers[0]
		delete device['weather']
		//obsolete, will be removed in future version
		device.project = {
			id: 0
		}
		let saved = await updateDevice(device)
		if (saved)
			this.props.reload(5)//msgId = 5 - Device Updated
		else {
			this.setState({ error: true })
		}
	}
	handleOpenMenu = e => {
		this.setState({ actionAnchorVisibility: e.currentTarget })
	}
	handleCloseMenu = e => {
		this.setState({ actionAnchorVisibility: null })
	}
	handleEditLocation = () => {
		this.setState({ editLocation: !this.state.editLocation })
	}
	handleCancelConfirmEditLocation = () => {
		this.setState({
			openModalEditLocation: false
		})
	}
	handleCancelEditLocation = () => {
		this.setState({
			editLocation: false,
			markers: [{ ...this.props.device, weather: this.props.weather }]
		})
	}
	handleOpenConfirmEditLocation = () => {
		this.setState({
			openModalEditLocation: true
		})
	}
	renderMenu = () => {
		const { t, mapTheme, device } = this.props
		const { actionAnchorVisibility } = this.state
		return <Fragment>
			{device && <Collapse in={this.state.editLocation}>
				<ItemG container>
					<ItemG>
						<IconButton onClick={this.handleOpenConfirmEditLocation}>
							<Save style={{ color: teal[500] }} />
						</IconButton>
					</ItemG>
					<ItemG>
						<IconButton onClick={this.handleCancelEditLocation}>
							<Clear style={{ color: red[400] }} />
						</IconButton>
					</ItemG>
				</ItemG>
			</Collapse>}
			<ItemG>
				<IconButton title={'Map layer'} variant={'fab'} onClick={this.handleOpenMenu}>
					<Layers />
				</IconButton>
				<Menu
					id='long-menu2'
					anchorEl={actionAnchorVisibility}
					open={Boolean(actionAnchorVisibility)}
					onClose={this.handleCloseMenu}
					PaperProps={{
						style: {
							minWidth: 250
						}
					}}>
					{this.visibilityOptions.map(op => {
						return <MenuItem key={op.id} value={op.id} button onClick={this.handleVisibility(op.id)} selected={mapTheme === op.id ? true : false}>
							{op.label}
						</MenuItem>
					})}
					{/* </List> */}
				</Menu>
			</ItemG>

			<Dropdown menuItems={
				[
					{ label: t('actions.heatMap'), selected: this.props.heatMap, icon: <WhatsHot style={{ padding: "0px 12px" }} />, func: () => this.props.changeHeatMap(!this.props.heatMap) },
					{ label: t('actions.goToDevice'), icon: <Smartphone style={{ padding: "0px 12px" }} />, func: () => this.flyToMarkers() },
					{ dontShow: device ? false : true, label: t('actions.editLocation'), selected: this.state.editLocation, icon: <EditLocation style={{ padding: '0px 12px' }} />, func: () => this.handleEditLocation() }]
			} />

		</Fragment>
	}
	getRef = (r) => {
		this.map = r
	}
	flyToMarkers = () => {
		const { markers } = this.state
		if (this.map) {
			this.map.leafletElement.flyToBounds(markers.map(d => d.lat && d.long ? [d.lat, d.long] : null))
		}
	}
	getLatLngFromMap = async (e) => {
		let lat = e.target._latlng.lat
		let long = e.target._latlng.lng
		let address = await getAddressByLocation(lat, long)
		let addressStr = address.vejnavn + ' ' + address.husnr + ', ' + address.postnr + ' ' + address.postnrnavn
		this.setState({
			markers: [{
				...this.state.markers[0],
				address: addressStr,
				lat,
				long,
				weather: this.props.weather
			}]
		})
	}
	handleChangeAddress = e => {
		this.setState({
			markers: [{
				...this.state.markers[0],
				address: e
			}]
		})
	}
	renderModal = () => {
		const { t, loading } = this.props
		const { openModalEditLocation, markers, error } = this.state
		console.log(markers, loading)
		return <Dialog
			onClose={this.handleCancelConfirmEditLocation}
			open={openModalEditLocation}
			PaperProps={{
				style: {
					overflowY: "visible"
				}
			}}
		>
			<DialogTitle> </DialogTitle>
			<DialogContent style={{ overflowY: "visible" }}>
				{error ? <Danger>{t('404.networkError')}</Danger> : null}
				{markers.length > 0 ? markers.map(m =>
					<ItemG key={m.id} container direction={'column'}>
						<TextF id={'lat'} label={'Latitude'} value={m.lat ? m.lat.toString() : ""} disabled />
						<TextF id={'long'} label={'Longitude'} value={m.long ? m.long.toString() : ""} disabled />
						<AddressInput value={m.address} handleChange={this.handleChangeAddress} />
					</ItemG>) : null
				}
			</DialogContent>
			<DialogActions>
				<Button onClick={this.handleSaveEditAddress}>
					<Save /> {t('actions.save')}
				</Button>
				<Button onClick={this.handleCancelConfirmEditLocation}>
					<Clear /> {t('actions.cancel')}
				</Button>
			</DialogActions>
		</Dialog>
	}
	render() {
		const { device, t, loading, mapTheme, heatMap } = this.props
		return (
			<InfoCard
				noPadding
				noHiddenPadding
				title={t('devices.cards.map')}
				subheader={device ? `${t('devices.fields.coordsW', { lat: device.lat, long: device.long })}, Heatmap ${heatMap ? t('actions.on') : t('actions.off')}` : null}
				avatar={<Map />}
				topAction={this.renderMenu()}
				hiddenContent={
					loading ? <CircularLoader /> :
						<Grid container justify={'center'}>
							{device ? this.renderModal() : false}
							{this.state.markers.length > 0 ?
								<OpenStreetMap
									calibrate={this.state.editLocation}
									getLatLng={this.getLatLngFromMap}
									iRef={this.getRef}
									mapTheme={mapTheme}
									heatMap={heatMap}
									heatData={this.state.markers}
									t={t}
									markers={this.state.markers}
								/> : <Caption>{t('devices.notCalibrated')}</Caption>}
						</Grid>
				} />

		)
	}
}
const mapStateToProps = (state) => ({
	mapTheme: state.appState.mapTheme ? state.appState.mapTheme : state.settings.mapTheme,
	heatMap: state.appState.heatMap ? state.appState.heatMap : false
})

const mapDispatchToProps = (dispatch) => ({
	changeMapTheme: (value) => dispatch(changeMapTheme(value)),
	changeHeatMap: (value) => dispatch(changeHeatMap(value))
})

export default connect(mapStateToProps, mapDispatchToProps)(MapCard)