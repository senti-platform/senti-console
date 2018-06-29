import React, { Component, Fragment } from 'react'
import { getDevice, getAllPictures } from 'variables/data';
import { CircularProgress, Grid, Typography, withStyles, Button, IconButton, Menu, MenuItem } from '@material-ui/core';
import moment from 'moment'
import { ItemGrid, Warning, P } from 'components';
import InfoCard from 'components/Cards/InfoCard';
import { SignalWifi2Bar, SignalWifi2BarLock, MoreVert, Build, LibraryBooks, Edit, Devices, DeveloperBoard, Image } from '@material-ui/icons'
import { ConvertDDToDMS } from 'variables/functions'
import { Link } from 'react-router-dom'
import deviceStyles from 'assets/jss/views/deviceStyles';
import SmallInfo from 'components/Card/SmallInfo';
import AssignProject from 'components/Devices/AssignProject';
import DeviceImage from 'components/Devices/DeviceImage';


const Caption = (props) => <Typography variant={"caption"}>{props.children}</Typography>
const Info = (props) => <Typography paragraph classes={props.classes}>{props.children}</Typography>

class Device extends Component {
	constructor(props) {
		super(props)

		this.state = {
			device: null,
			loading: true,
			anchorEl: null,
			openAssign: false,
			img: null
		}
		props.setHeader(<CircularProgress size={30} />)
	}
	componentDidMount = async () => {
		if (this.props.match) {
			let id = this.props.match.params.id
			if (id)
			{await getDevice(id).then(rs => {
				if (rs === null)
					this.props.history.push('/404')
				else {
					this.setState({ device: rs, loading: false })
					this.props.setHeader(rs.device_name ? rs.device_name : rs.device_id)
				}
			})
			await getAllPictures(id).then(rs => this.setState({ img: rs }))}
		}
		else {
			this.props.history.push('/404')
		}
	}
	handleOpenAssign = () => {
		this.setState({ openAssign: true, anchorEl: null })
	}
	handleCloseAssign =async (reload) => {
		if (reload)
		{
			this.setState({ loading: true })
			this.componentDidMount()
		}
		this.setState({ openAssign: false })
	}
	filterItems = (projects, keyword) => {

		var searchStr = keyword.toLowerCase()
		var arr = projects
		if (arr[0] === undefined)
			return []
		var keys = Object.keys(arr[0])
		var filtered = arr.filter(c => {
			var contains = keys.map(key => {
				if (c[key] === null)
					return searchStr === "null" ? true : false
				if (c[key] instanceof Date) {
					let date = moment(c[key]).format("DD.MM.YYYY")
					return date.toLowerCase().includes(searchStr)
				}
				else
					return c[key].toString().toLowerCase().includes(searchStr)
			})
			return contains.indexOf(true) !== -1 ? true : false
		})
		return filtered
	}
	renderLoader = () => {
		return <Grid container justify={'center'}><CircularProgress /></Grid>
	}

	handleClick = event => {
		this.setState({ anchorEl: event.currentTarget });
	};

