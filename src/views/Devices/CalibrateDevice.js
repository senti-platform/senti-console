import React, { Component, Fragment } from 'react'
import { Paper, Typography, Button, StepContent, StepLabel, Step, Stepper, withStyles, Grid, TextField, FormControl, InputLabel, Select, Input, MenuItem, FormHelperText } from '@material-ui/core';
import { ItemGrid, Info, Danger } from 'components'
import { getDevice, calibrateDevice, uploadPictures } from 'variables/dataDevices'
import Caption from 'components/Typography/Caption'
import CounterModal from 'components/Devices/CounterModal'
import ImageUpload from './ImageUpload'
import { NavigateNext, NavigateBefore, Done, Restore, MyLocation, Router, Devices } from 'variables/icons'
import GridContainer from 'components/Grid/GridContainer';
import { PlacesWithStandaloneSearchBox } from 'components/Map/SearchBox'
import { CalibrateMap } from 'components/Map/CalibrateMaps';
import { isFav, updateFav } from 'redux/favorites';
import { connect } from 'react-redux'
import TimeCounterModal from 'components/Devices/TimeCounterModal';

const styles = theme => ({
	button: {
		marginTop: theme.spacing.unit,
		marginRight: theme.spacing.unit,
	},
	actionsContainer: {
		marginTop: theme.spacing.unit * 2,
		// marginBottom: theme.spacing.unit * 2,
	},
	resetContainer: {
		padding: theme.spacing.unit * 3,
	},
	input: {
		minWidth: 300
	},
	latlong: {
		margin: theme.spacing.unit * 2 + 'px 0px'
	},
	buttonMargin: {
		margin: theme.spacing.unit
	},
	iconButton: {
		marginRight: theme.spacing.unit
	},
	iconButtonRight: {
		marginLeft: theme.spacing.unit
	},
	paper: {
		width: '100%',
		margin: '8px',
		borderRadius: '3px',
		overflow: 'hidden'
	}
});

class CalibrateDevice extends Component {
	constructor(props) {
		super(props)
		this.state = {
			activeStep: 0,
			name: '',
			description: '',
			device: null,
			error: false,
			lat: 0,
			long: 0,
			calibration: {
				startDate: null,
				endDate: null,
				count: 0,
				timer: 0,
			},
			images: null,
			locationType: 0,
			address: ''
		}
		props.setHeader( { id: 'calibration.header', options: { deviceId: props.match.params.id } }, true, `/device/${props.match.params.id}`, 'devices')
	}
	componentDidMount = async () => {
		if (this.props.match) {
			let id = this.props.match.params.id
			if (id)
				await getDevice(id).then(rs => {
					if (rs === null)
						this.props.history.push('/404')
					else {
						this.setState({
							device: rs,
							loading: false,
							lat: rs.lat,
							long: rs.long,
							locationType: rs.locationType,
							address: rs.address,
							name: rs.name ? rs.name : '',
							description: rs.description ? rs.description : '',
						})
					}
				})
		}
		else {
			this.props.history.push('/404')
		}
	}

	getSteps() {
		const { t } = this.props
		return [t('calibration.stepheader.name'),
			t('calibration.stepheader.location'),
			t('calibration.stepheader.calibration'),
			t('calibration.stepheader.images')]
	}

	getStepContent(step) {
		const { t } = this.props
		switch (step) {
			case 0:
				return t('calibration.steps.0')
			case 1:
				return t('calibration.steps.1')
			case 2:
				return t('calibration.steps.2')
			case 3:
				return t('calibration.steps.3')
			default:
				return t('calibration.steps.unknown')
		}
	}

	getCoords = () => {
		if (navigator.geolocation) {
			navigator.geolocation.getCurrentPosition(rs => {
				let lat = rs.coords.latitude
				let long = rs.coords.longitude
				this.setState({ lat, long, error: false })
			}, err => { this.setState({ error: err }) })
		}
	}

	uploadImgs = async () => {
		let success = false
		if (this.state.images) {
			success = await uploadPictures({
				id: this.state.device.id,
				files: this.state.images,
				// step: 3
			}).then(rs => rs)
		}
		return success
	}

	getImages = (imgs) => {
		this.setState({ images: imgs })
	}
	handleInput = (input) => e => {
		this.setState({ [input]: e.target.value })
	}
	handleCalibration = (result) => {
		this.setState({
			...this.state,
			calibration: {
				startDate: result.timestamp,
				endDate: result.timestampFinish,
				count: result.count,
				timer: result.timer
			}
		})
	}

