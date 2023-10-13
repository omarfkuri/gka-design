import { TagEvent } from "@dunes/tag"


export const WaitButton: Component<Elements.Button & {
	onclick(this: HTMLButtonElement, e: TagEvent<HTMLButtonElement, MouseEvent>): Prom<void>
	desc: any
	done?: any
	_done?: boolean
}> = ({desc, done, _done = false,...props}, comp) => {
	return (
		<button {...props} onclick={async function (e) {
			e.target.disabled = true;
			await props.onclick.bind(this)(e);
			comp.re({_done: true})
				setTimeout(() => comp?.re({_done: false}), 
					4000
				)
			e.target.disabled = false;
		}}>
			{_done
				? done
					? done
					: [desc, " ✓"]
				: desc
			}
		</button>
	)
}