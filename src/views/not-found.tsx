import { TopBar } from "src/comps/home/TopBar";
import { Wrapper } from "src/comps/home/Wrapper";

export default class NotFound extends View {
	content() {
		
		return (
			<Wrapper>
				<TopBar/>
				Hello Not Found
				<Anchor href="/">Home</Anchor>
			</Wrapper>
		)
	}
}