import { create } from 'apisauce'
import cookie from 'react-cookies'
// https://betabackend.senti.cloud/
// https://senti.cloud
export const loginApi = create({
	baseURL: 'https://betabackend.senti.cloud/rest/odeum/',
	timout: 30000,
	headers: {
		'Accept': 'application/json',
		'Content-Type': 'application/json'
	}
})
export const mapApi = create({
	baseURL: 'https://maps.googleapis.com/maps/api/geocode/',
	timeout: 30000,
	params: {
		// key: process.env.REACT_APP_SENTI_MAPSKEY
	}
})
export const imageApi = create({
	baseURL: 'https://betabackend.senti.cloud/rest/',
	timeout: 30000,
	headers: {
		'Accept': 'text/html,application/xhtml+xml,application/xml;q=0.9,*/*;q=0.8',
		'Content-Type': 'multipart/form-data',
		'ODEUMAuthToken': ''
	},
})
export const api = create({
	baseURL: 'https://betabackend.senti.cloud/rest/',
	// baseURL: 'http://api.dashboard.senti.cloud/web/',
	// baseURL: 'http://localhost:80',
	timeout: 30000,
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