	LocationTypes = () => {
		const { t } = this.props
		return [
			{ id: 1, label: t('devices.locationTypes.pedStreet') },
			{ id: 2, label: t('devices.locationTypes.park') },
			{ id: 3, label: t('devices.locationTypes.path') },
			{ id: 4, label: t('devices.locationTypes.square') },
			{ id: 5, label: t('devices.locationTypes.crossroads') },
			{ id: 6, label: t('devices.locationTypes.road') },
			{ id: 7, label: t('devices.locationTypes.motorway') },
			{ id: 8, label: t('devices.locationTypes.port') },
			{ id: 9, label: t('devices.locationTypes.office') },
			{ id: 0, label: t('devices.locationTypes.unspecified') }]
	}

	handleLocationTypeChange = (e) => {
		this.setState({ locationType: e.target.value })
	}

	handleSetAddress = (e) => {
		this.setState({ address: e })
	}

	renderDeviceNameDescriptionForms = () => {
		const { classes, t } = this.props
		return <Grid container>
			<ItemGrid xs={12}>
				<TextField
					required={true}
					label={t('devices.fields.name')}
					onChange={this.handleInput('name')}
					value={this.state.name}
					InputProps={{
						classes: {
							root: classes.input
						}
					}}
				/>
			</ItemGrid>
			<ItemGrid xs={12}>
				<TextField
					multiline
					rows={4}
					label={t('devices.fields.description')}
					onChange={this.handleInput('description')}
					value={this.state.description}
					InputProps={{
						classes: {
							root: classes.input
						}
					}}
				/>
			</ItemGrid>
		</Grid>
	}
	getLatLngFromMap = (e) => {
		
		this.setState({
			lat: e.lat,
			long: e.long
		})
	}
	renderDeviceLocation = () => {
		const { t } = this.props
		return <Grid container>
			<ItemGrid xs={12}>
				<div style={{ maxHeight: 400 }}>

					<CalibrateMap
						onClick={this.getLatLngFromMap}
					/>
				</div>
				<PlacesWithStandaloneSearchBox address={this.state.address} handleChange={this.handleSetAddress} t={t}/>
			</ItemGrid>
			<ItemGrid xs={12}>
				<FormControl className={this.props.classes.formControl}>
					<InputLabel htmlFor='streetType-helper'>{this.state.locationType ? '' : t('devices.fields.locType')}</InputLabel>
					<Select
						value={this.state.locationType}
						onChange={this.handleLocationTypeChange}
						input={<Input name='streetType' id='streetType-helper' />}
					>
						{this.LocationTypes().map((loc, i) => {
							return <MenuItem key={i} value={loc.id}>
								{loc.label}
							</MenuItem>
						})}
					</Select>
					<FormHelperText>{t('calibration.selectLocationType')} {this.state.name ? this.state.name : this.state.id}</FormHelperText>
				</FormControl>
				<div className={this.props.classes.latlong}>
					<Caption>
						{t('devices.fields.lat')} &amp; {t('devices.fields.long')}
					</Caption>
					<Info>
						{this.state.lat + ' ' + this.state.long}
					</Info>
				</div>
				<Button
					variant='contained'
					color='primary'
					onClick={this.getCoords}
					className={this.props.classes.button}
				> <MyLocation className={this.props.classes.iconButton} />{t('actions.getLocation')}</Button>
			</ItemGrid>
		</Grid>
	}

	renderCalibration = () => {
		const { calType, t } = this.props
		return calType ? <CounterModal t={t} handleFinish={this.handleCalibration} /> : <TimeCounterModal t={t} handleFinish={this.handleCalibration}/>
	}

	renderImageUpload = () => {
		return <ImageUpload t={this.props.t} imgUpload={this.getImages} dId={this.state.device.id}/>
	}

	renderStep = (step) => {
		switch (step) {
			case 0:
				return this.renderDeviceNameDescriptionForms()
			case 1:
				return this.renderDeviceLocation()
			case 2:
				return this.renderCalibration()
			case 3:
				return this.renderImageUpload()
			default:
				break;
		}
	}

	updateDevice = async () => {
		const { name, description } = this.state
		const { lat, long, device, locationType, address } = this.state
		const { startDate, endDate, count, timer } = this.state.calibration
		var success = await calibrateDevice({
			id: device.id,
			name: name,
			description: description,
			address: address,
			lat: lat,
			long: long,
			locationType: locationType,
			startDate: startDate,
			endDate: endDate,
			count: count,
			timer: timer
		})
		return success
	}

