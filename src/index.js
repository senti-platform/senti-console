import React from "react";
import ReactDOM from "react-dom";
import { createBrowserHistory } from "history";
import { Router, Route, Switch } from "react-router-dom";
import registerServiceWorker from './registerServiceWorker';
import "assets/css/material-dashboard-react.css?v=1.2.0";

import indexRoutes from "routes/index.js";
import { createMuiTheme, MuiThemeProvider } from '@material-ui/core/styles';
import { primaryColor, secondaryColor, hoverColor } from "assets/jss/material-dashboard-react";

const hist = createBrowserHistory();

const theme = createMuiTheme({
	palette: {
		primary: {
			// light: will be calculated from palette.primary.main,
			main: primaryColor,
			// dark: will be calculated from palette.primary.main,
			// contrastText: will be calculated to contast with palette.primary.main
		},
		secondary: {
			main: secondaryColor,
			light: hoverColor,
			// dark: will be calculated from palette.secondary.main,
		},
		// error: will use the default color
	},
});

registerServiceWorker();
ReactDOM.render(
	<MuiThemeProvider theme={theme}>
		<Router history={hist}>
			<Switch>
				{indexRoutes.map((prop, key) => {
					return <Route path={prop.path} component={prop.component} key={key} exact={prop.exact ? true : false} />;
				})}
			</Switch>
		</Router>
	</MuiThemeProvider>,
	document.getElementById("root")
);
