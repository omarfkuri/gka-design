
export { Router, Anchor, View } from "@dunes/router";
export { Elem, Comp } from "@dunes/tag";
export { Fire, FireAuth, FireStorage, FireData } from "@dunes/fire";
export { Form } from "@dunes/comps"


declare global {
	
	type View = import("@dunes/router").View;
	const {Router, Anchor, View}: typeof import("@dunes/router");
	const { Form }: typeof import("@dunes/comps")
	type FormStyles = import("@dunes/comps").FormStyles
	
	const {Fire}: typeof import("@dunes/fire");
	const ph: import("@dunes/phrase").Phrases<
		import("src/fn/lang").Languages,
		typeof import("src/fn/lang").lang
	>;
	
	type Elem<T extends TagName = any> = import("@dunes/tag").Elem<T>;
	type Comp<T extends {[key: string]: any} = any> = import("@dunes/tag").Comp<T>;
	const {Elem, Comp}: typeof import("@dunes/tag");

	const {include}: typeof import("@dunes/wrap-plug");

	const paths: string[]
	const hash: null | string


	type Project = {
		name: string
		description: string
		cover: string
	}

	type Message = {
		email: string
		content: string
		read: boolean
	}

	type Section = {
		ordinal: number
		name: string
		description: string
		images: string[]
	}

	type HomePost = {
		postID: string
		order: number
	}

}
