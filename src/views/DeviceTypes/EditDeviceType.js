import React, { useState, useEffect } from 'react'
import { useSelector, useDispatch } from 'react-redux'
import { getDeviceTypeLS, getDeviceTypes } from 'redux/data';
import { updateDeviceType } from 'variables/dataDeviceTypes';
import CreateDeviceTypeForm from 'components/DeviceTypes/CreateDeviceTypeForm';
import { updateFav, isFav } from 'redux/favorites';
import { CircularLoader } from 'components';
import { useLocalization, useHistory, useSnackbar, useEventListener } from 'hooks';
import { useCallback } from 'react';


const EditDeviceType = props => {
	//Hooks
	const dispatch = useDispatch()
	const t = useLocalization()
	const history = useHistory()
	const s = useSnackbar().s
	//Redux

	const accessLevel = useSelector(store => store.settings.user.privileges)
	const orgId = useSelector(store => store.settings.user.org.id)
	const cloudfunctions = useSelector(store => store.data.functions)
	const devicetype = useSelector(store => store.data.deviceType)
	const orgs = useSelector(store => store.data.orgs)

	//State
	const [loading, setLoading] = useState(true)
	const [openCF, setOpenCF] = useState({ open: false, where: null })
	const [deviceType, setDeviceType] = useState(null)
	// const [keyName, setKeyName] = useState('')
	// const [value, setValue] = useState('')
	const [org, setOrg] = useState(null)
	const [sensorMetadata, setSensorMetadata] = useState(null)
	const [select, setSelect] = useState(null)


	//Const
	const id = props.match.params.id
	const { location, setHeader, setBC, setTabs } = props

	const keyHandler = useCallback((e) => {
		if (e.key === 'Escape') {
			let prevURL = props.location.prevURL ? props.location.prevURL : `/deviceType/${id}`
			history.push(prevURL)
		}
	}, [history, id, props.location.prevURL])

	useEventListener('keydown', keyHandler);

	useEffect(() => {
		let getDT = async () => dispatch(await getDeviceTypeLS(id))
		getDT()
	}, [dispatch, id])


	useEffect(() => {
		if (devicetype && !deviceType) {
			setDeviceType(devicetype)
			setSensorMetadata({
				metadata: devicetype.metadata ? devicetype.metadata : [],
				outbound: devicetype.outbound ? devicetype.outbound : [],
				inbound: devicetype.inbound ? devicetype.inbound : []
			})
			setOrg(orgs[orgs.findIndex(o => o.id === devicetype.orgId)])

			setLoading(false)
			let prevURL = location.prevURL ? location.prevURL : `/devicetype/${id}`
			setHeader('menus.edits.devicetype', true, prevURL, 'manage.devicetypes')

			setTabs({
				id: 'createDT',
				tabs: []
			})
			setBC('createdevicetype')
		}
	}, [deviceType, devicetype, id, location.prevURL, orgs, setBC, setHeader, setTabs])

	const handleChange = (what) => e => {
		setDeviceType({
			...deviceType,
			[what]: e.target.value
		})
	}
	const updtDeviceType = async () => {
		console.log(sensorMetadata.metadata)
		let deviceTypee = {
			...deviceType,
			outbound: sensorMetadata.outbound,
			inbound: sensorMetadata.inbound,
			metadata: sensorMetadata.metadata,
			orgId: org.id
		}
		return await updateDeviceType(deviceTypee)
	}
	const handleCreate = async () => {
		let rs = await updtDeviceType()
		if (rs) {
			let favObj = {
				id: deviceType.id,
				name: deviceType.name,
				type: 'devicetype',
				path: `/devicetype/${deviceType.id}`
			}
			if (dispatch(isFav(favObj))) {
				dispatch(updateFav(favObj))
			}
			s('snackbars.edit.devicetype', { dt: deviceType.name })
			dispatch(await getDeviceTypes(true, orgId, accessLevel.apisuperuser ? true : false))
			history.push(`/devicetype/${rs}`)
		}
		else
			s('snackbars.failed')
	}
	//#region Inbound Function

	const handleRemoveInboundFunction = index => e => {
		let mtd = sensorMetadata.inbound
		mtd = mtd.filter((v, i) => index !== i)
		setSensorMetadata({ ...sensorMetadata, inbound: mtd })
	}
	const handleAddInboundFunction = e => {
		let mtd = sensorMetadata.inbound
		setSensorMetadata({ ...sensorMetadata, inbound: [...mtd, { id: mtd.length, order: mtd.length, nId: -1 }] })
	}

	//#endregion

	//#region Outbound function

	const handleAddKey = e => {
		setSensorMetadata({ ...sensorMetadata, outbound: [...sensorMetadata.outbound, { key: '', nId: -1 }] })
	}

	const handleRemoveKey = (index) => e => {
		let newMetadata = sensorMetadata.outbound.filter((v, i) => i !== index)
		setSensorMetadata({ ...sensorMetadata, outbound: newMetadata })
	}

	const handleRemoveFunction = (i) => e => {
		let mtd = sensorMetadata.outbound
		mtd[i].nId = -1
		setSensorMetadata({ ...sensorMetadata, outbound: mtd })
	}

	const handleChangeKey = (v, i) => e => {
		let mtd = sensorMetadata.outbound
		mtd[i].key = e.target.value
		setSensorMetadata({ ...sensorMetadata, outbound: mtd })
	}

	const handleChangeType = index => e => {
		let mtd = sensorMetadata.outbound
		mtd[index].type = e.target.value
		setSensorMetadata({ ...sensorMetadata, outbound: mtd })
	}

	//#endregion

	//#region Metadata

	const handleAddMetadataKey = e => {
		let mtd = sensorMetadata.metadata
		mtd.push({ key: "", value: "" })
		setSensorMetadata({ ...sensorMetadata, metadata: mtd })
	}

	const handleRemoveMtdKey = index => e => {
		let newMetadata = sensorMetadata.metadata.filter((v, i) => i !== index)
		setSensorMetadata({ ...sensorMetadata, metadata: newMetadata })

	}

	const handleChangeMetadataKey = (i) => e => {
		let mtd = sensorMetadata.metadata
		mtd[i].key = e.target.value
		setSensorMetadata({ ...sensorMetadata, metadata: mtd })
	}

	const handleChangeMetadata = (i) => e => {
		let mtd = sensorMetadata.metadata
		mtd[i].value = e.target.value
		setSensorMetadata({ ...sensorMetadata, metadata: mtd })

	}

	//#endregion

	//#region Function selector

	const handleOpenFunc = (p, where) => e => {
		setSelect({ ...select, [where]: p })
		setOpenCF({ open: true, where })
	}

	const handleCloseFunc = () => {
		setOpenCF({
			open: false,
			where: null
		})

	}
	const handleChangeFunc = (o, where) => e => {
		let metadata = sensorMetadata[where]
		metadata[select[where]].nId = o.id
		setOpenCF({ open: false, where: null })
		setSensorMetadata({ ...sensorMetadata, [where]: metadata })
	}
	const handleOrgChange = org => {
		setOrg(org)
	}
	//#endregion

	const goToDeviceTypes = () => props.history.push('/devicetypes')

	return (loading ? <CircularLoader /> :

		<CreateDeviceTypeForm
			org={org}
			handleOrgChange={handleOrgChange}
			deviceType={devicetype}
			sensorMetadata={sensorMetadata}
			cfunctions={cloudfunctions}
			handleOpenFunc={handleOpenFunc}
			handleCloseFunc={handleCloseFunc}
			handleChangeFunc={handleChangeFunc}
			handleRemoveFunction={handleRemoveFunction}
			handleRemoveInboundFunction={handleRemoveInboundFunction}
			handleAddInboundFunction={handleAddInboundFunction}
			openCF={openCF}

			handleAddKey={handleAddKey}
			handleRemoveKey={handleRemoveKey}
			handleChangeKey={handleChangeKey}

			handleChangeType={handleChangeType}

			handleChangeMetadataKey={handleChangeMetadataKey}
			handleChangeMetadata={handleChangeMetadata}
			handleRemoveMtdKey={handleRemoveMtdKey}
			handleAddMetadataKey={handleAddMetadataKey}

			handleChange={handleChange}
			handleCreate={handleCreate}

			goToDeviceTypes={goToDeviceTypes}
			t={t}
		/>
	)
}

export default EditDeviceType
