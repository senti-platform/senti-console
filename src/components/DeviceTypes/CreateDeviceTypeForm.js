import React, { Component, Fragment } from 'react'
import { Dialog, AppBar, Toolbar, Typography, Button, List, ListItem, ListItemText, Divider, withStyles, Hidden, IconButton, InputAdornment, Tooltip } from '@material-ui/core';
import { Close } from 'variables/icons';
import cx from 'classnames'
import createprojectStyles from 'assets/jss/components/projects/createprojectStyles';
import { GridContainer, ItemGrid, TextF, ItemG, InfoCard, DSelect, T, SlideT } from 'components'
import Search from 'components/Search/Search';
import { suggestionGen, filterItems } from 'variables/functions';
import AssignOrgDialog from 'components/AssignComponents/AssignOrgDialog';
/**
* @augments {Component<{	t:Function.isRequired,	collection:object.isRequired,	handleChangeDevice:Function.isRequired,	handleCloseDevice:Function.isRequired,	handleOpenDevice:Function.isRequired,	open:boolean.isRequired,	devices:array.isRequired,	device:object.isRequired,	handleCreate:Function.isRequired,	handleChange:Function.isRequired,>}
*/
class CreateDeviceTypeForm extends Component {
	constructor(props) {
		super(props)

		this.state = {
			filters: {
				keyword: ''
			},
			openOrg: false
		}
	}

	handleFilterKeyword = value => {
		this.setState({
			filters: {
				keyword: value
			}
		})
	}

	renderMetadata = () => {
		const { sensorMetadata, handleRemoveMtdKey, handleAddMetadataKey, t, handleChangeMetadata, handleChangeMetadataKey, handleChangeKey, handleOpenFunc, handleChangeType, cfunctions, classes, handleRemoveKey, handleRemoveFunction, handleAddKey } = this.props
		return <Fragment>
			<T variant={'subtitle1'}>{t('sensors.fields.metadata')}</T>
			{sensorMetadata.metadata.map((m, i) => {
				return <ItemGrid xs={12} container key={i} alignItems={'center'}>
					<TextF
						label={t('cloudfunctions.fields.metadata.key')}
						onChange={handleChangeMetadataKey(i)}
						value={m.key}
						readOnly
						InputProps={{
							style: { marginRight: 8 }
						}}
					/>
					<TextF
						label={t('cloudfunctions.fields.metadata.value')}
						onChange={handleChangeMetadata(i)}
						value={m.value}
						readOnly
						InputProps={{
							style: { marginRight: 8 }
						}}
					/>
					<Tooltip title={t('tooltips.devices.removeDataField')}>
						<IconButton
							style={{ marginTop: 6 }}
							onClick={handleRemoveMtdKey(i)}						>
							<Close />
						</IconButton>
					</Tooltip>
				</ItemGrid>
			})}
			<ItemGrid xs={12}>
				<Button variant={'outlined'} onClick={handleAddMetadataKey} color={'primary'}>{t('actions.addMtdKey')}</Button>
			</ItemGrid>
			<T variant={'subtitle1'}>{t('sidebar.cloudfunctions')}</T>
			{sensorMetadata.outbound.map((p, i) => {
				return <ItemGrid xs={12} container key={i} alignItems={'center'}>
					<TextF
						label={t('cloudfunctions.fields.key')}
						onChange={handleChangeKey(p, i)}
						value={p.key}
						readOnly
						InputProps={{
							style: { marginRight: 8 }
						}}
					/>
					<TextF
						label={t('sidebar.cloudfunction')}
						value={cfunctions.findIndex(f => f.id === p.nId) > 0 ? cfunctions[cfunctions.findIndex(f => f.id === p.nId)].name : t('no.cloudfunction')}
						readOnly
						handleClick={handleOpenFunc(i, 'outbound')}
						onChange={() => { }}
						InputProps={{
							endAdornment: <InputAdornment classes={{ root: classes.IconEndAd }}>
								<Tooltip title={t('tooltips.devices.removeCloudFunction')}>
									<IconButton
										className={classes.smallAction}
										onClick={e => { e.stopPropagation(); handleRemoveFunction(i)() }}
									>
										<Close />
									</IconButton>
								</Tooltip>
							</InputAdornment>,
							style: { marginRight: 8 }
						}}
					/>
					<DSelect
						onChange={handleChangeType(i)}
						value={p.type}
						menuItems={[
							{ value: 0, label: t('cloudfunctions.datatypes.timeSeries') },
							{ value: 1, label: t('cloudfunctions.datatypes.average') }
						]}
					/>
					<Tooltip title={t('tooltips.devices.removeDataField')}>

						<IconButton
							// className={classes.smallAction}
							style={{ marginTop: 6 }}
							onClick={handleRemoveKey(i)}
						>
							<Close />
						</IconButton>
					</Tooltip>
				</ItemGrid>

			})}
			<ItemGrid xs={12}>
				<Button variant={'outlined'} onClick={handleAddKey} color={'primary'}>{t('actions.addKey')}</Button>
			</ItemGrid>
		</Fragment>
	}
	renderMetadataInbound = () => {
		const { sensorMetadata, cfunctions, t, handleAddInboundFunction, handleOpenFunc, handleRemoveInboundFunction, classes } = this.props
		return <Fragment>
			{sensorMetadata.inbound.map((p, i) => {
				return <ItemGrid xs={12} container alignItems={'center'}>
					<TextF
						label={t("cloudfunctions.fields.inboundfunc")}
						handleClick={handleOpenFunc(i, 'inbound')}
						value={cfunctions.findIndex(f => f.id === p.nId) > 0 ? cfunctions[cfunctions.findIndex(f => f.id === p.nId)].name : t('no.cloudfunction')}
						readOnly
						InputProps={{
							endAdornment: <InputAdornment classes={{ root: classes.IconEndAd }}>
								<Tooltip title={t('tooltips.devices.removeCloudFunction')}>
									<IconButton
										className={classes.smallAction}
										onClick={e => { e.stopPropagation(); handleRemoveInboundFunction(i)() }}
									>
										<Close />
									</IconButton>
								</Tooltip>
							</InputAdornment>
						}}
					/>
				</ItemGrid>
			})}
			<ItemGrid xs={12}>
				<Button variant={'outlined'} onClick={handleAddInboundFunction} color={'primary'}>{t('actions.addInboundFunc')}</Button>
			</ItemGrid>
		</Fragment>
	}

