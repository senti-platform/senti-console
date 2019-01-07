import React, { Component, Fragment } from 'react'
import { Dialog, Button } from '@material-ui/core'
import { GridContainer, ItemG, Info } from 'components'
import { CSVLink } from 'react-csv'
import moment from 'moment'
import zipcelx from 'zipcelx'

// import DevicePDF from './DevicePDF';

class ExportModal extends Component {
	CSVHeaders = [
		{ label: 'Device ID', key: 'id' },
		{ label: 'Start Date', key: 'startDate' },
		{ label: 'End Date', key: 'endDate' },
		{ label: 'Count', key: 'count' }
	]
	exportToJson = () => { 
		var data = this.props.data
		var json = JSON.stringify(data);
		var blob = new Blob([json], { type: "application/json" });
		var url = URL.createObjectURL(blob);
		return url
	}
	exportToXLSX = () => {
		var data = this.props.data
		let config = {
			filename: `senti.cloud-data-${moment().format('DD-MM-YYYY')}`,
			sheet: {
				data: [
					[
						{ type: 'string', value: 'Device ID' },
						{ type: 'string', value: 'Start Date' },
						{ type: 'string', value: 'End Date' },
						{ type: 'string', value: 'Count' },
					], ...data.map(d => [
						{ type: 'string', value: d.id },
						{ type: 'date', value: d.startDate },
						{ type: 'date', value: d.endDate },
						{ type: 'number', value: d.count },
					])]
			}
		}
		zipcelx(config)
	}
	render() {
		const { open, handleClose, t, data } = this.props

		return (
			<Dialog
				open={open}
				onClose={handleClose}
			>

				<GridContainer>
					{data &&
						<Fragment>
							<ItemG xs={12}>
								<Info>{t('dialogs.export.message')}</Info>
							</ItemG>
							<ItemG container spacing={8} >
								<ItemG>
									<Button filename={`senti.cloud-data-${moment().format('DD-MM-YYYY')}.csv`} data={data} headers={this.CSVHeaders} component={CSVLink} color={'primary'} variant={'contained'}>
										CSV
									</Button>
								</ItemG>
								<ItemG>
									<Button component={'a'} download={`senti.cloud-data-${moment().format('DD-MM-YYYY')}.json`} href={this.exportToJson()} target={'_blank'} color={'primary'} variant={'contained'}>
										JSON
									</Button>
								</ItemG>
								<ItemG>
									<Button color={'primary'} variant={'contained'} onClick={this.exportToXLSX}>
										XLSX
									</Button>
								</ItemG>
							</ItemG>
						</Fragment>
					}
				</GridContainer>
			</Dialog>
		)
	}
}

export default ExportModal
