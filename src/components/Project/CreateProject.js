import { withStyles } from '@material-ui/core'
import createprojectStyles from 'assets/jss/components/projects/createprojectStyles'
import React, { Component } from 'react'
import { createProject } from 'variables/dataProjects'
import { Danger } from 'components'
import { getAllOrgs } from 'variables/dataOrgs';
import { getAvailableDevices } from 'variables/dataDevices';
import { getCreateProject } from 'variables/dataProjects'
import { connect } from 'react-redux'
import moment from 'moment';
import CreateProjectForm from './CreateProjectForm';

class CreateProject extends Component {
	constructor(props) {
		super(props)

		this.state = {
			title: '',
			description: '',
			startDate: null,
			endDate: null,
			devices: [],
			orgs: [],
			selectedOrg: '',
			availableDevices: null,
			creating: false,
			created: false,
			openSnackBar: false,
			error: false,
			errorMessage: '',
			org: {
				name: "",
				id: -1
			}
		}
		props.setHeader('menus.create.project', true, '/projects/list', 'projects')
	}

	componentDidMount = () => {
		this._isMounted = 1

		getAllOrgs().then(async rs => {
			if (this._isMounted) {
				if (rs.length === 1)
					this.setState({
						orgs: rs,
						org: rs[0]
					})
				else {
					var devices = await getAvailableDevices(this.props.userOrg.id).then(rs => rs)
					this.setState({
						availableDevices: devices ? devices : null,
						devices: [], 
						orgs: rs,
						selectedOrg: this.props.userOrg
					})
				}
			}
		})
	}

	componentWillUnmount = () => {
		this._isMounted = 0
	}
	handleValidation = () => {
		let errorCode = [];
		const { title, startDate, endDate } = this.state
		if (title === '')
		{
			errorCode.push(1)
		}
		if (!moment(startDate).isValid())
		{
			errorCode.push(2)
		}
		if (!moment(endDate).isValid()) 
		{
			errorCode.push(3)
		}
		if ( moment(startDate).isAfter(endDate) )
		{
			errorCode.push(4)
		}
		this.setState({
			errorMessage: errorCode.map(c => <Danger key={c}>{this.errorMessages(c)}</Danger>)
		})	
		if (errorCode.length === 0)
			return true
		else 
			return false
	}
	errorMessages = code => {
		const { t } = this.props
		switch (code) {
			case 1:
				return t('projects.validation.noTitle')
			case 2: 
				return t('projects.validation.noStartDate')
			case 3: 
				return t('projects.validation.noEndDate')
			case 4:
				return t('projects.validation.startDateBiggerThanEndDate')
			default: 
				return ''	
		}

	}
	handleDeviceChange = event => {
		this.setState({ devices: event.target.value })
	}
	handleSelectedOrgs = async e => {
		this.setState({ selectedOrg: e.target.value })
	}
	handleDateChange = id => value => {
		this.setState({
			error: false,
			[id]: moment(value).local().format('YYYY-MM-DDTHH:ss')
		})
	}

	handleChange = (id) => e => {
		e.preventDefault()
		this.setState({
			error: false,
			[id]: e.target.value
		})
	}
	handleFinishCreateProject = (rs) => {
		this.setState({ created: true, id: rs.id })
		this.props.s('snackbars.projectCreated', { project: this.state.title })			
		this.props.history.push(`/project/${rs.id}`)
	}
	handleCreateProject = async () => {
		const { title, description, startDate, endDate, org } = this.state
		this.setState({ creating: true })
		if (this.handleValidation())
		{
			await getCreateProject().then(async rs => {
				if (this._isMounted) {
					let newProject = {
						...rs,
						title: title,
						description: description,
						startDate: startDate,
						endDate: endDate,
						org: org							
					}
					await createProject(newProject).then(rs => rs ? this.handleFinishCreateProject(rs) : this.setState({ create: false, creating: false, id: 0 })
					)
				}
			})
		}
		else {
			this.setState({
				creating: false,
				error: true,
			})
		}
	}
	handleOpenOrg = () => {
		this.setState({
			openOrg: true
		})
	}
	handleCloseOrg = () => {
		this.setState({
			openOrg: false
		})
	}
	handleChangeOrg = (o) => () => {
		this.setState({
			org: o,
			openOrg: false
		})
	}
	render() {
		const { created, orgs, org, error,
			title, description, creating, startDate, endDate, openOrg } = this.state

		return (
			<CreateProjectForm
				error={error}
				created={created}
				creating={creating}
				errorMessage
				title={title}
				handleChange={this.handleChange}
				handleDateChange={this.handleDateChange}
				description={description}
				startDate={startDate}
				endDate={endDate}
				orgs={orgs}
				org={org}
				handleOpenOrg={this.handleOpenOrg}
				handleCloseOrg={this.handleCloseOrg}
				handleChangeOrg={this.handleChangeOrg}
				openOrg={openOrg}
				handleCreateProject={this.handleCreateProject}
			/>
		)
	}
}
const mapStateToProps = (state) => ({
	userOrg: state.settings.user.org.id
})

const mapDispatchToProps = {

}

export default connect(mapStateToProps, mapDispatchToProps)(withStyles(createprojectStyles, { withTheme: true })(CreateProject))