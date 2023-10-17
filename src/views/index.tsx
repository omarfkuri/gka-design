

import { IdAnchor } from "src/comps/common/IdAnchor";
import { LangSwitch } from "src/comps/common/LangSwitch";
import { MoveDown } from "src/comps/common/MoveDown";
import { HomeProjects } from "src/comps/home/HomeProjects";
import { MessageForm } from "src/comps/home/MessageForm";
import styles from "src/style/views/home.m.less";

export default class Home extends View {
	content() {
		const messagesRef = Fire.data.col<Message>("messages");
		return (
			<div id="app">
				<div cl={styles.bg}></div>
				<section id="hero" cl={`${styles.section_wrapper} ${styles.hero_wrapper}`}>
					<div cl={styles.section_content}>
						<div cl={styles.hero_logo}>
							<img src="/logo.svg" draggable={false}/>
						</div>
						<div cl={styles.hero_links}>
							{Fire.auth.self.currentUser && <Anchor href="/admin">{ph._("admin")}</Anchor>}
							<IdAnchor behavior="smooth" block="center" href="#about" cl={styles.hero_link}>{ph._("about")}</IdAnchor>
							<IdAnchor behavior="smooth" block="center" href="#projects" cl={styles.hero_link}>{ph._("projects")}</IdAnchor>
							<IdAnchor behavior="smooth" block="center" href="#contact" cl={styles.hero_link}>{ph._("contact")}</IdAnchor>
						</div>
						<MoveDown targetID="about" behavior="smooth" block="center"/>
					</div>
				</section>
				<section id="about" cl={`${styles.section_wrapper} ${styles.about_wrapper}`}>
					<div cl={styles.section_content}>
						<div cl={styles.about_title}>{ph._("about")}</div>
						<div cl={styles.about_info}>{ph._("mission")}</div>
						<div cl={styles.about_down}>
							<MoveDown targetID="projects" behavior="smooth" block="center"/>
						</div>
						
					</div>
				</section>
				<section id="projects" cl={`${styles.section_wrapper} ${styles.projects_wrapper}`}>
					<div cl={styles.section_content}>
						<div cl={styles.projects_title}>{ph._("projects")}</div>
						<HomeProjects/>
						<div cl={styles.projects_info}>
							<a href="/project/list" cl={styles.projects_link}>{ph._("view_all")}</a>
						</div>
					</div>
				</section>
				<section id="contact" cl={`${styles.section_wrapper} ${styles.contact_wrapper}`}>
					<div cl={styles.section_content}>
						<div cl={styles.contact_title}>{ph._("contact")}</div>
						<div cl={styles.contact_body_wrapper}>
							<div cl={styles.contact_info_wrapper}>
								<a href="tel:+525514608144">
									<img cl={styles.contact_info_icon} src="/phone.svg" alt="Phone icon"/>
								</a>
								<a href="mailto:gka.design.adm@gmail.com">
									<img cl={styles.contact_info_icon} src="/mail.svg" alt="Email icon"/>
								</a>
								<a href="https://www.instagram.com/gka_architecture/">
									<img cl={styles.contact_info_icon} src="/instagram.png" alt="Instagram icon"/>
								</a>
								<a href="#fb">
									<img cl={styles.contact_info_icon} src="/facebook.png" alt="Facebook icon"/>
								</a>
							</div>
							<div cl={styles.contact_message_wrapper}>
								<MessageForm messagesRef={messagesRef}/>
							</div>
						</div>
					</div>
				</section>
				<LangSwitch cl={styles.lang_btn}/>
			</div>
		)
	}
}