	handleClose = () => {
		this.setState({ anchorEl: null });
	};
	renderStatus = (status) => {
		const { classes } = this.props


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
					<Typography paragraph>
						Error
					</Typography>
				</div>
			default:
				break;
		}
	}
	render() {
		const { device, loading, anchorEl } = this.state
		const { classes } = this.props
		return (
			!loading ?
				<Grid container justify={'center'} alignContent={'space-between'} spacing={8}>
					<AssignProject device_id={this.state.device.device_id} open={this.state.openAssign} handleClose={this.handleCloseAssign} />
					
					<ItemGrid xs={12}>
						<InfoCard
							title={
								<Fragment>
									<Grid container justify={'space-between'} className={classes.typoNoMargin}>
										<Typography paragraph className={classes.typoNoMargin}>
											Device Details
										</Typography>
										<ItemGrid>
											<IconButton
												aria-label="More"
												aria-owns={anchorEl ? 'long-menu' : null}
												aria-haspopup="true"
												onClick={this.handleClick}>
												<MoreVert />
											</IconButton>
											<Menu
												id="long-menu"
												anchorEl={anchorEl}
												open={Boolean(anchorEl)}
												onClose={this.handleClose}
												PaperProps={{
													style: {
														maxHeight: 200,
														minWidth: 200
													}
												}}>
												<MenuItem onClick={() => this.props.history.push(`${this.props.match.url}/setup`)}>
													<Build className={classes.leftIcon} />{!(device.lat > 0) && !(device.long > 0) ? "Manual Calibration" : "Recalibrate"}
												</MenuItem>
												<MenuItem onClick={this.handleOpenAssign}>
													<LibraryBooks className={classes.leftIcon} />Assign to {device.project ? "new Project" : "Project"}
												</MenuItem>
												<MenuItem onClick={this.handleClose}>
													<Edit className={classes.leftIcon} />Edit Details
												</MenuItem>
												))}
											</Menu>
										</ItemGrid>
									</Grid>
								</Fragment>} Build
							avatar={<Devices />}
							subheader={device.device_id}
							noExpand
							content={
								<Fragment>
									<Grid container>
										{!(device.lat > 0) && !(device.long > 0) &&
											<ItemGrid xs={12}>
												<Warning>
													<ItemGrid container xs={12}>
														<P>
															Device has not been manually calibrated!
														</P>
													</ItemGrid>
													<ItemGrid container xs={12}>
														<Button
															color={"default"}
															onClick={() => this.props.history.push(`${this.props.match.url}/setup`)}
															variant={"outlined"}>
															Manual Calibration
														</Button>
													</ItemGrid>
												</Warning>
											</ItemGrid>}
										<ItemGrid>
											<SmallInfo caption={"Name"} info={device.device_name ? device.device_name : "No name"} />
										</ItemGrid>
										<ItemGrid>
											<Caption>Status:</Caption>
											{this.renderStatus(device.liveStatus)}
										</ItemGrid>
										<ItemGrid>
											<Caption>Temperature:</Caption>
											<Info>
												{device.temperature} &#8451;
											</Info>
										</ItemGrid>
										<ItemGrid xs={12}>
											<Caption>Description:</Caption>
											<Info>{device.description ? device.description : ""}</Info>
										</ItemGrid>
									</Grid>
									<Grid container>
										<ItemGrid>
											<Caption>Address:</Caption>
											<Info>{device.address} </Info>
										</ItemGrid>
										<ItemGrid >
											<Caption>Location Type:</Caption>
											<Info>{device.locationType} </Info>
										</ItemGrid>
										<ItemGrid >
											<Caption>Coordinates:</Caption>
											<Info><a title={'Open link to Google Maps'} href={`https://www.google.com/maps/search/${device.lat}+${device.long}`} target={'_blank'}>
												{ConvertDDToDMS(device.lat, false) + " " + ConvertDDToDMS(device.long, true)}</a>
											</Info>
										</ItemGrid>
									</Grid>
									<Grid container>
										<ItemGrid>
											<Caption>Organisation:</Caption>
											<Info>{device.organisation ? device.organisation.vcName : "Unassigned"}</Info>
										</ItemGrid>
										<ItemGrid xs={4}>
											<Caption>Project:</Caption>
											<Info>{device.project ? <Link to={'/project/' + device.project.id}>{device.project.title}</Link> : "Unassigned"}</Info>
										</ItemGrid>
									</Grid>
								</Fragment>
							}
						/>
					</ItemGrid>
					<ItemGrid xs={12}>
						<InfoCard
							title={"Pictures"}
							avatar={<Image/>}
							// noAvatar
							noExpand
							content={this.state.img !== null ? <DeviceImage images={this.state.img} /> : this.renderLoader()}/>
					</ItemGrid>
					<ItemGrid xs={12}>
						<InfoCard
							title={"Hardware"}
							avatar={<DeveloperBoard />}
							subheader={''}
							content={
								<Grid container>
									<Grid container >
										<ItemGrid xs>
											<Caption>PC Model:</Caption>
											<Info>{device.RPImodel}</Info>
										</ItemGrid>
										<ItemGrid xs>
											<Caption>Memory:</Caption>
											<Info>{device.memory + " - " + device.memoryModel}</Info>
										</ItemGrid>
										<ItemGrid xs>
											<Caption>Power Adapter:</Caption>
											<Info>{device.adapter}</Info>
										</ItemGrid>
									</Grid>
									<Grid container>
										<ItemGrid xs>
											<Caption>Wifi Module:</Caption>
											<Info>{device.wifiModule}</Info>
										</ItemGrid>
										<ItemGrid xs>
											<Caption>Modem Model:</Caption>
											<Info>{device.modemModel}</Info>
										</ItemGrid>
									</Grid>
								</Grid>
							}
							hiddenContent={<Grid container>
								<ItemGrid>
									<Caption>Cell Number:</Caption>
									<Info>{device.cellNumber}</Info>
								</ItemGrid>
								<ItemGrid>
									<Caption>SIM Provider:</Caption>
									<Info>{device.SIMProvider}</Info>
								</ItemGrid>
								<ItemGrid>
									<Caption>SIM-Card ID</Caption>
									<Info>{device.SIMID}</Info>
								</ItemGrid>
								<ItemGrid>
									<Caption>Modem IMEI:</Caption>
									<Info>{device.modemIMEI}</Info>
								</ItemGrid>

							</Grid>
							}
						/>
					</ItemGrid>
					
				</Grid>
				: this.renderLoader()
		)
	}
}

export default withStyles(deviceStyles)(Device)
