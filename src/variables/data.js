import { create } from 'apisauce'
import cookie from 'react-cookies'
var loginApi = create({
	baseURL: 'https://senti.cloud/rest/odeum/',
	timout: 10000,
	headers: {
		'Accept': 'application/json',
		'Content-Type': 'application/json'
	}
})
var imageApi = create({
	baseURL: 'https://senti.cloud/rest/',
	timeout: 10000,
	headers: {
		'Accept': 'text/html,application/xhtml+xml,application/xml;q=0.9,*/*;q=0.8',
		'Content-Type': 'multipart/form-data',
		'ODEUMAuthToken': ''
	},
	// mode:
})
// Define the API
const api = create({
	baseURL: 'https://senti.cloud/rest/',
	// baseURL: 'http://api.dashboard.senti.cloud/web/',
	// baseURL: 'http://localhost:80',
	timeout: 10000,
	headers: {
		'Accept': 'application/json',
		'Content-Type': 'application/json',
		'ODEUMAuthToken': ''
	}
})

export const setToken = () => {
	try {
		var OAToken = cookie.load('SESSION').sessionID
		api.setHeader('ODEUMAuthToken', OAToken)
		imageApi.setHeader('ODEUMAuthToken', OAToken)
		return true
	}
	catch (error) {
		return false
	}

}
setToken()
// Login
export const loginUser = async (username, password) => {
	var session = await loginApi.post('/auth/basic', JSON.stringify({ username: username, password: password })).then(rs => rs.data)
	return session
}
export const getOrgs = async () => {
	// var OAToken = cookie.load('loginData').sessionID
	// api.setHeader('ODEUMAuthToken', OAToken)
	var orgs = await api.get('core/orgs').then(rs => rs.data)
	return orgs
}
export const getUsers = async (orgId) => {
	var users = await api.get('core/users/' + (orgId ? orgId : '')).then(rs => rs.data)
	return users
}
export const createUser = async (data) => {
	var newUser = await api.put('core/user', JSON.stringify(data))
	return newUser.ok
}
export const createOrg = async (data) => {
	var newOrg = await api.put('core/org', JSON.stringify(data))
	return newOrg
}
export const getUserInfo = async (userID) => {
	setToken()
	var user = await api.get('core/user/' + userID).then(rs => rs.data)
	return user
}
export const logOut = async () => {
	var session = cookie.load('loginData')
	var data = await loginApi.delete('/auth/basic', JSON.stringify(session.sessionID))
	cookie.remove('loginData')
	return data
}
export const createOneProject = async (project) => {
	var data = await api.post('senti/project', project).then(response => response.data)
	return data
}
export const getAllProjects = async () => {
	var data = await api.get('senti/projects').then((response => { return response.data }))
	return data
}

export const getProject = async (projectId) => {
	var data = await api.get('senti/project/' + projectId).then(rs => rs.data)
	return data
}
export const uploadPictures = async (device) => {
	const form = new FormData()
	// form.append('SentiFile', device.files[0], 'sentiFile')

	console.log(document.getElementById('contained-button-file').files[0]);
	form.append('sentiFile', document.getElementById('contained-button-file').files[0]);
	var config = {
		onUploadProgress: function (progressEvent) {
			var percentCompleted = Math.round((progressEvent.loaded * 100) / progressEvent.total);
			console.log(percentCompleted)
		}
	};
	var data = await imageApi.post('senti/image', form, config).then(rs => {console.log(rs); return rs})
	// var data = await api.post('senti/image', { device_id: device.device_id, sentiFile: device.files }).then(rs => rs)
	console.log(data)
	return false
}
// Get devices for Project
export const getDevicesForProject = async (projectId) => {
	var data = await api.get('senti/projectdevices/' + projectId).then((response) => response.data)
	if (data instanceof Array)
		return data
	else {
		if (data === null)
			return null
		else
			return [data]
	}
}
// Get available devices
export const getAvailableDevices = async () => {
	var data = await api.get('senti/availabledevices').then(rs => rs.data)
	return data
}
export const getAllDevices = async () => {
	var data = await api.get("senti/devices").then(rs => rs.data)
	return data
}
export const getDevice = async (id) => {
	var data = await api.get('senti/device/' + id).then(rs => rs.data)
	console.log(data)
	return data
}
export const calibrateDevice = async (device) => {
	var data = await api.post('senti/calibrate', device).then(rs => rs.data)
	return data

}
//Get Device Registrations for Project

export const getDeviceRegistrations = async (deviceIds, pId) => {
	var data = await api.get('senti/devicereg/' + deviceIds + '/' + pId).then(rs => rs.data)
	return data ? data.sort((a, b) => a.reg_date > b.reg_date ? -1 : a.reg_date < b.reg_date ? 1 : 0) : []
}

// Delete projects
export const deleteProject = async (projectIds) => {
	for (let i = 0; i < projectIds.length; i++) {
		var res = await api.delete('senti/project/' + projectIds[i])
	}
	return res
}

//Delete Orgs
export const deleteOrgs = async (orgIds) => {
	var result = false
	await orgIds.forEach(async orgId => {
		result = await api.delete('core/org/' + orgId)
	})
	return result
}

//Update Org
export const updateOrg = async (org) => {
	var result = await api.post('core/org/', org)
	return result
}

export const deleteUsers = async (userIds) => {
	var result = false
	await userIds.forEach(async uId => {
		result = await api.delete('core/user/' + uId)
	})
	return result
}

export const updateUser = async (user) => {
	var result = await api.post('core/user', user)
	return result
}