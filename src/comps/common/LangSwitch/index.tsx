import styles from "./style.m.less"

export const LangSwitch: Component<Elements.Button> = (props) => {
	
	if (props.cl) {
		props.cl += " " + styles.lang_btn;
	}
	else {
		props.cl = styles.lang_btn;
	}

	return (
		<button {...props} lang={ph.lang} onclick={() => {
			ph.lang = ph.lang === "en"? "es": "en";
			router.reloadCurrent()
		}}></button>
	)
}