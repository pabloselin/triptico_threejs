import { render, Component } from "@wordpress/scripts";

import BaseTriptico from "./BaseTriptico.js";

class App extends Component {
	constructor() {
		super();
	}

	render() {
		return <BaseTriptico />;
	}
}

const appContainer = document.getElementById("triptico_fiber");

if (appContainer) {
	render(<App />, appContainer);
}
