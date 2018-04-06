import React, { Component } from 'react'
import { ListItemContainer, ExpandButtonContainer, Text, ListCardItem, Button, ButtonContainer, ControlsContainer, Cell } from './ListStyles'
import Icon from 'odeum-ui/lib/components/Icon/Icon'
import Checkbox from '../Views/Components/CheckBox/CheckBox'
import ExpandedCardInfo from '../Card/ExpandedCardInfo'
export default class ListCard extends Component {
	constructor(props) {
		super(props)

		this.state = {
			expand: false,
			cardExpand: false
		}
	}
	// shouldComponentUpdate = (nextProps, nextState) => {
	// 	if (nextProps.isChecked !== this.props.isChecked)
	// 		return true
	// 	if (this.state.expand !== nextState.expand)
	// 		return true
	// 	if (this.state.cardExpand !== nextState.cardExpand)
	// 		return true
	// 	if (this.state.expand === true)
	// 		if (this.props.item.id !== nextProps.open) {
	// 			this.setState({ expand: false })
	// 			return true
	// 		}

	// }

	componentWillUpdate = (nextProps, nextState) => {
		if (this.state.expand === true)
			if (this.props.item.id !== nextProps.open)
				this.setState({ expand: false })
	}

	viewCard = (open) => e => {
		e.preventDefault()
		this.setState({ cardExpand: open, expand: false })
	}
	onExpand = () => {
		this.setState({ expand: !this.state.expand })
		this.props.handleActiveListDrawer(this.props.item.id)
	}

	onChecked = (isChecked) => {
		this.props.onChecked(this.props.item.id, isChecked)
		// this.setState({ checked: !this.state.checked })
	}

	render() {
		const { expand, cardExpand } = this.state
		const { item, column, columnCount, isChecked } = this.props
		return (
			<React.Fragment>
				<ListCardItem>
					<Checkbox isChecked={isChecked} size={'medium'} onChange={this.onChecked} />
					<ListItemContainer selected={isChecked} columnCount={columnCount}>
						{column.map((c, cIndex) => {
							return c.visible ? <Cell key={cIndex}>

								{item[c.column] instanceof Date ? <Text title={item[c.column].toLocaleDateString()}>
									{item[c.column].toLocaleDateString()}
								</Text> :
									c.column === 'user' ?
										<React.Fragment>
											<img src={item[c.column].img} alt={'profilepic'} style={{ height: '26px', borderRadius: 20, marginRight: 4 }} />
											<Text title={item[c.column].name}>
												{item[c.column].name}
											</Text>
										</React.Fragment> :
										c.column === 'img' ?
											<Text> <img src={item[c.column]} height={30} alt={'Projekt Img'} /></Text> :
											<Text title={item[c.column].toString()}>{item[c.column].toString()}</Text>}
							</Cell> : null

						})}
					</ListItemContainer>
					<ControlsContainer>
						<ButtonContainer pose={!this.state.expand ? 'open' : 'close'} /* horizOpen={expand} */ style={{ flexFlow: 'row nowrap', borderRadius: 0, height: 'inherit' }}>
							<Button horizOpen={expand} onClick={this.viewCard(true)}>
								<Icon color={'#5E5E5E'} icon={'mode_edit'} iconSize={23} />
							</Button>
							<Button horizOpen={expand}>
								<Icon color={'#5E5E5E'} icon={'share'} iconSize={23} />
							</Button>
							<Button horizOpen={expand}>
								<Icon color={'#5E5E5E'} icon={'library_add'} iconSize={23} />
							</Button>
						</ButtonContainer>
						<ExpandButtonContainer selected={isChecked} onClick={this.onExpand}>
							<Icon icon={'more_vert'} color={'inherit'} activeColor={'#fff'} active={isChecked} iconSize={23} />
						</ExpandButtonContainer>
					</ControlsContainer>
				</ListCardItem>
				<ExpandedCardInfo cardExpand={cardExpand} {...this.props} handleVerticalExpand={this.viewCard} />
			</React.Fragment>
		)
	}
}
