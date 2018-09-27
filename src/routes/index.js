import Dashboard from "layouts/Dashboard/Dashboard.js";
import LoginPage from "layouts/Login/LoginPage";
import ConfirmUser from "layouts/ConfirmUser/ConfirmUser"
const indexRoutes = [
	{ path: "/login", component: LoginPage },
	{ path: "/password/confirm/:lang/:token", component: ConfirmUser },
	{ path: "/", component: Dashboard },
];
export default indexRoutes;
