import React from 'react'
import { FormControl, withStyles, Select, Input, MenuItem, InputLabel } from '@material-ui/core';
const styles = theme => ({
	formControl: {
		marginTop: 16,
		marginBottom: 8,
		minWidth: 230
	},
});

const DSelect = (props) => {
	const { classes, value, onChange, menuItems, label, theme } = props
	let mobile = window.innerWidth < theme.breakpoints.values.md ? true : false
	return <FormControl className={classes.formControl} fullWidth={mobile}>
		{label ? <InputLabel FormLabelClasses={{ root: classes.label }} color={"primary"} htmlFor="select-multiple-chip">
			{label}
		</InputLabel> : null}
		<Select
			fullWidth={mobile}
			value={value}
			onChange={onChange}
			input={<Input classes={{ root: classes.label }} />}
		>
			{menuItems.map((m, i) => {
				return <MenuItem key={i} value={m.value}>
					{m.label}
				</MenuItem>
			})}
				})}
		</Select>
	</FormControl>
}

export default withStyles(styles, { withTheme: true })(DSelect)