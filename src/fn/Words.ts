
export type Language = "en" | "es"

export type LangObj = {
	[key in Language]: string
}

export type LangDecl = {
	[key: string]: LangObj
}

export class Phrases<const T extends LangDecl> {
	#phrases: T
	#lang: Language;
	constructor(phrases: T, lang?: Language) {
		this.#phrases = phrases;

		let userLang = lang || navigator.language.slice(0, 2);

		if (!this.#isLanguage(userLang)) {
			alert(`Language ${userLang} is not supported.`)
			this.#lang = "en";
		}
		else {
			this.#lang = userLang;
		}

	}

	#isLanguage(x: string): x is Language {
		return x === "en" || x === "es"
	}


	set lang(lang: Language) {
		this.#lang = lang;
	}

	get lang() {
		return this.#lang;
	}

	_(name: keyof T): string {
		return this.#phrases[name]![this.#lang];
	}
}