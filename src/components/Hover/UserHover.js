import React, { useEffect } from 'react'
import { Popper, Paper, Fade, Divider, Button, IconButton, Tooltip } from '@material-ui/core'
import T from 'components/Typography/T'
import ItemG from 'components/Grid/ItemG'
import { Link } from 'components'
import Gravatar from 'react-gravatar'
import { Business, Call, LocationOn, Mail, Star, StarBorder, ContentCopy } from 'variables/icons'
import { useDispatch, useSelector } from 'react-redux'
import { isFav, removeFromFav, finishedSaving, addToFav } from 'redux/favorites'
import hoverStyles from 'assets/jss/components/hover/hoverStyles'
import { copyToClipboard } from 'variables/functions'
import { Link as RLink } from 'react-router-dom'
import { useSnackbar, useLocalization, useAuth } from 'hooks'


const UserHover = props => {
	//Hooks
	const classes = hoverStyles()
	const s = useSnackbar().s
	const t = useLocalization()
	const dispatch = useDispatch()
	const hasAccess = useAuth().hasAccess

	//Redux
	const saved = useSelector(state => state.favorites.saved)

	//State

	//Const

	//useCallbacks

	//useEffects
	useEffect(() => {
		if (saved === true) {
			const { user } = props
			if (user) {
				// let user = data[data.findIndex(d => d.id === selected[0])]
				if (dispatch(isFav({ id: user.uuid, type: 'user' }))) {
					s('snackbars.favorite.saved', { name: `${user.firstName} ${user.lastName}`, type: t('favorites.types.user') })
					dispatch(finishedSaving())
				}
				if (!dispatch(isFav({ id: user.uuid, type: 'user' }))) {
					s('snackbars.favorite.removed', { name: `${user.firstName} ${user.lastName}`, type: t('favorites.types.user') })
					dispatch(finishedSaving())
				}
			}
		}
	}, [dispatch, props, s, saved, t])

	//Handlers
	const addToFavorites = () => {
		const { user } = props
		let favObj = {
			id: user.uuid,
			name: `${user.firstName} ${user.lastName}`,
			type: 'user',
			path: `/management/user/${user.uuid}`
		}
		dispatch(addToFav(favObj))
	}
	const removeFromFavorites = () => {
		const { user } = props
		let favObj = {
			id: user.uuid,
			name: `${user.firstName} ${user.lastName}`,
			type: 'user',
			path: `/management/user/${user.uuid}`
		}
		dispatch(removeFromFav(favObj))

	}
	const handleClose = () => {
		props.handleClose()
	}
	const copyToClipboardFunc = (str) => () => {
		copyToClipboard(str)
	}
	const { anchorEl, user } = props
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

						<ItemG container style={{ margin: "8px 0" }}>
							<ItemG xs={3} container justify={'center'} alignItems={'center'}>
								<Gravatar size={50} default='mp' email={user.email} className={classes.img} />
							</ItemG>
							<ItemG xs={9} container justify={'center'}>
								<ItemG xs={12}>

									<T variant={'h6'} style={{ textOverflow: 'ellipsis', whiteSpace: 'nowrap', overflow: 'hidden' }}>
										{`${user.firstName} ${user.lastName}`}
									</T>
								</ItemG>
								<ItemG xs={12}>
									<T className={classes.smallText} paragraph={false}>
										{user.email}
										<Tooltip title={t('actions.copyToClipboard')}>
											<IconButton onClick={copyToClipboardFunc(user.email)} className={classes.copyButton}>
												<ContentCopy className={classes.copyIcon} />
											</IconButton>
										</Tooltip>
									</T>
								</ItemG>
								<ItemG xs={12}>
									<T className={classes.smallText} paragraph={false}>{user.phone ? user.phone : ""}</T>
								</ItemG>
							</ItemG>
						</ItemG>
						<ItemG container className={classes.middleContainer}>
							<ItemG xs={12}>
								<T className={classes.smallText}>
									<Business className={classes.smallIcon} />
									{user.org.name}
								</T>
							</ItemG>
							<ItemG xs={12}>
								{user.aux ? user.aux.senti ? user.aux.senti.extendedProfile ?
									user.aux.senti.extendedProfile.location ? <T className={classes.smallText}>
										<LocationOn className={classes.smallIcon} />
										{user.aux.senti.extendedProfile.location}
									</T> : null : null : null : null}
							</ItemG>
						</ItemG>
						<Divider />
						<ItemG container style={{ marginTop: '8px' }}>
							{hasAccess(user.uuid, 'user.modify') ? <ItemG>
								<Button color={'primary'} variant={'text'} component={RLink} to={{ pathname: `user/${user.uuid}/edit`, prevURL: '/management/users' }}>
									{t('menus.edit')}
								</Button>
							</ItemG> : null}
							<ItemG container style={{ flex: 1, justifyContent: 'flex-end' }}>
								<Tooltip placement="top" title={t('actions.sendEmail')}>
									<IconButton className={classes.smallAction}>
										<Link className={classes.smallActionLink} href={`mailto:${user.email}`}>
											<Mail />
										</Link>
									</IconButton>
								</Tooltip>
								<Tooltip placement="top" title={t('actions.call')}>
									<IconButton className={classes.smallAction}>
										<Link className={classes.smallActionLink} href={`tel:${user.phone}`}>
											<Call />
										</Link>
									</IconButton>
								</Tooltip>
								<Tooltip placement="top" title={dispatch(isFav({ id: user.id, type: 'user' })) ? t('menus.favorites.remove') : t('menus.favorites.add')}>
									<IconButton className={classes.smallAction} onClick={dispatch(isFav({ id: user.id, type: 'user' })) ? removeFromFavorites : addToFavorites}>
										{dispatch(isFav({ id: user.id, type: 'user' })) ? <Star /> : <StarBorder />}
									</IconButton>
								</Tooltip>
							</ItemG>
						</ItemG>
					</Paper>
				</Fade>
			)}
		</Popper>
	)
}

export default UserHover
