
export const LangSwitch: Component<Elements.Button> = (props) => {
	return (
		<button {...props} onclick={() => {
			ph.lang = ph.lang === "en"? "es": "en";
			router.reloadCurrent();
		}}>
			{ph.lang}
		</button>
	)
}