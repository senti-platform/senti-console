import { api } from './data'

//#region GET User,Users
export const getAllUsers = async () => {
	var data = await api.get('core/users').then(rs => rs.data)
	// console.log('getAllUsers', data)
	return data
}
export const getUser = async (userId) => {
	var data = await api.get(`core/user/${userId}`).then(rs => rs.data)
	// console.log('getUser', userId, data)
	return data
}
export const createUser = async (user) => {
	let data = await api.post(`core/user`, user).then(rs => rs.data)
	// console.log('createUser', data)
	return data
}
export const editUser = async (user) => {
	let data = await api.put(`core/user/${user.id}`, user).then(rs => rs.data)
	console.log('editUser', data)
	return data
}
export const getAllOrgs = async () => {
	var data = await api.get(`core/orgs`).then(rs => rs.data)
	// console.log('getOrgs', data)
	return data
}

export const getOrg = async(orgId) => {
	var data = await api.get(`core/org/${orgId}`).then(rs => rs.data)
	// console.log('getOrg', orgId, data)
	return data
}
export const updateOrg = async(org) => {
	var data = await api.put(`core/org/${org.id}`, org).then(rs => rs.data)
	return data
}
export const createOrg = async (org) => {
	var result = await api.post('core/org', org).then(rs => rs.data)
	return result
}
export const getCreateOrg = async () => {
	var result = await api.get('core/org/empty')
	return result
}
//#endregion