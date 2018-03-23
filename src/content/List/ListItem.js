import React, { PureComponent } from 'react'
import { ListItemContainer, ExpandButtonContainer, Text, ListCardItem, Button, ButtonContainer, ControlsContainer, Cell } from './ListStyles'
import Icon from 'odeum-ui/lib/components/Icon/Icon'
import Checkbox from '../Views/Components/CheckBox/CheckBox'

export default class ListCard extends PureComponent {
	constructor(props) {
		super(props)

		this.state = {
			expand: false,
			cardExpand: false
		}
	}

	// setExpandedCardRef = (node) => {
	// 	this.node = node
	// }

	// handleExpand = (e) => {
	// 	if (this.state.cardExpand) {
	// 		this.setState({ cardExpand: false })
	// 	}
	// 	else {
	// 		this.setState({ cardExpand: true })
	// 	}
	// }

	onExpand = () => {
		this.setState({ expand: !this.state.expand })
	}

	onChecked = (isChecked) => {
		this.props.onChecked(this.props.item.id, isChecked)
		// this.setState({ checked: !this.state.checked })
	}

	render() {
		const { expand } = this.state
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
										<Text title={item[c.column].toString()}>{item[c.column].toString()}</Text>}
							</Cell> : null

						})}
					</ListItemContainer>
					<ControlsContainer horizOpen={expand}>
						<ButtonContainer horizOpen={expand} style={{ flexFlow: 'row nowrap', borderRadius: 0, height: 'inherit' }}>
							<Button horizOpen={expand}>
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
							<Icon icon={'more_vert'} color={'#FFF'} active={isChecked} iconSize={23} />
						</ExpandButtonContainer>
					</ControlsContainer>
				</ListCardItem>
			</React.Fragment>
		)
	}
}
