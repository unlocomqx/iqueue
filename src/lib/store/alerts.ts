import {LocalStore} from "$lib/store/persist.svelte"

export enum Alerts {
  OPEN_LINKS = 'open_links',
}

export const active_alerts = new LocalStore<{ [key in Alerts]: boolean }>('alerts', {
  [Alerts.OPEN_LINKS]: true
})
