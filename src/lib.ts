export { Router, Anchor, View } from "@dunes/router";
export { Elem } from "@dunes/tag";
export { Fire } from "@dunes/fire/lib/Fire";
export { FireStore } from "@dunes/fire/lib/FireStore";
export { FireAuth } from "@dunes/fire/lib/FireAuth";
// export { FireStorage } from "@dunes/fire/lib/FireStorage";


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
	const {Elem}: typeof import("@dunes/tag");
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
