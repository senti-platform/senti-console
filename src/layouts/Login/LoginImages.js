import React, { Component } from 'react'
import { ItemG, T } from 'components';
import loginImages from 'variables/loginImages'
import { Button, withStyles } from '@material-ui/core';


const styles = theme => ({
	container: {
		width: '100%',
		height: '100%'
	},
	bold: {
		fontWeight: 600
	},
	message: {
		margin: '25px 25%',
		[theme.breakpoints.down('md')]: {
			margin: '25px 5%'
		}
	},
	button: {
		marginBottom: 40
	}
})

class LoginImages extends Component {
	constructor(props) {
		super(props)

		this.state = {
			number: this.getRndInteger()
		}
	}

	getRndInteger = (min, max) => {
		min = 0
		max = loginImages.length
		return Math.floor(Math.random() * (max - min)) + min;
	}
	generateString = (number) => {
		const { t } = this.props
		let string = t(`login.cards.${number}`)
		var rx = />(.*?)</g
		let arr = []
		let length = string.match(rx) ? string.match(rx).length : null
		if (length) {

			for (let index = 0; index < length; index++) {
				let substr = string.substr(string.indexOf('>') + 1, string.indexOf('<') - 1)
				arr.push(<span style={{ fontWeight: 600 }}>{substr}</span>)

				string = string.slice(string.indexOf('<') + 1)
				let sub2str = string.substr(0, string.indexOf('>'))
				if (sub2str === '') {
					arr.push(string)
					string = ''
				}
				else {
					arr.push(sub2str)
					string = string.slice(string.indexOf('>'))
				}
			}
		}
		else {
			arr.push(string)
		}
		return arr
	}
	render() {
		const { t, classes } = this.props
		const { number } = this.state
		return (
			<div className={classes.container}>

				<ItemG container style={{ height: '100%' }}>
					<ItemG container xs={12} justify={'flex-end'} alignItems={'center'} direction={'column'}>
						<T variant={'h4'} className={classes.message}>
							{this.generateString(number).map((a, i) => <span key={i}>{a}</span>)}
						</T>
						<Button color='primary' variant={'contained'} size={'large'} className={classes.button}>
							{t('actions.learnMore')}
						</Button>
					</ItemG>
					<ItemG style={{ alignSelf: 'flex-start' }} container xs={12} justify={'center'}>
						<img src={loginImages[number]} alt="" />
					</ItemG>
				</ItemG>
			</div>
		)
	}
}

export default withStyles(styles)(LoginImages)