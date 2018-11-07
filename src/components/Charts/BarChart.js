import React, { PureComponent } from 'react'
import { Bar } from 'react-chartjs-2';
import { Typography, withStyles, Paper, Grow } from '@material-ui/core';
import { ItemG, WeatherIcon, Caption, Info } from 'components';
import { graphStyles } from './graphStyles';
import { compose } from 'recompose';
import { connect } from 'react-redux'
import moment from 'moment'
import { getWeather } from 'variables/dataDevices';

class BarChart extends PureComponent {
	constructor(props) {
		super(props)
		this.state = {
			tooltip: {
				show: false,
				title: '',
				top: 0,
				left: 0,
				data: [],
				exited: false
			},
			lineOptions: {
				categoryPercentage: 0.5,
				barPercentage: 0.5,
				barThickness: 'flex',
				gridLines: { offsetGridLines: false },	
				animation: {
					duration: 500
				},
				display: true,
				maintainAspectRatio: false,
				tooltips: {
					titleFontFamily: 'inherit',
					mode: 'point',
					intersect: false,
					enabled: false,
					custom: this.customTooltip
				},
				hover: {
					mode: 'point'
				},
				scales: {
					xAxes: [
						{
							offset: true,
							id: 'day',
							type: 'time',
							time: {
								displayFormats: {
									hour: 'LT',
									day: 'll',
									minute: 'LT'
								},
								unit: props.unit.chart,
								tooltipFormat: props.unit.format
							},
							gridLines: {
								offsetGridLines: true
							}
						}],
					// yAxes: [{
					// 	scaleLabel: {
					// 		display: true,
					// 		labelString: 'value'
					// 	}
					// }]
				}
			}
		}
	}
	legendOptions = {
		position: 'bottom',
		display: !this.props.single ? true : false,
		onHover: !this.props.single ? (t, l) => {
			this.props.setHoverID(this.props.data.datasets[l.datasetIndex].id)
		} : null
	}
	clickEvent = () => {
		if ('ontouchstart' in document.documentElement === true)
			return false
		else
			return true
	}
	componentDidMount = () => {
		this.setState({
			chartWidth: parseInt(this.chart.chartInstance.canvas.style.width.substring(0, this.chart.chartInstance.canvas.style.width.length - 1), 10),
			chartHeight: parseInt(this.chart.chartInstance.canvas.style.height.substring(0, this.chart.chartInstance.canvas.style.height.length - 1), 10),
			mobile: window.innerWidth > 400 ? false : true
		})
	}
	componentDidUpdate = (prevProps, prevState) => {
		if (prevProps.unit !== this.props.unit || prevProps.hoverID !== this.props.hoverID) {
			this.setXAxis()
		}
		if (this.chart.chartInstance.canvas.style.width !== this.state.chartWidth || this.state.chartHeight !== this.chart.chartInstance.canvas.style.height) {
			this.setState({
				chartWidth: parseInt(this.chart.chartInstance.canvas.style.width.substring(0, this.chart.chartInstance.canvas.style.width.length - 1), 10),
				chartHeight: parseInt(this.chart.chartInstance.canvas.style.height.substring(0, this.chart.chartInstance.canvas.style.height.length - 1), 10)
			})
		}
	}

	setHours = (date) => {
		if (this.props.unit.chart === 'day')
			return moment(date).startOf('day').add(12, 'h')

	}
	customTooltip = async (tooltipModel) => {
		if (tooltipModel.opacity === 0) {
			this.hideTooltip()
			return
		}
		// console.log(tooltipModel)
		// console.log(this.props.data.datasets[tooltipModel.dataPoints[0].datasetIndex].data[tooltipModel.dataPoints[0].index].x)
		let weatherData = null
		let wDate = null
		try {

			wDate = this.props.data.datasets[tooltipModel.dataPoints[0].datasetIndex].data[tooltipModel.dataPoints[0].index].x
			// console.log(this.state.weatherDate, wDate, this.state.weatherDate === wDate)
			if (this.state.weatherDate !== wDate) {
				weatherData = await getWeather(this.props.obj, this.setHours(wDate), this.props.lang)
			}
			this.setState({
				weatherDate: wDate,
				weather: weatherData ? weatherData : this.state.weather
			})
		}
		catch (err) {
			// console.log(err)
		}

		const left = tooltipModel.caretX;
		const top = tooltipModel.caretY;
		// let deviceWeather = getWeather(device).then(rs => rs)
		this.setTooltip({
			top,
			left,
			title: tooltipModel.title,
			data: tooltipModel.dataPoints.map((d, i) => ({
				device: tooltipModel.body[i].lines[0].split(':')[0], count: d.yLabel, color: tooltipModel.labelColors[i].backgroundColor
			}))
		})
	}
	setXAxis = () => {
		this.setState({
			lineOptions: {
				...this.state.lineOptions,
				scales: {
					...this.state.lineOptions.scales,
					xAxes: [{
						// id: "day",
						type: 'time',
						time: {
							displayFormats: {
								hour: 'LT',
								day: 'll',
								minute: 'LT'
							},
							unit: this.props.unit.chart,
							tooltipFormat: this.props.unit.format
						},
					}]
				}
			}
		}, this.chart.chartInstance.update())
	}

