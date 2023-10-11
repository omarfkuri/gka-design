
export const CopyButton: Component<Elements.Button & {
	desc: any
	copyText: string
	onCopy?(): void
	onCopyError?(e: unknown): void
	_copied?: boolean
}> = ({
	desc, 
	copyText,
	onCopy,
	onCopyError = alert,
	_copied = false
	, 
	...props
}, comp) => {
	return (
		<button {...props} onclick={async function (e) {
			e.target.disabled = true;
			
			try {
				await navigator.clipboard.writeText(copyText)
				onCopy?.();
				comp.re({_copied: true})
				setTimeout(() => comp?.re({_copied: false}), 
					6000
				)
			}
			catch(error) {
				onCopyError(error);
			}
			e.target.disabled = false;
		}}>
			{desc}
			{_copied && "✓"}
		</button>
	)
}