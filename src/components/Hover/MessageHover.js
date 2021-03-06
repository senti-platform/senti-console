import React, { useEffect, Fragment } from 'react'
import { Popper, Paper, Fade, /* Divider, Button, IconButton, Tooltip */ } from '@material-ui/core';
// import T from 'components/Typography/T';
// import ItemG from 'components/Grid/ItemG';
// import Gravatar from 'react-gravatar'
import { /* Language,  Star, StarBorder,*/ SignalWifi2Bar, /* LibraryBooks, DataUsage, Business */ } from 'variables/icons';
// import withLocalization from 'components/Localization/T';
// import { Link } from 'react-router-dom'
import { useSelector, useDispatch } from 'react-redux'
import { isFav, removeFromFav, finishedSaving, addToFav } from 'redux/favorites';
// import withSnackbar from 'components/Localization/S';
import hoverStyles from 'assets/jss/components/hover/hoverStyles'

import { CircularLoader } from 'components';
import { useSnackbar, useLocalization } from 'hooks';

// const mapStateToProps = (state) => ({
// 	saved: state.favorites.saved
// })

// const mapDispatchToProps = dispatch => ({
// 	isFav: (favObj) => dispatch(isFav(favObj)),
// 	addToFav: (favObj) => dispatch(addToFav(favObj)),
// 	removeFromFav: (favObj) => dispatch(removeFromFav(favObj)),
// 	finishedSaving: () => dispatch(finishedSaving())
// })

const MessageHover = props => {
	const classes = hoverStyles()
	const t = useLocalization()
	const s = useSnackbar().s
	const dispatch = useDispatch()
	const saved = useSelector(state => state.favorites.saved)

	useEffect(() => {
		if (saved === true) {
			const { message } = props
			if (message) {

				if (dispatch(isFav({ id: message.id, type: 'message' }))) {
					s('snackbars.favorite.saved', { name: message.name, type: t('favorites.types.message') })
					dispatch(finishedSaving())
				}
				if (!dispatch(isFav({ id: message.id, type: 'message' }))) {
					s('snackbars.favorite.removed', { name: message.name, type: t('favorites.types.message') })
					dispatch(finishedSaving())
				}
			}
		}
	}, [dispatch, props, s, saved, t])
	// componentDidUpdate = () => {
	// 	if (this.props.saved === true) {
	// 		const { message } = this.props
	// 		if (message) {

	// 			if (this.props.isFav({ id: message.id, type: 'message' })) {
	// 				this.props.s('snackbars.favorite.saved', { name: message.name, type: this.props.t('favorites.types.message') })
	// 				this.props.finishedSaving()
	// 			}
	// 			if (!this.props.isFav({ id: message.id, type: 'message' })) {
	// 				this.props.s('snackbars.favorite.removed', { name: message.name, type: this.props.t('favorites.types.message') })
	// 				this.props.finishedSaving()
	// 			}
	// 		}
	// 	}
	// }

	const addToFavorites = () => {
		const { message } = props
		let favObj = {
			id: message.id,
			name: message.name,
			type: 'message',
			path: `/message/${message.id}`
		}
		dispatch(addToFav(favObj))
	}

	const removeFromFavorites = () => {
		const { message } = props
		let favObj = {
			id: message.id,
			name: message.name,
			type: 'message',
			path: `/message/${message.id}`
		}
		dispatch(removeFromFav(favObj))

	}
	const handleClose = () => {
		props.handleClose()
	};

	const renderIcon = (status) => {
		const { classes } = props
		switch (status) {
			case 1:
				return <SignalWifi2Bar className={classes.yellowSignal + ' ' + classes.smallIcon} />
			case 2:
				return <SignalWifi2Bar className={classes.greenSignal + ' ' + classes.smallIcon} />
			case 0:
				return <SignalWifi2Bar className={classes.redSignal + ' ' + classes.smallIcon} />
			case null:
				return <SignalWifi2Bar className={classes.smallIcon} />
			default:
				break;
		}
	}

	const { /* t, */ anchorEl, message, /* isFav */ } = props
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
						{message !== null ?
							<Fragment>
								{/* <ItemG container style={{ margin: "8px 0" }}>
										<ItemG xs={3} container justify={'center'} alignItems={'center'}>
											<DataUsage className={classes.img} />
										</ItemG>
										<ItemG xs={9} container justify={'center'}>
											<ItemG xs={12}>
												<T variant={'h6'} style={{ textOverflow: 'ellipsis', whiteSpace: 'nowrap', overflow: 'hidden' }}>
													{message.name}
												</T>
											</ItemG>
											<ItemG xs={12}>
												<T className={classes.smallText} paragraph={false}>{`${message.id}`}</T>
											</ItemG>
										</ItemG>
									</ItemG>
									<ItemG xs={12} className={classes.middleContainer}>
										<ItemG xs={12}>
											<T className={classes.smallText} paragraph={false}>
												<Business className={classes.smallIcon} />
												{`${message.org.name ? message.org.name : t('devices.fields.free')}`}
											</T>
										</ItemG>
										<ItemG xs={12}>
											<T className={classes.smallText}>
												{this.renderIcon(message.activeDeviceStats ? message.activeDeviceStats.state : null)}
												{message.activeDeviceStats ?
													<Link to={{ pathname: `/device/${message.activeDeviceStats.id}`, prevURL: '/messages' }}>
														{message.activeDeviceStats.id}
													</Link>
													: t('no.device')}
											</T>
										</ItemG>
										<ItemG xs={12}>
											<T className={classes.smallText}>
												<LibraryBooks className={classes.smallIcon} />
												{message.project.title ? <Link to={{ pathname: `/project/${message.project.id}`, prevURL: '/messages' }}>
													{message.project.title}
												</Link> : t('no.project')}
											</T>
										</ItemG>

									</ItemG>
									<Divider />
									<ItemG container style={{ marginTop: '8px' }}>
										<ItemG>
											<Button color={'primary'} variant={'text'} component={Link} to={{ pathname: `/message/${message.id}/edit`, prevURL: '/messages' }}>
												{t('menus.edit')}
											</Button>
										</ItemG>
										<ItemG container style={{ flex: 1, justifyContent: 'flex-end' }}>
											<Tooltip placement="top" title={isFav({ id: message.id, type: 'message' }) ? t('menus.favorites.remove') : t('menus.favorites.add')}>
												<IconButton className={classes.smallAction} onClick={isFav({ id: message.id, type: 'message' }) ? this.removeFromFav : this.addToFav}>
													{isFav({ id: message.id, type: 'message' }) ? <Star /> : <StarBorder />}
												</IconButton>
											</Tooltip>
										</ItemG>
									</ItemG> */}
							</Fragment>
							: <CircularLoader fill />}
					</Paper>
				</Fade>
			)}
		</Popper>
	)
}

export default MessageHover
