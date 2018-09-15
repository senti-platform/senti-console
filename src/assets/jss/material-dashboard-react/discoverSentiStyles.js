// ##############################
// // // RegularCard styles
// #############################

import ImgDevices from 'assets/img/devices.png'
import ImgTexture from 'assets/img/texture.png'
import { primaryColor } from '../material-dashboard-react';

const discoverSentiStyle = theme => ({
	root: {
		backgroundColor: primaryColor,
		width: "100%",
		height: "600px"
	},
	devicesPicture: {
		backgroundImage: `url(${ImgDevices})`,
		backgroundRepeat: "no-repeat",
		backgroundPosition: "top right",
		width: "100%",
		height: "600px"
	},
	texturePicture: {
		backgroundImage: `url(${ImgTexture})`,
		backgroundRepeat: "no-repeat",
		backgroundPosition: "bottom",
		backgroundColor: primaryColor,
		width: "100%",
		height: "600px"
	}
});

export default discoverSentiStyle;
