import {LocalStore} from "$lib/store/persist.svelte"

export enum Alerts {
  NOTIFICATIONS = 'notifications',
  INSTALL_APP = 'install_app',
}

export const active_alerts = new LocalStore<{ [key in Alerts]: boolean }>('alerts', {
  [Alerts.NOTIFICATIONS]: true,
  [Alerts.INSTALL_APP]: true,
})

