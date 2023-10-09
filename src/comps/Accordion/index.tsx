
export const Accordion: Component<Elements.Div & {
	open?: boolean
	onToggle?(action: "close" | "open"): Prom<void>
	show: (btn: Elem<"button">) => any
	desc: any
}> = (
	({open, show, desc, onToggle, ...props}, comp) => (
		<div {...props}>
			{show((
				<button
					onclick={async () => {
						if (open) {
							await onToggle?.("close");
						}
						else {
							await onToggle?.("open");
						}
						comp.re({open: !open})
					}}
				>{open ? "Close" : "Open"}</button>
			) as unknown as Elem<"button">)}
			{open && desc}
		</div>
	)
)