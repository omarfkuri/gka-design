
import styles from "./style.m.less"
import { UploaderImage } from "../UploaderImage";
import { Accordion } from "src/comps/common/Accordion";
import { WaitButton } from "src/comps/common/WaitBtn";
import { ShowArray } from "src/comps/common/ShowArray";
import { alertError } from "src/fn/alertError";

export type Img = {
	url: string
	src: string
}

export class Uploader extends Comp {

	protected override produce(): JSX.Element {
	  return (
			<div cl={styles.wrapper}>
				<Accordion cl={styles.list_wrapper} show={btn => (
					<div cl={styles.form_wrapper}>
						<div cl={styles.form_title}>Images</div>
						<input
							required
							multiple
							type="file"
							onchange={alertError(async e => {
								if (!e.target.files || !e.target.files.length) {
									alert("Please choose a file")
									return;
								}

								const name = document.getElementById("uploadingName")!;
								const prog = document.getElementById("uploadingProgress") as HTMLProgressElement;

								e.preventDefault()
								await Fire.storage.uploadAll(e.target.files, "general", {
									onFileChange(file) {
										name.innerText = file.name;
									},
									onChange(progress) {
										console.log(progress)
										prog.value = progress;
									}
								})
								this.re();
							})}
						/>
						{btn}
					</div>
				)}>
					<div id="uploadingContainer">
						<div id="uploadingName"></div>
						<progress max="100" value="0"
							id="uploadingProgress"></progress>
					</div>
					<ShowArray
						cl={styles.list_container}
						arr={this.#images}
						map={images => images.map(
							img => <UploaderImage img={img}/>
						)}
						load={<div>Loading...</div>}
						empty={<div>No Images</div>}
					/>
					<div>
						<WaitButton onclick={() => this.#advancePage(-1)}>
							Prev
						</WaitButton>
						<WaitButton onclick={() => this.#advancePage( 1)}>
							Next
						</WaitButton>
					</div>
				</Accordion>
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
			maxResults: 24,
			pageToken
		})
		this.#images = await Promise.all(pages.items.map(
			async ref => ({url: await Fire.storage.url(ref), src: ref.name})
		))
		this.#next = pages.nextPageToken
		this.re();

	}

}