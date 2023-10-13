
export function IdAnchor({desc, behavior, inline, block, ...props}: Elements.Anchor & ScrollIntoViewOptions & {
	desc: any
	href: string
}) {
	return (
		<a {...props} onclick={function (e) {
			e.preventDefault();
			document.querySelector<HTMLElement>(props.href)?.scrollIntoView({
				behavior, inline, block
			});
			props.onclick?.bind(this)(e);
		}}>{desc}</a>
	)
}