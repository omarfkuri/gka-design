
import type { CollectionReference } from "firebase/firestore";
import { TopBar } from "src/comps/home/TopBar";
import styles from "src/style/views/home.m.less";

export default class Home extends View {
	content() {
		const messagesRef = Fire.store.col<Message>("messages");
		return (
			<div id="app">
				<TopBar/>
				<section id="hero" cl={`${styles.section_wrapper} ${styles.hero_wrapper}`}>
					<div cl={styles.hero_logo}>GKA Design</div>
					<div cl={styles.hero_links}>
						{Fire.auth.self.currentUser && <Anchor href="/admin">Admin</Anchor>}
						<a href="#about" cl={styles.hero_link}>About</a>
						<a href="#project" cl={styles.hero_link}>Project</a>
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
					<div cl={styles.projects_info}>
						<a href="/project/list" cl={styles.projects_link}>View</a>
					</div>
				</section>
				<section id="contact" cl={`${styles.section_wrapper} ${styles.contact_wrapper}`}>
					<div cl={styles.contact_title}>Contact</div>
					<div cl={styles.contact_info}>
						<a cl={styles.contact_link}>Email</a>
						<a cl={styles.contact_link}>55 5050 2038</a>
					</div>
					<MessageForm messagesRef={messagesRef}/>
				</section>
			</div>
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
			<form
				onsubmit={async e => {
					e.preventDefault();

					try {
						await Fire.store.addDoc(messagesRef, {
							email, 
							content, 
							createdAt: Fire.store.stamp(),
							updatedAt: Fire.store.stamp(),
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
			>
				<div>Send us a message</div>
				<div>
					Email{" "}
					<input 
						oninput={e => email = e.target.value}
						type="email" required
					/>
				</div>
				<div>
					Message{" "}
					<textarea 
						oninput={e => content = e.target.value}
						required
					/>
				</div>
				<button>Send</button>
			</form>
		)

	)
}