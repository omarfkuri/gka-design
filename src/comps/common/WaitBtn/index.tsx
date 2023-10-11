import { TagEvent } from "@dunes/tag"


export function WaitButton({desc,...props}: Elements.Button & {
	onclick(this: HTMLButtonElement, e: TagEvent<HTMLButtonElement, MouseEvent>): Prom<void>
	desc: any
}) {
	return (
		<button {...props} onclick={async function (e) {
			e.target.disabled = true;
			await props.onclick.bind(this)(e);
			e.target.disabled = false;
		}}>{desc}</button>
	)
}