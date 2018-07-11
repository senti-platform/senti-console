import React, { Component } from 'react';
import { /* TextField, */ Input, ClickAwayListener } from '@material-ui/core';

import { withStyles } from '@material-ui/core/styles';
import searchStyles from 'assets/jss/components/search/searchStyles';
import { Search } from '@material-ui/icons'
import { ItemGrid } from '..';
import className from 'classnames'
class SearchInput extends Component {
	constructor(props) {
	  super(props)
	
	  this.state = {
		 open: false
	  }
		// this.inputRef = React.createRef()
	}
	focusInput = () => {
		if (this.state.open)
			// this.inputRef.current.focus()
			this.props.reference.current.focus()
	}
	handleOpen = () => {

		this.setState({ open: !this.state.open }, this.focusInput)
		// this.props.ref.focus()
		// console.log(this.inputRef.current)
		// if (this.state.open === true)
		// this.inputRef.current.focus()
	}	
	handleClose = () => {
		// if (this.props.value === '')
		this.setState({ open: false })
	}
	render() {
		const { classes, ref, open, ...other } = this.props;
		// console.log(this.props)
		return (
			<ItemGrid container noPadding alignItems={'center'} style={{ width: "auto", margin: 0 }}>
				{/* 	<ClickAwayListener onClickAway={this.handleClose}> */}

				<div className={className(classes.inputContainer, { [classes.inputContainerFocused]: this.props.open }, { [classes.inputContainerUnfocused]: !this.props.open })}>
					<Search className={className(classes.icon, { [classes.iconActive]: this.props.value !== '' ? true : false })} onClick={this.props.handleOpen}/>
					<Input
						// inputRef={this.inputRef}
						placeholder='Search'
						inputRef={this.props.reference}
						onFocus={this.inputFocused}
						classes={{ input: classes.input, underline: classes.underline, root: classes.inputRoot }}
						{...other}
					/>
				</div>
				{/*</ClickAwayListener>*/}
			</ItemGrid>
		)
	}
}
export default withStyles(searchStyles)(SearchInput)