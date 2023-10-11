import { TopBar } from "src/comps/home/TopBar";

export default class NotFound extends View {
	content() {
		
		return (
			<div id="app">
				<TopBar/>
				Hello Not Found
				<Anchor href="/">Home</Anchor>
			</div>
		)
	}
}