	setTooltip = (tooltip) => {
		this.setState({
			tooltip: {
				...tooltip,
				show: true,
				exited: false
			}
		})
	}
	exitedTooltip = () => {
		this.setState({
			tooltip: {
				...this.state.tooltip,
				exited: true
			}
		})
	}
	hideTooltip = () => {
		this.setState({
			tooltip: {
				...this.state.tooltip,
				show: false
			}
		})
	}
	elementClicked = async (elements) => {
		if (this.props.onElementsClick) {
			await this.props.onElementsClick(elements)

		}
		this.hideTooltip()
	}
	onMouseLeave = () => {
		const { single } = this.props
		return !single ? () => this.props.setHoverID(0) : undefined
	}
	transformLoc = () => {
		const { tooltip, chartWidth, chartHeight, mobile } = this.state
		let x = 0
		let y = 0
		if (tooltip.left < (chartWidth / 2) && tooltip.top < (chartHeight / 2)) {
			x = '-25%'
			y = '25%'
		}
		if (tooltip.left < (chartWidth / 2) && tooltip.top > (chartHeight / 2)) {
			x = '-25%'
			y = '-125%'
		}
		if (tooltip.left > (chartWidth / 2) && tooltip.top < (chartHeight / 2)) {
			x = '-80%'
			y = '-125%'
		}
		if (tooltip.left > (chartWidth / 2) && tooltip.top > (chartHeight / 2)) {
			x = '-80%'
			y = '-125%'
		}
		if (tooltip.left > ((chartWidth / 4) * 3)) {
			x = '-90%'
		}
		if (tooltip.left < chartWidth / 4) {
			x = '0%'
		}
		if (mobile)
			x = '-50%'
		return `translate(${x}, ${y})`
	}
	render() {
		const { classes } = this.props
		const { tooltip, chartWidth, mobile } = this.state
		return (
			<div style={{ maxHeight: 400, position: 'relative' }} onScroll={this.hideTooltip} onMouseLeave={this.onMouseLeave()}>
				<Bar
					data={this.props.data}
					height={this.props.theme.breakpoints.width("md") < window.innerWidth ? window.innerHeight / 4 : window.innerHeight - 200}
					ref={r => this.chart = r}
					options={this.state.lineOptions}
					legend={this.legendOptions}
					onElementsClick={this.clickEvent() ? this.elementClicked : undefined}
				/>
				<div ref={r => this.tooltip = r} style={{
					zIndex: tooltip.show ? 1300 : tooltip.exited ? -1 : 1300,
					position: 'absolute',
					top: Math.round(this.state.tooltip.top),
					left: mobile ? '50%' : Math.round(this.state.tooltip.left),
					transform: this.transformLoc(),
					width: mobile ? 200 : 300,
					maxWidth: mobile ? (chartWidth ? chartWidth : window.innerWidth - 250) : 300
				}}>
					<Grow in={tooltip.show} onExited={this.exitedTooltip} >
						<Paper className={classes.paper}>
							<ItemG container>
								<ItemG container direction="row"
									justify="space-between">
									<Typography variant={'h6'} classes={{ root: classes.antialias }}>{this.state.tooltip.title}</Typography>
									{this.state.weather ? <WeatherIcon icon={this.state.weather.currently.icon} /> : null}
								</ItemG>
								{this.state.weather ? <ItemG>
									<Caption>{this.props.t('devices.fields.weather')}</Caption>
									<Info>{this.state.weather.currently.summary}</Info>
								</ItemG> : null}
								{this.state.tooltip.data.map((d, i) => {
									return (
										<ItemG key={i} container alignItems={'center'}>
											<ItemG xs={1}>
												<div style={{ background: d.color, width: 15, height: 15, marginRight: 8 }} />
											</ItemG>
											<ItemG xs={8}><Typography noWrap variant={'caption'}>{d.device}</Typography></ItemG>
											<ItemG xs={3}><Typography variant={'caption'} classes={{
												root: classes.expand
											}}>{Math.round(d.count)}</Typography></ItemG>
										</ItemG>
									)
								})}
							</ItemG>
						</Paper>
					</Grow>
				</div>
			</div>
		)
	}
}
const mapStateToProps = (state) => ({
	lang: state.settings.language
})

const mapDispatchToProps = {

}

let BarChartCompose = compose(connect(mapStateToProps, mapDispatchToProps), withStyles(graphStyles, { withTheme: true }))(BarChart)
// export default withStyles(graphStyles, { withTheme: true })(BarChart)

export default BarChartCompose
