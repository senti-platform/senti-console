import React, { Component, Fragment } from 'react'
import { Paper, withStyles, Grid, /*  FormControl, InputLabel, Select, Input, Chip,  MenuItem, */ Collapse, Button, Snackbar } from '@material-ui/core';
import { Save, Check } from '@material-ui/icons';
import classNames from 'classnames';
import { getOrg, updateOrg } from 'variables/dataUsers'
import { TextF, ItemGrid, CircularLoader, GridContainer, Danger, Warning } from '..'
import { connect } from 'react-redux'
import createprojectStyles from '../../assets/jss/components/projects/createprojectStyles'
import EditOrgAutoSuggest from './EditOrgAutoSuggest'

// var moment = require("moment")
var countries = require("i18n-iso-countries");

// // const ITEM_PADDING_TOP = 8;
// const MenuProps = {
// 	PaperProps: {
// 		style: {
// 			maxHeight: 300,
// 			width: 250,
// 		},
// 	},
// };

class EditOrg extends Component {
	constructor(props) {
		super(props)

		this.state = {
			org: {},
			country: {},
			creating: false,
			created: false,
			loading: true,
			openSnackBar: false,
		}
	}
	handleValidation = () => {
		/* Address, City, Postcode, Country, Region, Website. */
		let errorCode = [];
		const { address, city, zip, country, region, url } = this.state.org
		if (address === "") {
			errorCode.push(1)
		}
		if (city === "") {
			errorCode.push(2)
		}
		if (zip === "" ) {
			errorCode.push(3)
		}
		if (country === "") {
			errorCode.push(4)
		}
		if (region === "") {
			errorCode.push(5)
		}
		if (url === "") {
			errorCode.push(6)
		}
		this.setState({
			errorMessage: errorCode.map(c => <Danger key={c}>{this.errorMessages(c)}</Danger>),
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
				return t("orgs.validation.noaddress")
			case 2:
				return t("orgs.validation.nocity")
			case 3:
				return t("orgs.validation.nozip")
			case 4:
				return t("orgs.validation.nocountry")
			case 5:
				return t("orgs.validation.noregion")
			case 6:
				return t("orgs.validation.nourl")
			default:
				return ""
		}
	}
	componentDidMount = async () => {
		this._isMounted = 1
		let id = this.props.match.params.id
		await getOrg(id).then(rs => {
			if (rs && this._isMounted) {
				this.setState({
					country: {
						id: rs.country.length > 2 ? countries.getAlpha2Code(rs.country, "en") ? countries.getAlpha2Code(rs.country, "en") : countries.getAlpha2Code(rs.country, "da")
							: rs.country, label: countries.getName(rs.country, this.props.language) ? countries.getName(rs.country, this.props.language) : '' },
					org: {
						...rs,
						country: rs.country.length > 2 ? countries.getAlpha2Code(rs.country, "en") ? countries.getAlpha2Code(rs.country, "en") : countries.getAlpha2Code(rs.country, "da")
							: rs.country
					},
				})
			}

		})
		this.setState({
			loading: false
		})
		this.props.setHeader(this.props.t("orgs.updateOrg"), true, `/org/${id}`)
	}

	componentWillUnmount = () => {
		this._isMounted = 0
		clearTimeout(this.timer)
	}

	handleCountryChange = value => {
		this.setState({
			error: false,
			country: { id: value, label: countries.getName(value, this.props.language) },
			org: {
				...this.state.org,
				country: countries.getName(value, this.props.language) ? value : ''
			}
		})
	}
	
	handleChange = (id) => e => {
		e.preventDefault()
		if (e.target.validity.valid)
		{this.setState({
			error: false,
			org: {
				...this.state.org,
				[id]: e.target.value
			}
		})}
	}
	snackBarClose = () => {
		this.setState({ openSnackBar: false })
		this.redirect = setTimeout(async => {
			this.props.history.push(`/org/${this.state.org.id}`)
		}, 1e3)
	}
	handleUpdateOrg = () => {
		clearTimeout(this.timer)
		this.timer = setTimeout(async () => {
			if (this.handleValidation()) {
				return updateOrg(this.state.org).then(rs => rs ?
					this.setState({ created: true, creating: false, openSnackBar: true }) :
					this.setState({ created: false, creating: false, error: true, errorMessage: this.props.t("orgs.validation.networkError") })
					, 2e3)
			}
			else {
				this.setState({
					creating: false,
					error: true,
				})
			}
		})

	}

	goToOrg = () => {
		this.props.history.push('/org/' + this.props.match.params.id)
	}

	render() {
		const { classes, t } = this.props
		const { created, error, loading, org } = this.state
		const buttonClassname = classNames({
			[classes.buttonSuccess]: created,
		})

		return (
			!loading ?
				<GridContainer justify={'center'}>
					<Paper className={classes.paper}>
						<form className={classes.form}>
							<ItemGrid xs={12}>
								<Collapse in={this.state.error}>
									<Warning>
										<Danger>
											{this.state.errorMessage}
										</Danger>
									</Warning>
								</Collapse>
							</ItemGrid>
							<ItemGrid container xs={12} md={6}>
								<TextF
									autoFocus
									id={"title"}
									label={t("orgs.fields.name")}
									value={org.name}
									className={classes.textField}
									handleChange={this.handleChange("name")}
									margin="normal"
									noFullWidth
									error={error}
								/>
							</ItemGrid>
							<ItemGrid container xs={12} md={6}>
								<TextF

									id={"address"}
									label={t("orgs.fields.address")}
									value={org.address}
									className={classes.textField}
									handleChange={this.handleChange("address")}
									margin="normal"
									noFullWidth
									error={error}
								/>
							</ItemGrid>
							<ItemGrid container xs={12} md={6}>
								<TextF

									id={"city"}
									label={t("orgs.fields.city")}
									value={org.city}
									className={classes.textField}
									handleChange={this.handleChange("city")}
									margin="normal"
									noFullWidth
									error={error}
								/>
							</ItemGrid>
							<ItemGrid container xs={12} md={6}>
								<TextF

									id={"postcode"}
									label={t("orgs.fields.zip")}
									value={org.zip}
									className={classes.textField}
									handleChange={this.handleChange("zip")}
									margin="normal"
									noFullWidth
									error={error}
									type={"number"}
									pattern="[0-9]*"
								/>
							</ItemGrid>
							<ItemGrid container xs={12} md={6}>
								<TextF

									id={"region"}
									label={t("orgs.fields.region")}
									value={org.region}
									className={classes.textField}
									handleChange={this.handleChange("region")}
									margin="normal"
									noFullWidth
									error={error}
								/>
							</ItemGrid>
							<ItemGrid container xs={12} md={6}>
								<TextF

									id={"website"}
									label={t("orgs.fields.url")}
									value={org.url}
									className={classes.textField}
									handleChange={this.handleChange("url")}
									margin="normal"
									noFullWidth
									error={error}
								/>
							</ItemGrid>
							<ItemGrid container xs={12}>
								<EditOrgAutoSuggest
									country={this.state.country.label ? this.state.country.label : this.state.country.id}
									handleChange={this.handleCountryChange}
									suggestions={
										Object.keys(countries.getNames(this.props.language)).map(
											country => ({ value: country, label: countries.getName(country, this.props.language) }))} />
								{/* <FormControl className={classes.formControl}>
									<Fragment>
										<InputLabel FormLabelClasses={{ root: classes.label }} color={"primary"} htmlFor="select">
											{t("orgs.fields.country")}
										</InputLabel>
										<Select
											error={error}
											color={"primary"}
											value={org.country}
											onChange={this.handleChange("country")}
											input={<Input id="select" classes={{ underline: classes.underline }} />}
											MenuProps={MenuProps}
										>
											{Object.keys(countries.getNames(this.props.language)).map(country => {
												return <MenuItem key={country} value={country}>
													{countries.getName(country, this.props.language)}
												</MenuItem>
											}
											)}
										</Select>
									</Fragment>
								</FormControl> */}
							</ItemGrid>
						</form>
						<ItemGrid xs={12} container justify={'center'}>
							<Collapse in={this.state.creating} timeout="auto" unmountOnExit>
								<CircularLoader notCentered />
							</Collapse>
						</ItemGrid>
						<Grid container justify={"center"}>
							<div className={classes.wrapper}>
								<Button
									variant="contained"
									color="primary"
									className={buttonClassname}
									disabled={this.state.creating || this.state.created}
									onClick={this.state.created ? this.goToOrg : this.handleUpdateOrg}>
									{this.state.created ?
										<Fragment><Check className={classes.leftIcon} />{t("snackbars.redirect")}</Fragment>
										: <Fragment><Save className={classes.leftIcon} />{t("orgs.updateOrg")}</Fragment>}
								</Button>
							</div>
						</Grid>
					</Paper>
					<Snackbar
						anchorOrigin={{ vertical: "bottom", horizontal: "right" }}
						open={this.state.openSnackBar}
						onClose={this.snackBarClose}
						ContentProps={{
							'aria-describedby': 'message-id',
						}}
						autoHideDuration={1500}
						message={
							<ItemGrid zeroMargin noPadding justify={'center'} alignItems={'center'} container id="message-id">
								<Check className={classes.leftIcon} color={'primary'} />
								{t("snackbars.orgUpdated", { org: org.name })}
							</ItemGrid>
						}
					/>
				</GridContainer>
				: <CircularLoader />
		)
	}
}
const mapStateToProps = (state) => ({
	language: state.localization.language

})

const mapDispatchToProps = {

}

export default connect(mapStateToProps, mapDispatchToProps)(withStyles(createprojectStyles, { withTheme: true })(EditOrg))