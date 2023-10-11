
import type { Doc } from "@dunes/fire"
import styles from "./style.m.less"
import { Accordion } from "../../common/Accordion"
import { Unsubscribe } from "firebase/auth"
import { ShowArray } from "src/comps/common/ShowArray"
import { WaitButton } from "src/comps/common/WaitBtn"

export class BannerSelect extends Comp {
	#ref = Fire.data.col<HomePost>(`banners`);
	#unsub?: Unsubscribe
	#banners?: Doc<HomePost>[]

	override produce() {
		return (
			<div cl={styles.wrapper}>
				<Accordion show={e => (
					<div cl={styles.show_wrapper}>
						<div cl={styles.show_title}>Home Wheel</div>
						<div cl={styles.show_tools}>
							<WaitButton
								onclick={async ()=> {
									const id = prompt("Which project?");
									if (!id) return;

									try {
										await Fire.data.add(this.#ref, {
											createdAt: Fire.data.stamp(),
											updatedAt: Fire.data.stamp(),
											order: 0,
											postID: id
										})
									}
									catch(error) {
										alert(error);
									}
								}}
							>Add</WaitButton>
							{e}	
						</div>
					</div>
				)}>
					<ShowArray 
						arr={this.#banners}
						map={banners => banners.map(banner => 
							<div cl={styles.banner_wrapper}>
								{banner.postID}
								<WaitButton
									onclick={async ()=> {
										if (!confirm("Remove from banner?")) return;

										try {
											await Fire.data.remove(
												Fire.data.doc<HomePost>(`banners`, banner.id)
											)
											this.re();
										}
										catch(error) {
											alert(error);
										}
									}}
								>Remove</WaitButton>
							</div>
						)}
						load={<div>Loading...</div>}
						empty={<div>No banners</div>}
					></ShowArray>
				</Accordion>
			</div>
		)
	}

	override hasRendered(): void {
		if (this.#unsub) {
			return;
		}

		this.#unsub = Fire.data.onSnap(
			this.#ref, banners => {
				this.#banners = banners;
				this.re();
			}
		)
	}


	override willDestroy() {
		this.#unsub?.();
	}
}