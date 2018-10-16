import { Button, withStyles } from '@material-ui/core';
import regularCardStyle from 'assets/jss/material-dashboard-react/regularCardStyle';
import { Caption, Dropdown, Info, ItemG, ItemGrid, SmallCard } from 'components';
import React, { Component, Fragment } from 'react';
import { dateFormat, dateFormatter } from 'variables/functions';
import { DataUsage, Edit } from 'variables/icons';

class CollectionCard extends Component {
	handleDeleteProject = () => {
	}
	render() {
		const { d, classes, t, history } = this.props
		return (
			<ItemGrid noPadding extraClass={classes.smallCardGrid} noMargin md={4}>
				<div style={{
					margin: 8, height: "100%"
				}}>
					<SmallCard
						// whiteAvatar
						key={d.id}
						title={d.name ? d.name : d.id}
						avatar={<DataUsage />}
						subheader={<ItemG container alignItems={'center'}>
							<Caption>{t("collections.fields.id")}:</Caption>&nbsp;{d.id}
						</ItemG>}
						topAction={
							<Dropdown menuItems={
								[
									{ label: t("menus.edit"), icon: <Edit className={classes.leftIcon} />, func: () => history.push({ pathname: `/collection/${d.id}/edit`, state: { prevURL: `/collections/grid` } }) },
								]
							} />

						}
						content={<ItemGrid container>
							<ItemG xs={6}>
								<Caption>{t("collections.fields.status")}</Caption>
								<Info>{d.state ? t('collections.fields.state.active') : t("collections.fields.state.inactive")}</Info>
							</ItemG>
							{d.description ? <ItemG xs={6}>
								<Caption>{t("collections.fields.description")}:</Caption>
								<Info>{d.description}</Info>
							</ItemG> : null}
							<ItemG xs={12}>
								<Caption>{t("devices.fields.lastData")}:</Caption>
								<Info title={dateFormatter(d.latestData)}>
									{dateFormat(d.latestData)}
								</Info>
							</ItemG>
							<ItemG xs={12}>
								<Caption>{t("devices.fields.lastStats")}:</Caption>
								<Info title={dateFormatter(d.latestActivity)}>
									{dateFormat(d.latestActivity)}
								</Info>
							</ItemG>
						</ItemGrid>}
						leftActions={
							
							d.activeDeviceStats ? <Button variant={'text'} color={"primary"} onClick={() => { history.push({ pathname: `/device/${d.activeDeviceStats.id}`, state: { prevURL: '/collections/grid' } }) }}>
								{t("menus.seeDevice")}
							</Button> : null
						}
						rightActions={
							<Fragment>
								<Button variant={'text'} color={"primary"} onClick={() => { history.push({ pathname: `/collection/${d.id}`, state: { prevURL: '/collections/grid' } }) }}>
									{t("menus.seeMore")}
								</Button>
							</Fragment>
						}
					/>
				</div>
			</ItemGrid>
		)
	}
}

export default withStyles(regularCardStyle)(CollectionCard)