	renderSelectOrg = () => {
		const { t, openOrg, handleCloseOrg, orgs, handleChangeOrg, classes } = this.props
		const { filters } = this.state
		const appBarClasses = cx({
			[' ' + classes['primary']]: 'primary'
		});
		return <Dialog
			fullScreen
			open={openOrg}
			onClose={handleCloseOrg}
			TransitionComponent={SlideT}>
			<AppBar className={classes.appBar + ' ' + appBarClasses}>
				<Toolbar>
					<Hidden mdDown>
						<ItemG container alignItems={'center'}>
							<ItemG xs={2} container alignItems={'center'}>
								<IconButton color='inherit' onClick={handleCloseOrg} aria-label='Close'>
									<Close />
								</IconButton>
								<Typography variant='h6' color='inherit' className={classes.flex}>
									{t('orgs.pageTitle')}
								</Typography>
							</ItemG>
							<ItemG xs={8}>
								<Search
									fullWidth
									open={true}
									focusOnMount
									suggestions={orgs ? suggestionGen(orgs) : []}
									handleFilterKeyword={this.handleFilterKeyword}
									searchValue={filters.keyword} />
							</ItemG>
						</ItemG>
					</Hidden>
					<Hidden lgUp>
						<ItemG container alignItems={'center'}>
							<ItemG xs={4} container alignItems={'center'}>
								<IconButton color={'inherit'} onClick={handleCloseOrg} aria-label='Close'>
									<Close />
								</IconButton>
								<Typography variant='h6' color='inherit' className={classes.flex}>
									{t('orgs.pageTitle')}
								</Typography>
							</ItemG>
							<ItemG xs={8} container alignItems={'center'} justify={'center'}>
								<Search
									noAbsolute
									fullWidth
									open={true}
									focusOnMount
									suggestions={orgs ? suggestionGen(orgs) : []}
									handleFilterKeyword={this.handleFilterKeyword}
									searchValue={filters.keyword} />
							</ItemG>
						</ItemG>
					</Hidden>
				</Toolbar>
			</AppBar>
			<List>
				{orgs ? filterItems(orgs, filters).map((o, i) => {
					return <Fragment key={i}>
						<ListItem button onClick={handleChangeOrg(o)}>
							<ListItemText primary={o.name} />
						</ListItem>
						<Divider />
					</Fragment>
				}) : null}
			</List>
		</Dialog>
	}
	renderSelectFunction = () => {
		const { t, openCF, handleCloseFunc, cfunctions, handleChangeFunc, classes } = this.props
		const { filters } = this.state
		const appBarClasses = cx({
			[' ' + classes['primary']]: 'primary'
		});
		return <Dialog
			fullScreen
			open={openCF.open}
			onClose={handleCloseFunc}
			TransitionComponent={SlideT}>
			<AppBar className={classes.appBar + ' ' + appBarClasses}>
				<Toolbar>
					<Hidden mdDown>
						<ItemG container alignItems={'center'}>
							<ItemG xs={2} container alignItems={'center'}>
								<IconButton color='inherit' onClick={handleCloseFunc} aria-label='Close'>
									<Close />
								</IconButton>
								<Typography variant='h6' color='inherit' className={classes.flex}>
									{t('sidebar.cloudfunctions')}
								</Typography>
							</ItemG>
							<ItemG xs={8}>
								<Search
									fullWidth
									open={true}
									focusOnMount
									suggestions={cfunctions ? suggestionGen(cfunctions) : []}
									handleFilterKeyword={this.handleFilterKeyword}
									searchValue={filters.keyword} />
							</ItemG>
						</ItemG>
					</Hidden>
					<Hidden lgUp>
						<ItemG container alignItems={'center'}>
							<ItemG xs={4} container alignItems={'center'}>
								<IconButton color={'inherit'} onClick={handleCloseFunc} aria-label='Close'>
									<Close />
								</IconButton>
								<Typography variant='h6' color='inherit' className={classes.flex}>
									{t('orgs.pageTitle')}
								</Typography>
							</ItemG>
							<ItemG xs={8} container alignItems={'center'} justify={'center'}>
								<Search
									noAbsolute
									fullWidth
									open={true}
									focusOnMount
									suggestions={cfunctions ? suggestionGen(cfunctions) : []}
									handleFilterKeyword={this.handleFilterKeyword}
									searchValue={filters.keyword} />
							</ItemG>
						</ItemG>
					</Hidden>
				</Toolbar>
			</AppBar>
			<List>
				{cfunctions ? filterItems(cfunctions, filters).map((o, i) => {
					return <Fragment key={i}>
						<ListItem button onClick={handleChangeFunc(o, openCF.where)}>
							<ListItemText primary={o.name} />
						</ListItem>
						<Divider />
					</Fragment>
				}) : null}
			</List>
		</Dialog>
	}

