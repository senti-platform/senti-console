import React, { Component, Fragment } from 'react'
import { getAllPictures, deletePicture } from 'variables/dataDevices';
import { Grid, withStyles, Menu, MenuItem, IconButton, Modal, Dialog, DialogTitle, DialogContent, DialogContentText, DialogActions, Button } from '@material-ui/core';
import InfoCard from 'components/Cards/InfoCard';
import { Image,  MoreVert, CloudUpload, Delete } from 'variables/icons'
import deviceStyles from 'assets/jss/views/deviceStyles';
import DeviceImage from 'components/Devices/DeviceImage';
import CircularLoader from 'components/Loader/CircularLoader';
// import ImageUpload from '../ImageUpload';
import { ItemGrid, Caption } from 'components';
import DeviceImageUpload from '../ImageUpload';

class DeviceImages extends Component {
	constructor(props) {
		super(props)

		this.state = {
			activeStep: 0,
			img: null,
			actionAnchor: null,
			openImageUpload: false,
			openDeleteImage: false,
			deletingPicture: false,
			deleted: null,
			openSnackbar: 0
		}
	}

	handleStepChange = activeStep => {
		this.setState({ activeStep });
	};
	componentDidMount = async () => {
		await this.getAllPics(this.props.device.id)
	}
	getPicsCallBack = () => {
		this.getAllPics(this.props.device.id)
	}
	renderImageUpload = (dId) => {

		return <DeviceImageUpload
			t={this.props.t}
			dId={dId}
			imgUpload={this.getAllPics}
			callBack={this.getPicsCallBack}
		/>
	}
	getAllPics = (id) => {
		getAllPictures(id).then(rs => { return this.setState({ img: rs }) })
	}
	handleOpenActionsImages = e => {
		this.setState({ actionAnchor: e.currentTarget })
	}
	handleCloseActionsImages = e => {
		this.setState({ actionAnchor: null })
	}
	handleOpenImageUpload = () => {
		this.setState({ openImageUpload: true, actionAnchor: null })
	}
	handleOpenDeletePictureDialog = () => {
		this.setState({ openDeleteImage: true, actionAnchor: null })
	}
	handleCloseDeletePictureDialog = () => {
		this.setState({ openDeleteImage: false })
	}
	handleCloseImageUpload = () => {
		this.setState({ openImageUpload: false })
	}
	handleDeletePicture = async () => {
		const { img, activeStep } = this.state
		const dId = this.props.device.id
		this.setState({ deletingPicture: true })
		var deleted = await deletePicture(dId, img[activeStep].filename).then(rs => rs)
		if (deleted) {
			this.setState({ img: null, openDeleteImage: false, openSnackbar: 1 })
			this.getAllPics(dId)
		}
		else { 
			this.setState({ openSnackbar: 2, openDeleteImage: false })
		}
	}
	snackBarMessages = () => {
		const { s } = this.props
		let msg = this.state.openSnackbar
		switch (msg) {
			case 1:
				s("snackbars.pictureDeleted")
				break
			case 2:
				s("snackbars.pictureNotDeleted")
				break
			default:
				break;
		}
	}
	renderImageLoader = () => {
		return <CircularLoader notCentered />
	}
	renderDeleteDialog = () => {
		return <Dialog
			open={this.state.openDeleteImage}
			onClose={this.handleCloseImageDelete}
			aria-labelledby="alert-dialog-title"
			aria-describedby="alert-dialog-description"
		>
			<DialogTitle id="alert-dialog-title">Delete Picture</DialogTitle>
			<DialogContent>
				<DialogContentText id="alert-dialog-description">
					Are you sure you want to delete the picture?
				</DialogContentText>
			</DialogContent>
			<DialogActions>
				<Button onClick={this.handleCloseDeletePictureDialog} color="primary">
					No
				</Button>
				<Button onClick={this.handleDeletePicture} color="primary" autoFocus>
					Yes
				</Button>
			</DialogActions>
		</Dialog>
	}

	
	render() {
		const { actionAnchor, openImageUpload, img } = this.state
		const { classes, device, t  } = this.props
		return (
			<InfoCard
				title={t("devices.cards.pictures")}
				avatar={<Image />}
				topAction={
					<ItemGrid>
						<IconButton
							aria-label="More"
							aria-owns={actionAnchor ? 'long-menu' : null}
							aria-haspopup="true"
							onClick={this.handleOpenActionsImages}>
							<MoreVert />
						</IconButton>
						<Menu
							id="long-menu"
							anchorEl={actionAnchor}
							open={Boolean(actionAnchor)}
							onClose={this.handleCloseActionsImages}
							PaperProps={{
								style: {
									maxHeight: 200,
									minWidth: 200
								}
							}}>
							<MenuItem onClick={this.handleOpenImageUpload}>
								<CloudUpload className={classes.leftIcon} />{t("actions.uploadImages")}
							</MenuItem>
							<MenuItem onClick={this.handleOpenDeletePictureDialog}>
								<Delete className={classes.leftIcon} />{t("actions.deletePicture")}
							</MenuItem>
							))}
						</Menu>
					</ItemGrid>
				}
				noExpand
				content={
					<Fragment>
						{img !== null ? img !== 0 ?
							<Fragment>
								{this.renderDeleteDialog()}
								<Grid container justify={'center'}>
									<DeviceImage
										t={this.props.t}
										useParent
										handleStep={this.handleStepChange}
										images={img ? img.map(m => m.image) : null} />
								</Grid>
							</Fragment>
							: <Grid container justify={'center'}> <Caption>{t("devices.noImages")}</Caption></Grid> : this.renderImageLoader()}
						<Modal
							aria-labelledby="simple-modal-title"
							aria-describedby="simple-modal-description"
							open={openImageUpload}
							onClose={this.handleCloseImageUpload}>
							<div className={classes.modal}>
								{this.renderImageUpload(device.id)}
							</div>
						</Modal>
					</Fragment>}
			/>
		)
	}
}
export default withStyles(deviceStyles)(DeviceImages)