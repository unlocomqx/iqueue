import {LocalStore} from "$lib/store/persist.svelte"

type Queue = {
	title: string
	url: string
}

export const queue = new LocalStore<Queue[]>('queue', [
  {title: 'How To Make Progressive Web Apps With Svelte', url: 'https://www.youtube.com/watch?v=dQw4w9WgXcQ'},
  {title: 'Another example video', url: 'https://www.youtube.com/watch?v=kJQP7kiw5Fk'},
])
