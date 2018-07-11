import React from 'react';
import PropTypes from 'prop-types';
import Autosuggest from 'react-autosuggest';
import match from 'autosuggest-highlight/match';
import parse from 'autosuggest-highlight/parse';
// import { /* TextField, */ Input } from '@material-ui/core';
import Paper from '@material-ui/core/Paper';
import MenuItem from '@material-ui/core/MenuItem';
import { withStyles } from '@material-ui/core/styles';
import searchStyles from 'assets/jss/components/search/searchStyles';
// import { Search } from '@material-ui/icons'
// import { ItemGrid } from '..';
import SearchInput from './SearchInput';
import { ClickAwayListener } from '@material-ui/core';

function renderInput(inputProps) {
	// const { classes, ref, ...other  } = inputProps;
	console.log('renderInput', inputProps)
	return (
		<SearchInput {...inputProps} />
	);
}

function renderSuggestion(suggestion, { query, isHighlighted }) {
	const matches = match(suggestion.label, query);
	const parts = parse(suggestion.label, matches);

	return (
		<MenuItem selected={isHighlighted} component="div">
			<div>
				{parts.map((part, index) => {
					return part.highlight ? (
						<span key={String(index)} style={{ fontWeight: 300 }}>
							{part.text}
						</span>
					) : (
						<strong key={String(index)} style={{ fontWeight: 500 }}>
							{part.text}
						</strong>
					);
				})}
			</div>
		</MenuItem>
	);
}

function renderSuggestionsContainer(options) {
	const { containerProps, children } = options;
	return (
		<Paper {...containerProps} square>
			{children}
		</Paper>
	);
}

function getSuggestionValue(suggestion) {
	return suggestion.label;
}

function getSuggestions(value, suggestions) {
	const inputValue = value.trim().toLowerCase();
	const inputLength = inputValue.length;
	let count = 0;

	return inputLength === 0
		? []
		: suggestions.filter(suggestion => {
			const keep =
				count < 5 && suggestion.label.toLowerCase().slice(0, inputLength) === inputValue;

			if (keep) {
				count += 1;
			}

			return keep;
		});
}

class IntegrationAutosuggest extends React.Component {
	constructor(props) {
		super(props)

		this.state = {
			value: '',
			suggestions: [],
			open: false
		}
		this.inputRef = React.createRef()

	}

	handleSuggestionsFetchRequested = ({ value }) => {
		this.setState({
			suggestions: getSuggestions(value, this.props.suggestions),
		});
	};

	handleSuggestionsClearRequested = () => {
		this.setState({
			suggestions: [],
		});
	};

	handleChange = (event, { newValue }) => {
		this.props.handleFilterKeyword(newValue)
	};
	focusInput = () => {
		if (this.state.open)
			// this.inputRef.current.focus()
			this.inputRef.current.focus()
	}
	handleOpen = () => {
		this.setState({ open: !this.state.open }, this.focusInput)
	}
	handleClose = () => {
		this.setState({ open: false })
	}
	render() {
		const { classes, right } = this.props;

		return (
			<div className={classes.suggestContainer}>

				<ClickAwayListener onClickAway={this.handleClose}>
					<Autosuggest
						theme={{
							container: classes.container + " " + (right ? classes.right : ''),
							suggestionsContainerOpen: classes.suggestionsContainerOpen,
							suggestionsList: classes.suggestionsList,
							suggestion: classes.suggestion,
						}}
						focusInputOnSuggestionClick={false}
						renderInputComponent={renderInput}
						suggestions={this.state.suggestions}
						onSuggestionsFetchRequested={this.handleSuggestionsFetchRequested}
						onSuggestionsClearRequested={this.handleSuggestionsClearRequested}
						onSuggestionSelected={this.focusInput}
						renderSuggestionsContainer={renderSuggestionsContainer}
						getSuggestionValue={getSuggestionValue}
						renderSuggestion={renderSuggestion}
						inputProps={{
							classes,
							value: this.props.searchValue,
							onChange: this.handleChange,
							reference: this.inputRef,
							open: this.state.open,
							handleOpen: this.handleOpen,
							handleClose: this.handleClose
						}}
					/>
				</ClickAwayListener>
			</div>
		);
	}
}

IntegrationAutosuggest.propTypes = {
	classes: PropTypes.object.isRequired,
};

export default withStyles(searchStyles)(IntegrationAutosuggest);