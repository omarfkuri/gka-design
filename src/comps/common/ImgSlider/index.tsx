import { word } from "@dunes/random"
import { UNICODE } from "@dunes/tools"

import styles from "./style.m.less"

const arrow_left = UNICODE.arrow.left.simple
const arrow_right = UNICODE.arrow.right.simple

export function ImgSlider<T>({images, map}: {
	images: T[]
	map: (t: T) => JSX.Element
}) {
	const id = word(12)

	function goTo(i: number) {
		const car = document.getElementById(id)!;
		const slider = car.querySelector(`.${styles.images_wrapper}`)!;
		const {scrollWidth} = slider.firstElementChild!;
		slider.scrollBy({left: (scrollWidth * (i * 0.8)) , behavior: "smooth"})
	}

	return (
		<div cl={styles.wrapper} id={id}>
			<div cl={styles.images_wrapper}>
				{images.map(map)}
			</div>
			<div cl={styles.controls_wrapper}>
				<button cl={styles.controls_prev} onclick={()=>goTo(-1)}>{
					arrow_left
				}</button>
				<button cl={styles.controls_next} onclick={()=>goTo( 1)}>{
					arrow_right
				}</button>
			</div>
		</div>
	)
}