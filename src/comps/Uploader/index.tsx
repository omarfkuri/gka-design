
import { Form, FormStyles } from "@dunes/comps";
import formStyles from "../../style/comp/Form.m.less";
import styles from "./style.m.less"
import { UploaderImage } from "../UploaderImage";

export type Img = {
	url: string
	src: string
}

export class Uploader extends Comp {

	#files?: FileList

	protected override produce(): JSX.Element {
	  return (
			<div cl={styles.wrapper}>
				<div id="uploadingContainer">
					<div id="uploadingName"></div>
					<progress max="100" value="0"
						id="uploadingProgress"></progress>
				</div>

				<div cl={styles.list_wrapper}>{
					this.#images
					? (
						this.#images.length
						? this.#images.map(img => <UploaderImage img={img}/>)
						: <div>No Images</div>
					)
					: <div>Loading...</div>
				}</div>
				<div>
					<button onclick={async (e) => {
						e.target.disabled = true;
						await this.#advancePage(-1);
						e.target.disabled = false;
					}}>Prev</button>
					<button onclick={async (e) => {
						e.target.disabled = true;
						await this.#advancePage(1);
						e.target.disabled = false;
					}}>Next</button>
				</div>
				<Form
					css={formStyles as FormStyles}
					titleText="Upload"
					submitText="Add"
					onsubmit={(e) => {

						if (!this.#files || !this.#files.length) {
							alert("Please choose a file")
							return;
						}

						const name = document.getElementById("uploadingName")!;
						const prog = document.getElementById("uploadingProgress") as HTMLProgressElement;

						e.preventDefault()
						Fire.storage.uploadAll(this.#files, "general", {
							onFileChange(file) {
								name.innerText = file.name;
							},
							onChange(progress) {
								console.log(progress)
								prog.value = progress;
							},
						})
						.then(() => this.re())
						.catch(alert);
					}}
					inputs={[
						{
							title: "Select Images",
							input: (
								<input
									required
									multiple
									type="file"
									onchange={e =>
										e.target.files && (this.#files = e.target.files)
									}
								/>
							)
						}
					]}
				/>
			</div>
		)
	}
	#next?: string

	#history: string[] = []
	#currentPage = 0;
	#latestPage = 0;

	#images?: Img[]

	#advancePage(by: -1 | 1) {
		if (by === -1) {
			if (!this.#currentPage) {
				return;
			}
			this.#currentPage -= 1;
		}
		else if (by === 1) {
			if (!this.#next) {
				return;
			}
			this.#currentPage += 1;
			this.#history[this.#currentPage] = this.#next;
		}
		if (this.#currentPage === this.#latestPage) {
			return;
		}
		const next = this.#history[this.#currentPage];
		this.#latestPage = this.#currentPage;
		return this.#setImages(next);
	}

	override hasRendered(): void {
		if (this.#images) {
			return;
		}
		this.#setImages()
	}

	async #setImages(pageToken?: string) {
		const pages = await Fire.storage.listPages(Fire.storage.path("general"), {
			maxResults: 7,
			pageToken
		})
		this.#images = await Promise.all(pages.items.map(
			async ref => ({url: await Fire.storage.url(ref), src: ref.name})
		))
		this.#next = pages.nextPageToken
		this.re();

	}

}