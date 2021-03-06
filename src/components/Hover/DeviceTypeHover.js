import React, { useEffect, Fragment } from 'react'
import { Popper, Paper, Fade, Divider, Button, IconButton, Tooltip } from '@material-ui/core';
import T from 'components/Typography/T';
import ItemG from 'components/Grid/ItemG';
// import Gravatar from 'react-gravatar'
import { Star, StarBorder, /* SignalWifi2Bar, */ Memory, Business, /* LibraryBooks, DataUsage, Business */ } from 'variables/icons'
// import withLocalization from 'components/Localization/T';
import { Link } from 'react-router-dom'
import { useSelector, useDispatch } from 'react-redux'
import { isFav, removeFromFav, finishedSaving, addToFav } from 'redux/favorites';
// import withSnackbar from 'components/Localization/S';
import hoverStyles from 'assets/jss/components/hover/hoverStyles'

import { CircularLoader } from 'components';
import { useLocalization, useSnackbar } from 'hooks';

// const mapStateToProps = (state) => ({
// 	saved: state.favorites.saved
// })

// const mapDispatchToProps = dispatch => ({
// 	isFav: (favObj) => dispatch(isFav(favObj)),
// 	addToFav: (favObj) => dispatch(addToFav(favObj)),
// 	removeFromFav: (favObj) => dispatch(removeFromFav(favObj)),
// 	finishedSaving: () => dispatch(finishedSaving())
// })

const DeviceTypeHover = props => {
	const classes = hoverStyles()
	const t = useLocalization()
	const s = useSnackbar().s
	const dispatch = useDispatch()
	const saved = useSelector(state => state.favorites.saved)

	useEffect(() => {
		if (saved === true) {
			const { devicetype } = props
			if (devicetype) {

				if (dispatch(isFav({ id: devicetype.uuid, type: 'devicetype' }))) {
					s('snackbars.favorite.saved', { name: devicetype.name, type: t('favorites.types.devicetype') })
					dispatch(finishedSaving())
				}
				if (!dispatch(isFav({ id: devicetype.uuid, type: 'devicetype' }))) {
					s('snackbars.favorite.removed', { name: devicetype.name, type: t('favorites.types.devicetype') })
					dispatch(finishedSaving())
				}
			}
		}
	}, [dispatch, props, s, saved, t])
	// componentDidUpdate = () => {
	// 	if (this.props.saved === true) {
	// 		const { devicetype } = this.props
	// 		if (devicetype) {

	// 			if (this.props.isFav({ id: devicetype.uuid, type: 'devicetype' })) {
	// 				this.props.s('snackbars.favorite.saved', { name: devicetype.name, type: this.props.t('favorites.types.devicetype') })
	// 				this.props.finishedSaving()
	// 			}
	// 			if (!this.props.isFav({ id: devicetype.uuid, type: 'devicetype' })) {
	// 				this.props.s('snackbars.favorite.removed', { name: devicetype.name, type: this.props.t('favorites.types.devicetype') })
	// 				this.props.finishedSaving()
	// 			}
	// 		}
	// 	}
	// }
	const addToFavorites = () => {
		const { devicetype } = props
		let favObj = {
			id: devicetype.uuid,
			name: devicetype.name,
			type: 'devicetype',
			path: `/devicetype/${devicetype.uuid}`
		}
		dispatch(addToFav(favObj))
	}
	const removeFromFavorites = () => {
		const { devicetype } = props
		let favObj = {
			id: devicetype.uuid,
			name: devicetype.name,
			type: 'devicetype',
			path: `/devicetype/${devicetype.uuid}`
		}
		dispatch(removeFromFav(favObj))

	}
	const handleClose = () => {
		props.handleClose()
	};

	// const renderIcon = (status) => {
	// 	const { classes } = props
	// 	switch (status) {
	// 		case 1:
	// 			return <SignalWifi2Bar className={classes.yellowSignal + ' ' + classes.smallIcon} />
	// 		case 2:
	// 			return <SignalWifi2Bar className={classes.greenSignal + ' ' + classes.smallIcon} />
	// 		case 0:
	// 			return <SignalWifi2Bar className={classes.redSignal + ' ' + classes.smallIcon} />
	// 		case null:
	// 			return <SignalWifi2Bar className={classes.smallIcon} />
	// 		default:
	// 			break;
	// 	}
	// }

	const { anchorEl, devicetype } = props
	return (
		<Popper
			style={{ zIndex: 1040 }}
			disablePortal
			id="simple-popover"
			open={Boolean(anchorEl)}
			anchorEl={anchorEl}
			onClose={handleClose}
			placement={'top-start'}
			onMouseLeave={handleClose}
			transition
		>
			{({ TransitionProps }) => (
				<Fade {...TransitionProps} timeout={250}>
					<Paper className={classes.paper}>
						{devicetype !== null ?
							<Fragment>
								<ItemG container style={{ margin: "8px 0" }}>
									<ItemG xs={3} container justify={'center'} alignItems={'center'}>
										<Memory className={classes.img} />
									</ItemG>
									<ItemG xs={9} container justify={'center'}>
										<ItemG xs={12}>
											<T variant={'h6'} style={{ textOverflow: 'ellipsis', whiteSpace: 'nowrap', overflow: 'hidden' }}>
												{devicetype.name}
											</T>
										</ItemG>
									</ItemG>
								</ItemG>
								<ItemG xs={12} className={classes.middleContainer}>
									<ItemG xs={12}>
										<T className={classes.smallText} paragraph={false}>
											<Business className={classes.smallIcon} />
											{devicetype.org.name}
										</T>
									</ItemG>
								</ItemG>
								<Divider />
								<ItemG container style={{ marginTop: '8px' }}>
									<ItemG>
										<Button color={'primary'} variant={'text'} component={Link} to={{ pathname: `/devicetype/${devicetype.uuid}/edit`, prevURL: '/devicetypes' }}>
											{t('menus.edit')}
										</Button>
									</ItemG>
									<ItemG container style={{ flex: 1, justifyContent: 'flex-end' }}>
										<Tooltip placement="top" title={dispatch(isFav({ id: devicetype.uuid, type: 'devicetype' })) ? t('menus.favorites.remove') : t('menus.favorites.add')}>
											<IconButton className={classes.smallAction} onClick={dispatch(isFav({ id: devicetype.uuid, type: 'devicetype' })) ? removeFromFavorites : addToFavorites}>
												{dispatch(isFav({ id: devicetype.uuid, type: 'devicetype' })) ? <Star /> : <StarBorder />}
											</IconButton>
										</Tooltip>
									</ItemG>
								</ItemG>
							</Fragment>
							: <CircularLoader fill />}
					</Paper>
				</Fade>
			)}
		</Popper>
	)
}

export default DeviceTypeHover
