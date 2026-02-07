import {LocalStore} from "$lib/store/persist.svelte"

export enum YouTubeApp {
  OFFICIAL = 'com.google.android.youtube',
  REVANCED = 'app.revanced.android.youtube',
}

export const youtube_app = new LocalStore<string>('youtube_app', YouTubeApp.REVANCED)
