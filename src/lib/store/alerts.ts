import {LocalStore} from "$lib/store/persist.svelte"

export enum Alerts {
  OPEN_LINKS = 'open_links',
  NOTIFICATIONS = 'notifications',
  INSTALL_APP = 'install_app',
}

export const active_alerts = new LocalStore<{ [key in Alerts]: boolean }>('alerts', {
  [Alerts.OPEN_LINKS]: true,
  [Alerts.NOTIFICATIONS]: true,
  [Alerts.INSTALL_APP]: true,
})

