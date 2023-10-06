export { Router, Anchor, View } from "@dunes/router";
export { Elem, Comp } from "@dunes/tag";
export { Fire, FireAuth, FireStorage, FireStore } from "@dunes/fire";


/**
 * 
 * test: 
 * 	Make project with firestore
 *	Import auth and storage 
 * 
 * */


declare global {
	
	type View = import("@dunes/router").View;
	const {Router, Anchor, View}: typeof import("@dunes/router");
	
	const {Fire}: typeof import("@dunes/fire");
	
	type Elem = import("@dunes/tag").Elem;
	type Comp = import("@dunes/tag").Comp;
	const {Elem, Comp}: typeof import("@dunes/tag");
	const pages: string[]
	const hash: null | string


	type Project = {
		name: string
		description: string
	}

	type Section = {
		ordinal: number
		name: string
		description: string
		images: string[]
	}
}
