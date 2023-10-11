
import { Form, FormStyles } from "@dunes/comps";
import type { CollectionReference } from "firebase/firestore";
import { HomeProjects } from "src/comps/home/HomeProjects";
import { Wrapper } from "src/comps/home/Wrapper";
import formStyles from "src/style/comp/Form.m.less";
import styles from "src/style/views/home.m.less";

export default class Home extends View {
	content() {
		const messagesRef = Fire.data.col<Message>("messages");
		return (
			<Wrapper>
				<section id="hero" cl={`${styles.section_wrapper} ${styles.hero_wrapper}`}>
					<div cl={styles.hero_logo}>
						<img src="/logo.svg" draggable={false}/>
					</div>
					<div cl={styles.hero_links}>
						{Fire.auth.self.currentUser && <Anchor href="/admin">Admin</Anchor>}
						<a href="#about" cl={styles.hero_link}>About</a>
						<a href="#projects" cl={styles.hero_link}>Projects</a>
						<a href="#contact" cl={styles.hero_link}>Contact</a>
					</div>
				</section>
				<section id="about" cl={`${styles.section_wrapper} ${styles.about_wrapper}`}>
					<div cl={styles.about_title}>About</div>
					<div cl={styles.about_info}>
						Lorem, ipsum dolor sit amet consectetur adipisicing elit. 
						Eaque, eos. Magni culpa ullam aperiam nesciunt perferendis, 
						eius atque fuga tempora corporis soluta nam consectetur 
						molestiae reprehenderit distinctio magnam alias maiores 
						ut. Ducimus officia repellendus vero doloremque quo 
						consectetur earum odit.
					</div>
				</section>
				<section id="projects" cl={`${styles.section_wrapper} ${styles.projects_wrapper}`}>
					<div cl={styles.projects_title}>Projects</div>
					<HomeProjects/>
					<div cl={styles.projects_info}>
						<a href="/project/list" cl={styles.projects_link}>View All</a>
					</div>
				</section>
				<section id="contact" cl={`${styles.section_wrapper} ${styles.contact_wrapper}`}>
					<div cl={styles.contact_title}>Contact</div>
					<div cl={styles.contact_body_wrapper}>
						<div cl={styles.contact_info_wrapper}>
							<a cl={styles.contact_info_link}>Email</a>
							<a cl={styles.contact_info_link}>55 5050 2038</a>
						</div>
						<div cl={styles.contact_message_wrapper}>
							<MessageForm messagesRef={messagesRef}/>
						</div>
					</div>
				</section>
			</Wrapper>
		)
	}
}

const MessageForm: Component<{
	messagesRef: CollectionReference<Message>
	email?: string
	content?: string
	sent?: boolean
}> = ({messagesRef, email="", sent=false, content=""}, comp) => {
	return (
		sent
		? (
			<div>
				<div>Message sent!</div>
				<button onclick={() => {
					comp.re({sent: false})
				}}>Send Another</button>
			</div>
		)
		: (
			<Form 
				titleText="Send Message"
				onsubmit={async e => {
					e.preventDefault();

					try {
						await Fire.data.add(messagesRef, {
							email, 
							content, 
							createdAt: Fire.data.stamp(),
							updatedAt: Fire.data.stamp(),
							read: false
						})
						comp.re({
							email: "",
							content: "",
							sent: true
						});
					}
					catch(error) {
						alert(error)
					}
				}}
				inputs={[
					{
						title: "Email",
						input: (
							<input 
								oninput={e => email = e.target.value}
								type="email" required
							/>
						)
					},
					{
						title: "Message",
						input: (
							<textarea 
								oninput={e => content = e.target.value}
								required
							/>
						)
					}
				]}
				css={formStyles as FormStyles}
				submitText="Send"
			/>
		)

	)
}