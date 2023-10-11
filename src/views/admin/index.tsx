
import { Doc } from "@dunes/fire";
import { slugify } from "@dunes/tools";
import { type Comp } from "@dunes/tag";
import { Unsubscribe } from "firebase/firestore";
import styles from "src/style/views/admin/index.m.less";
import { Form, FormStyles } from "@dunes/comps";
import formStyles from "src/style/comp/Form.m.less";
import { Wrapper } from "src/comps/admin/Wrapper";
import { ProjectPreview } from "src/comps/admin/ProjectPreview";
import { BannerSelect } from "src/comps/admin/BannerSelect";
import { Uploader } from "src/comps/admin/Uploader";
import { Accordion } from "src/comps/common/Accordion";
import { ShowArray } from "src/comps/common/ShowArray";

export default class Admin extends View {

	override willShow() {
		if (!Fire.auth.self.currentUser) {
			return {to: location.origin + "/admin/login"}
		}
	}

	#name = "";
	#description = "";
	#cover = "";

	content({view}: {view: Admin}, comp: Comp<{}>) {
		
		return (
			<Wrapper side={[
				<Accordion 
					openText="Add project"
					show={btn => btn}
				>
					<Form
						css={formStyles as FormStyles}
						submitText="Add"
						onsubmit={async (e) => {
							e.preventDefault()
							try {
								await Fire.data.set<Project>(
									Fire.data.doc("projects", slugify(view.#name)),
									{
										name: view.#name,
										description: view.#description,
										createdAt: Fire.data.stamp(),
										updatedAt: Fire.data.stamp(),
										cover: view.#cover,
									}
								);
								view.#name = "";
								view.#description = "";
								comp.re();
							}
							catch(error) {
								alert(error);
							}
						}}
						inputs={[
							{
								title: "Name",
								input: (
									<input
										required
										value={view.#name}
										oninput={e => view.#name = e.target.value}
										type="text"
									/>
								)
							},
							{
								title: "Cover",
								input: (
									<input
										required
										value={view.#cover}
										oninput={e => view.#cover = e.target.value}
										type="text"
									/>
								)
							},
							{
								title: "Description",
								input: (
									<textarea
										required
										oninput={e => view.#description = e.target.value}
									>{view.#description}</textarea>
								)
							}
						]}
					/>
				</Accordion>,
				<BannerSelect/>,
				<Uploader/>
			]}>
				<ShowArray
					arr={view.#projects}
					map={projects => projects.map(project => 
								<ProjectPreview project={project}/>
							)}
					load={<div>Loading...</div>}
					empty={<div>No Projects</div>}
				/>
			</Wrapper>
		)
	}

	#unsub?: Unsubscribe
	#projects?: Doc<Project>[]

	override async hasShown() {
		if (this.#unsub) {
			return;
		}

		this.#unsub = Fire.data.onSnap<Project>(
			Fire.data.col("projects"), projects => {
				this.#projects = projects;
				this.comp!.re();
			}
		)
	}

	override willDestroy() {
		this.#unsub?.();
	}
}