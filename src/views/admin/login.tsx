
import styles from "src/style/views/admin/login.m.less";
import { Form, FormStyles } from "@dunes/comps";
import formStyles from "src/style/comp/Form.m.less";

export default class Login extends View {

	willShow() {
		if (Fire.auth.self.currentUser) {
			return {to: location.origin + "/admin"}
		}
	}

	#email = "";
	#password = "";

	content({view}: {view: Login}) {
		return (
			<div id="app">
				<div cl={styles.wrapper}>
					<Form
						css={formStyles as FormStyles}
						submitText="Log In"
						titleText="Admin Login"
						onsubmit={async (e) => {
							e.preventDefault()
							try {
								await Fire.auth.login(view.#email, view.#password);
								await router.reloadCurrent();
							}
							catch(error) {
								alert(error);
							}
						}}
						inputs={[
							{
								title: "Email",
								input: (
									<input
										required
										value={view.#email}
										oninput={e => view.#email = e.target.value}
										type="email"
									/>
								)
							},
							{
								title: "Password",
								input: (
									<input
										required
										value={view.#password}
										oninput={e => view.#password = e.target.value}
										type="password"
									/>
								)
							}
						]}
					/>
					<div cl={styles.return_wrapper}>
						<span>Meant to go to site?</span>
						<Anchor href="/">Return</Anchor>
					</div>
				</div>
			</div>
		)
	}
}