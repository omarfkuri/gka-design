export { Router, Anchor, View } from "@dunes/router";
export { Elem, Comp } from "@dunes/tag";
export { Fire, FireAuth, FireStorage, FireStore } from "@dunes/fire";

declare global {
	
	type View = import("@dunes/router").View;
	const {Router, Anchor, View}: typeof import("@dunes/router");
	
	const {Fire}: typeof import("@dunes/fire");
	
	type Elem<T extends TagName = any> = import("@dunes/tag").Elem<T>;
	type Comp<T extends obj = any> = import("@dunes/tag").Comp<T>;
	const {Elem, Comp}: typeof import("@dunes/tag");
	const paths: string[]
	const hash: null | string


	type Project = {
		name: string
		description: string
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
}
