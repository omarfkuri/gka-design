import { TagEvent } from "@dunes/tag"


export const Check: Component<Omit<Elements.Input, "input" | "type"> & {
	onInput?(this: HTMLInputElement, e: TagEvent<HTMLInputElement, Event>): Prom<void>
}> = ({onInput, checked, ...props}, comp) => {
	return (
		<input {...props} checked={checked} type="checkbox" oninput={async function (e) {
			await onInput?.bind(this)(e);
			comp.re({checked: !checked})
		}}/>
	)
}