	render() {
		const { t, handleChange, org, handleOrgChange, deviceType, classes, handleCreate, goToDeviceTypes } = this.props
		return (
			<GridContainer>
				<ItemGrid xs={12}>
					<InfoCard
						noHeader
						noExpand
						content={<ItemG>
							{this.renderSelectFunction()}
							<ItemGrid xs={12}>
								<TextF
									id={'deviceTypeName'}
									label={t('collections.fields.name')}
									onChange={handleChange('name')}
									value={deviceType.name}
								// autoFocus
								/>
							</ItemGrid>
							<Divider style={{ margin: "16px" }} />
							{this.renderMetadata()}
							<Divider style={{ margin: "16px" }} />
							{this.renderMetadataInbound()}
							<Divider style={{ margin: "16px" }} />
							<ItemGrid xs={12}>
								<TextF
									value={org.name}
									handleClick={() => this.setState({ openOrg: true })}
									readonly
								/>
								<AssignOrgDialog
									t={t}
									open={this.state.openOrg}
									handleClose={() => this.setState({ openOrg: false })}
									callBack={org => { this.setState({ openOrg: false }); handleOrgChange(org) }}
								/>
							</ItemGrid>
							<Divider style={{ margin: "16px" }} />
							<ItemGrid container>
								<div className={classes.wrapper}>
									<Button
										variant='outlined'
										onClick={goToDeviceTypes}
										className={classes.redButton}
									>
										{t('actions.cancel')}
									</Button>
								</div>
								<div className={classes.wrapper}>
									<Button onClick={handleCreate} variant={'outlined'} color={'primary'}>
										{t('actions.save')}
									</Button>
								</div>
							</ItemGrid>
						</ItemG>}
					/>
				</ItemGrid>

			</GridContainer>
		)
	}
}


export default withStyles(createprojectStyles)(CreateDeviceTypeForm)