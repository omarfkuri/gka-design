import { WaitButton } from "../WaitBtn"

export const CopyButton: Component<Elements.Button & {
	desc: any
	copyText: string
	onCopy?(): void
	onCopyError?(e: unknown): void
}> = ({
	desc, 
	copyText,
	onCopy,
	onCopyError = alert,
	...props
},) => {
	return (
		<WaitButton {...props} onclick={async function (e) {
			try {
				await navigator.clipboard.writeText(copyText)
				onCopy?.();
			}
			catch(error) {
				onCopyError(error);
			}
		}}>
			{desc}
		</WaitButton>
	)
}