import { Hidden, Typography, Slide } from '@material-ui/core';
import AnalyticsImg from 'assets/img/Rounded/analytics.svg';
import HostingImg from 'assets/img/Rounded/hosting.svg';
import StorageImg from 'assets/img/Rounded/storage.svg';
import discoverSentiStyle from 'assets/jss/material-dashboard-react/discoverSentiStyles';
import { GridContainer, ItemGrid } from 'components';
import DiscoverSentiCards from 'components/Cards/DiscoverSentiCards';
import React from 'react';
import { useLocalization } from 'hooks';

// @Andrei
const DiscoverSenti = props => {
	const classes = discoverSentiStyle()
	const t = useLocalization()
	const goTo = (where) => e => {
		e.preventDefault()
		props.history.push(where)
	}

	return (
		<Hidden mdDown>
			<Slide in={true} style={{ transitionDelay: 100 }}>
				<div className={classes.root}>
					<div className={classes.texturePicture}>
						<div className={classes.devicesPicture}>
							<GridContainer>
								<ItemGrid xs={12}>
									<Typography variant={'h6'} style={{ color: 'white' }}>{t('dialogs.discoverSenti.welcome')}</Typography>
								</ItemGrid>
								<ItemGrid xs={12} sm={4} noMargin>
									<DiscoverSentiCards img={StorageImg}
										onClick={goTo('/projects/list')}
										content={
											<Typography variant={'h6'} style={{ color: 'white', fontWeight: 400, textTransform: 'none' }}>{t('dialogs.discoverSenti.addProject')}</Typography>
										} />
								</ItemGrid>
								<ItemGrid xs={12} sm={4} noMargin>
									<DiscoverSentiCards img={HostingImg}
										onClick={goTo('/devices/list')}
										content={
											<Typography variant={'h6'} style={{ color: 'white', fontWeight: 400, textTransform: 'none' }}>{t('dialogs.discoverSenti.onSiteSetup')}</Typography>

										} />
								</ItemGrid>
								<ItemGrid xs={12} sm={4} noMargin>
									<DiscoverSentiCards img={AnalyticsImg}
										onClick={goTo('/collections/list')}
										content={
											<Typography variant={'h6'} style={{ color: 'white', fontWeight: 400, textTransform: 'none' }}>{t('dialogs.discoverSenti.startAnalyzeData')}</Typography>
										}
									/>
								</ItemGrid>
							</GridContainer>
						</div>
					</div>
				</div>
			</Slide>

		</Hidden>
	)
}

export default DiscoverSenti