	handleNext = async () => {
		const { activeStep } = this.state
		if (activeStep === 3) {
			let success = await this.updateDevice()
			if (success)
				this.setState({
					activeStep: activeStep + 1,
				});
			else {
				this.setState({ error: { message: this.props.t('404.networkError') } })
			}

		}	
		else {
			this.setState({
				activeStep: activeStep + 1,
			});
		}

	}


	handleBack = () => {
		this.setState({
			activeStep: this.state.activeStep - 1,
		})
	}

	handleGoToDeviceList = () => {
		this.handleFav()
		this.props.history.push('/devices')
	}
	handleFav = () => {
		const { isFav, updateFav } = this.props
		const { name } = this.state
		const { device } = this.state
		let favObj = {
			id: device.id,
			name: name,
			type: 'device',
			path: `/device/${device.id}`
		}
		if (isFav(favObj)) {
			updateFav(favObj)
		}
	}
	handleFinish = () => {
		this.handleFav()
		this.props.history.push('/device/' + this.state.device.id)
	}

	handleReset = () => {
		this.setState({
			activeStep: 0,
		})
	}

	stepChecker = () => {
		/**
		 * Return false to NOT disable the Next Step Button
		 */
		const { activeStep, lat, long, name, calibration, address } = this.state;
		switch (activeStep) {
			case 0:
				return name.length > 0 ? false : true
			case 1:
				return lat > 0 && long > 0 && address ? false : true
			case 2:
				return calibration.startDate && calibration.endDate && calibration.timer ? false : true
			default:
				break;
		}
	}

	render() {
		const { t, classes } = this.props;
		const steps = this.getSteps();
		const { activeStep, device, error } = this.state;
		return (
			<GridContainer>

				<Paper classes={{ root: classes.paper }}>
					{device ?
						<Stepper activeStep={activeStep} orientation='vertical' >
							{steps.map((label, index) => {
								return (
									<Step key={label}>
										<StepLabel>{label}</StepLabel>
										<StepContent>
											<Typography paragraph>{this.getStepContent(index)}</Typography>
											{/* <Divider/> */}

											<Grid>
												{error ? <Danger >{error.message}</Danger> : null}
												{this.renderStep(index)}
											</Grid>
											<div className={classes.actionsContainer}>
												<Grid container>
													<Button
														disabled={activeStep === 0}
														onClick={this.handleBack}
														className={classes.button}
													>
														<NavigateBefore className={classes.iconButton} />{t('actions.back')}
													</Button>
													<Button
														variant='contained'
														color='primary'
														onClick={this.handleNext}
														className={classes.button}
														disabled={this.stepChecker()}
													>
														{activeStep === steps.length - 1 ? <Fragment>

															<Done className={classes.iconButton} />{t('actions.finish')}
														</Fragment> :
															<Fragment>
																<NavigateNext className={classes.iconButton} />{t('actions.next')}
															</Fragment>}
													</Button>
												</Grid>
											</div>
										</StepContent>
									</Step>
								);
							})}
						</Stepper> : null}
					{activeStep === steps.length && device && (
						<Paper square elevation={0} className={classes.resetContainer}>
							<Typography variant={'h6'}>{t('calibration.texts.success')}</Typography>
							<Typography paragraph>
								{t('calibration.texts.successMessage')}
							</Typography>
							<Grid container>
								<ItemGrid xs>
									<Button onClick={this.handleFinish} color={'primary'} variant={'contained'} className={classes.buttonMargin}>
										<Router className={classes.iconButton} />{t('actions.viewDevice')} {device.id}
									</Button>
									<Button onClick={this.handleGoToDeviceList} color={'primary'} variant={'contained'} className={classes.buttonMargin}>
										<Devices className={classes.iconButton} />{t('actions.viewDeviceList')}
									</Button>
								</ItemGrid>
								<ItemGrid xs>
									<Button onClick={this.handleReset} className={classes.button} >
										<Restore className={classes.iconButton} />{t('actions.reset')}
									</Button>
								</ItemGrid>
							</Grid>
						</Paper>
					)}
				</Paper>
			</GridContainer>
		)
	}
}
const mapStateToProps = (state) => ({
	calType: state.settings.calibration
})

const mapDispatchToProps = (dispatch) => ({
	isFav: (favObj) => dispatch(isFav(favObj)),
	updateFav: (favObj) => dispatch(updateFav(favObj))
})

export default connect(mapStateToProps, mapDispatchToProps)(withStyles(styles)(CalibrateDevice))