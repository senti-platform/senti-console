import { createStore, applyMiddleware, compose } from 'redux'
import thunk from 'redux-thunk';
import rootReducer from './rootReducer'

let composeMiddleware = compose(
	applyMiddleware(thunk),
	window.__REDUX_DEVTOOLS_EXTENSION__ ? window.__REDUX_DEVTOOLS_EXTENSION__() : f => f
)
const configureStore = () => {
	const store = createStore(rootReducer, composeMiddleware)
	console.log(module.hot)
	if (process.env.NODE_ENV !== 'production') {
		if (module.hot) {
			module.hot.accept('./rootReducer', () => {
				store.replaceReducer(rootReducer);
			});
		}
	}
	return store
}


export default configureStore