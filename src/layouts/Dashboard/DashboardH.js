import React, { Fragment, useState, useEffect, useCallback } from 'react';
import { Switch, Route, Redirect, useHistory } from 'react-router-dom';
import { Snackbar, IconButton } from '@material-ui/core';
import { Header, /* Sidebar,  */CircularLoader } from 'components';
import cx from 'classnames'
import dashboardRoutes from 'routes/dashboard.js';
import appStyle from 'assets/jss/material-dashboard-react/appStyle.js';
import { MuiThemeProvider, makeStyles } from '@material-ui/core/styles'
import logo from '../../logo.svg';
import cookie from 'react-cookies';
import { getSettings } from 'redux/settings';
import { Close } from 'variables/icons';
import { lightTheme, darkTheme } from 'variables/themes'
import { getDaysOfInterest } from 'redux/doi';
import Cookies from 'components/Cookies/Cookies';
import Sidebar from 'components/Sidebar/Sidebar';
import BC from 'components/Breadcrumbs/BC';
import { changeTabs } from 'redux/appState';
import Toolbar from 'components/Toolbar/Toolbar';
import { useSnackbar, usePrevious, useRef, useDispatch, useSelector, useLocalization } from 'hooks';
// import _ from 'lodash'

function DashboardLayout(props) {
	//#region State

	const [mobileOpen, setMobileOpen] = useState(false)
	const [headerTitle, setHeaderTitle] = useState('')
	const [headerOptions, setHeaderOptions] = useState(null)
	const [goBackButton, setGoBackButton] = useState(false)
	const [url, setUrl] = useState('')
	const [menuRoute, setMenuRoute] = useState('')
	const [bc, setBc] = useState({ name: '', id: '' })

	//#endregion
	//#region Refs

	const mainPanel = useRef(null)

	//#endregion
	//#region Hooks
	const classes = makeStyles(appStyle)()
	const history = useHistory()
	const dispatch = useDispatch()

	const t = useLocalization()
	const s = useSnackbar()
	let prevSid = usePrevious(null)
	//#endregion


	//#region Redux

	const loading = useSelector(s => s.settings.loading)
	const theme = useSelector(s => s.settings.theme)
	const defaultRoute = useSelector(s => s.settings.defaultRoute)
	const defaultView = useSelector(s => s.settings.defaultView)
	const snackbarLocation = useSelector(s => s.settings.snackbarLocation)
	const smallMenu = useSelector(s => s.appState.smallMenu)
	const drawer = useSelector(s => s.settings.drawer)
	const tabs = useSelector(s => s.appState.tabs)
	const cookies = useSelector(s => s.settings.cookies)

	//#endregion

	const handleDrawerToggle = () => {
		setMobileOpen(!mobileOpen)
	};
	const handleSetBreadCrumb = (id, name, extra, dontShow) => {

		if (bc.id !== id || bc.name !== name) {
			setBc({
				id: id,
				name: name,
				extra: extra,
				dontShow: dontShow
			})
		}
	}
	const handleSetHeaderTitle = useCallback(
		(hTitle, gBB, URL, mR) => {
			if (typeof hTitle === 'string') {
				if ((headerTitle !== hTitle) || (URL !== url)) {
					setHeaderTitle(hTitle)
					setGoBackButton(gBB)
					setUrl(URL)
					setMenuRoute(mR)
					if (mainPanel.current)
						mainPanel.current.scrollTop = 0
				}
			}
			else {
				if ((hTitle.id !== headerTitle) || (URL !== url)) {
					setHeaderTitle(hTitle.id)
					setHeaderOptions(hTitle.options)
					setGoBackButton(gBB)
					setUrl(URL)
					setMenuRoute(mR)
					if (mainPanel.current)
						mainPanel.current.scrollTop = 0
				}
			}

		},
		[headerTitle, url],
	)

	const handleGoBackButton = () => {
		history.push(url)
		setUrl('')
	}
	const setTabs = (tbs) => {
		if (tbs.id !== tabs.id) {
			dispatch(changeTabs(tbs))
		}
		if (tbs.id === tabs.id && tbs.route !== tabs.route) {
			dispatch(changeTabs(tbs))
		}
	}

	useEffect(() => {
		if (defaultRoute === '/')
			handleSetHeaderTitle('Senti', false, '', 'dashboard')
		const getS = async () => {
			dispatch(await getSettings()).then(async rs => {
				await dispatch(getDaysOfInterest())

			})
		}
		getS()
		/* CDUP */
		// if (prevSid !== props.sId) {
		// 	setOpenSnackbar(true)
		// }
		if (theme === 1) {
			document.body.style = 'background: #2e2e2e'
		}
		else {
			document.body.style = 'backgroubd: #eee'
		}
	}, [dispatch, handleSetHeaderTitle, prevSid, defaultRoute, /* props.sId, */ theme])

	return (
		<MuiThemeProvider theme={theme === 0 ? lightTheme : darkTheme}>

			<div className={classes.wrapper + ' ' + (theme === 0 ? '' : classes.darkBackground)}>
				<Header
					defaultRoute={defaultRoute}
					logo={logo}
					routes={dashboardRoutes}
					handleDrawerToggle={handleDrawerToggle}
					goBackButton={goBackButton}
					gbbFunc={handleGoBackButton}
					headerTitle={headerTitle}
					headerOptions={headerOptions}
					t={t}
				/>
				<div className={cx({
					[classes.mainPanelDrawerPersClosed]: !smallMenu && drawer === 'persistent',
					[classes.mainPanelDrawerPermClosed]: !smallMenu && drawer === 'permanent',
					[classes.mainPanelDrawerOpen]: smallMenu,
					[classes.mainPanel]: true
				})} ref={mainPanel}>
					<Fragment>
						<Sidebar
							defaultView={defaultView}
							defaultRoute={defaultRoute}
							routes={dashboardRoutes}
							logo={logo}
							handleDrawerToggle={handleDrawerToggle}
							open={mobileOpen}
							color='senti'
							t={t}
							menuRoute={menuRoute}
						/>
						{!loading ?
							<Fragment>
								<div className={classes.container} id={'container'}>
									<Toolbar history={history} {...tabs} />
									<BC
										defaultRoute={defaultRoute}
										bc={bc}
										t={t}
									/>
									<Switch>
										{cookie.load('SESSION') ?
											dashboardRoutes.map((prop, key) => {
												if (prop.dropdown) {
													return prop.items.map((r, key) => {
														return <Route path={r.path}
															render={rProps =>
																<r.component {...rProps}
																	setBC={handleSetBreadCrumb}
																	setHeader={handleSetHeaderTitle}
																	setTabs={setTabs} />
															}
															key={r.menuRoute + key}
														/>
													})
												}
												if (prop.redirect) {
													return <Redirect from={prop.path} to={prop.to} key={key} />;
												}
												return <Route path={prop.path}
													render={(routeProps) =>
														<prop.component {...routeProps}
															setBC={handleSetBreadCrumb}
															setHeader={handleSetHeaderTitle}
															setTabs={setTabs}
														/>} key={key} />;
											})
											: <Redirect from={window.location.pathname} to={{
												pathname: '/login', state: {
													prevURL: window.location.pathname
												}
											}} />}
									</Switch>
								</div>

								{!cookies && <Cookies />}
								<Snackbar
									anchorOrigin={{ vertical: 'bottom', horizontal: snackbarLocation }}
									open={s.sOpen}
									onClose={s.sClose}
									onExited={s.handleNextS}
									ContentProps={{
										'aria-describedby': 'message-id',
									}}
									ClickAwayListenerProps={{
										mouseEvent: false,
										touchEvent: false
									}}
									autoHideDuration={3000}
									message={<span>{t(s.sId, s.sOpt)}</span>}
									action={
										<IconButton color={'primary'} size={'small'} onClick={s.sClose} >
											<Close />
										</IconButton>
									}
								/>

							</Fragment>
							: <CircularLoader />}
					</Fragment>
				</div>

			</div >
		</MuiThemeProvider>

	);

}

// const mapStateToProps = (state) => ({
// 	loading: state.settings.loading,
// 	theme: state.settings.theme,
// 	defaultRoute: state.settings.defaultRoute,
// 	defaultView: state.settings.defaultView,
// 	snackbarLocation: state.settings.snackbarLocation,
// 	smallMenu: state.appState.smallMenu,
// 	drawer: state.settings.drawer,
// 	tabs: state.appState.tabs,
// 	user: state.settings.user,
// 	cookies: state.settings.cookies
// })

// const mapDispatchToProps = dispatch => ({
// 	getSettings: async () => dispatch(await getSettings()),
// 	getDaysOfIterest: async () => dispatch(await getDaysOfInterest()),
// 	changeTabs: tabs => dispatch(changeTabs(tabs)),
// 	getSuggestions: () => dispatch(getSuggestions())
// 	// acceptCookies: async (val) => dispatch(await acceptCookiesFunc(val))
// })

export default DashboardLayout
// export default connect(mapStateToProps, mapDispatchToProps)(withSnackbarHandler()((withLocalization()(withStyles(appStyle)(App)))))
