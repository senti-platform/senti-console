const breadcrumbs = (t, name, id) => {
	return {
		'createorg': [
			{ label: t('sidebar.orgs'), path: '/management/orgs' },
			{ label: t('menus.create.org'), path: '/management/orgs/new' }
		],
		'editorg': [
			{ label: t('sidebar.orgs'), path: '/management/orgs' },
			{ label: name, path: `/management/org/${id}` },
			{ label: t('menus.edits.org'), path: `/management/org/${id}/edit` }
		],
		'createuser': [
			{ label: t('sidebar.users'), path: '/management/users' },
			{ label: t('menus.create.user'), path: '/management/users/new' }
		],
		'edituser': [
			{ label: t('sidebar.users'), path: '/management/users' },
			{ label: name, path: `/management/user/${id}` },
			{ label: t('menus.edits.user'), path: `/management/user/${id}/edit` }
		],
		'settings': [
			{
				label: t('sidebar.settings'),
				path: '/settings'
			}
		],
		'user': [
			{
				label: t('sidebar.users'),
				path: '/users'
			},
			{
				label: name,
				path: '/user/%id'
			}
		],
		'users': [
			{
				label: t('sidebar.users'),
				path: '/users'
			}
		],
		'orgs': [
			{
				label: t('sidebar.orgs'),
				path: '/users'
			}
		],
		'org': [
			{
				label: t('sidebar.orgs'),
				path: '/orgs'
			},
			{
				label: name,
				path: '/org/%id'
			}
		],
		'favorites': [{
			label: t('sidebar.favorites'),
			path: '/favorites'
		}],
		'collection': [
			{
				label: t('sidebar.collections'),
				path: '/collections'
			},
			{
				label: name,
				path: '/collection/%id'
			}
		],
		'collections': [{
			label: t('sidebar.collections'),
			path: '/collections'
		}],
		'projects': [{
			label: t('sidebar.projects'),
			path: '/projects'
		}],
		'project': [
			{
				label: t('sidebar.projects'),
				path: '/projects'
			},
			{
				label: name,
				path: '/project/%id'
			}
		],
		'devices': [{
			label: t('sidebar.devices'),
			path: '/devices'
		}],
		'device': [
			{
				label: t('sidebar.devices'),
				path: '/devices'
			},
			{
				label: name,
				path: '/device/%id'
			}
		]

	}
}
export default breadcrumbs