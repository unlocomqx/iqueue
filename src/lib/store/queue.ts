import {LocalStore} from "$lib/store/persist.svelte"

type Queue = {
	title: string
	url: string
}

export const queue = new LocalStore<Queue[]>('queue', [])
