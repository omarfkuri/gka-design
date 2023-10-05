
import styles from "src/style/views/home.m.less";

export default class Home extends View {
	content() {
		
		return (
			<div id="app">
				<section id="hero" cl={styles.hero_wrapper}>
					<div cl={styles.hero_title}>GKA Design</div>
					<div cl={styles.hero_links}>
						<Anchor href="/admin">Admin</Anchor>
						<a href="#about" cl={styles.hero_link}>About</a>
						<a href="#projects" cl={styles.hero_link}>Projects</a>
						<a href="#contact" cl={styles.hero_link}>Contact</a>
					</div>
				</section>
				<section id="about">
					
				</section>
				<section id="projects">
					
				</section>
				<section id="contact">
					
				</section>
			</div>
		)
	}
}