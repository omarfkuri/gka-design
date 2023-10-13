import { TagEvent } from "@dunes/tag";
import type { Prom } from "@dunes/tools"



export function alertError<T extends HTMLElement>(fn: (e: TagEvent<T>) => Prom<any>) {
	return async (e: TagEvent<T>) => {
		try {
			await fn(e);
		}
		catch(error) {
			alert(error)
		}
	}
}