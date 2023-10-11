
import type { Doc } from "@dunes/fire"
import styles from "./style.m.less"
import { ShowArray } from "src/comps/common/ShowArray";
import { ImgSlider } from "src/comps/common/ImgSlider";

export class HomeProjects extends Comp {

	#projects?: Doc<Project>[]

	protected override produce() {
		return (
			<ShowArray
				cl={styles.wrapper}
				arr={this.#projects}
				map={projects =>
					<ImgSlider images={projects} map={project => (
						<ProjectSlide project={project}/>
					)}></ImgSlider>
				}
				load={<div>Loading...</div>}
				empty={<div>None</div>}
			/>
		)
	}

	override hasRendered() {
		if (!this.#projects) {
			Fire.data.getCol<HomePost>(Fire.data.query("banners"))
			.then(async posts => {
				this.#projects = [];
				for (const {postID} of posts) {
					const proj = await Fire.data.get(
						Fire.data.doc<Project>("projects", postID)
					)
					if (proj)
						this.#projects.push(proj);
				}
			})
			.then(() => this.re())
		}
		
	}
}


class ProjectSlide extends  Comp<{project: Doc<Project>}> {

	#url?: string;

	protected override produce() {
		return (
			<div cl={`${styles.slide_wrapper} click`} onclick={
				() => router.go(location.origin + `/project/${this.props.project.id}`)
			}>
				{this.props.project.cover && (
					this.#url
					?	<img 
							cl={styles.slide_cover} 
							src={this.#url} 
							draggable={false}/>
					: <div>Loading...</div>	
				)}
				<div cl={styles.slide_title}>{this.props.project.name}</div>
			</div>
		)
	}

	override hasRendered(): void {
		if (this.#url) return;
	  Fire.storage.url(Fire.storage.path(this.props.project.cover))
	  .then(url => {
	  	this.#url = url
	  	this.re();
	  })
	  .catch(alert)
	}
}