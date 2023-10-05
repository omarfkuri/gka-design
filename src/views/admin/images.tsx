
import { Doc } from "@dunes/fire";
import { type Comp } from "@dunes/tag";
import { Unsubscribe } from "firebase/firestore";
import styles from "src/style/views/admin/index.m.less";
import { Form, FormStyles } from "@dunes/comps";
import formStyles from "src/style/comp/Form.m.less";
import { ProjectPreview } from "src/comps/ProjectPreview";
import { AdminView } from "src/comps/AdminView";

export default class Admin extends View {

	willShow() {
		if (!Fire.auth.self.currentUser) {
			return {to: location.origin + "/admin/login"}
		}
	}

	#files: FileList = new FileList

	content({view}: {view: Admin}, comp: Comp<{}>) {
		
		return (
			<AdminView side={[
				<div id="uploadingContainer">
					<div id="uploadingName"></div>
					<progress max="100"
						id="uploadingProgress"></progress>
				</div>,
				<Form
					css={formStyles as FormStyles}
					titleText="New Project"
					submitText="Add"
					onsubmit={async (e) => {
						const name = document.getElementById("uploadingName")!;
						const prog = document.getElementById("uploadingProgress") as HTMLProgressElement;

						e.preventDefault()
						try {
							await Fire.storage.uploadAll(view.#files, "general", {
								onFileChange(file) {
								  name.innerText = file.name;
								},
								onChange(progress) {
								  prog.value = progress;
								},
							});
							comp.re();
						}
						catch(error) {
							alert(error);
						}
					}}
					inputs={[
						{
							title: "Select Images",
							input: (
								<input
									required
									multiple
									onchange={e =>
										e.target.files && (view.#files = e.target.files)
									}
									type="text"
								/>
							)
						}
					]}
				/>,
				<button onclick={async () => {
					console.log(this.#next)
				}}>Next</button>
			]}>
				<div cl={styles.list_wrapper}>{
					view.#images
					? (
						view.#images.length
						? view.#images.map(src => <img src={src}/>)
						: <div>No Projects</div>
					)
					: <div>Loading...</div>
				}</div>
			</AdminView>
		)
	}

	#next?: string
	#images?: string[]

	async hasShown() {
		if (this.#images) {
			return;
		}
		const pages = await Fire.storage.listPages(Fire.storage.path("general"), {
			maxResults: 10
		})
		this.#images = await Promise.all(pages.items.map(r => Fire.storage.url(r)))
		this.#next = pages.nextPageToken
	}
}