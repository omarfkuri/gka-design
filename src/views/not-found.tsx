import { Wrapper } from "src/comps/home/Wrapper";

export default class NotFound extends View {
	content() {
		
		return (
			<Wrapper>
				Hello Not Found
				<Anchor href="/">Home</Anchor>
			</Wrapper>
		)
	}
}