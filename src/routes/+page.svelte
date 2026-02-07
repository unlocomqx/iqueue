<script lang="ts">
  import {queue} from "$lib/store/queue"
  import Icon from "@iconify/svelte"
  import {active_alerts, Alerts} from "$lib/store/alerts"
  import {youtube_app, YouTubeApp} from "$lib/store/settings"
  import {toast} from "svelte-sonner"
  import {onMount} from "svelte"

  function remove_item(index: number) {
    queue.value = queue.value.filter((_, i) => i !== index)
  }

  async function enable_notifications() {
    if (!('Notification' in window)) {
      toast.error('Notifications not supported')
      return
    }

    const permission = await Notification.requestPermission()

    if (permission === 'granted') {
      active_alerts.value[Alerts.NOTIFICATIONS] = false
      toast.success('Notifications enabled')
    } else if (permission === 'denied') {
      toast.error('Notification permission denied')
    } else {
      toast.info('Notification permission needed')
    }
  }

  let deferred_prompt: any = null

  function handle_youtube_app_change() {
    toast.success('YouTube app saved')
  }

  onMount(() => {
    active_alerts.value[Alerts.NOTIFICATIONS] = !('Notification' in window && Notification.permission === 'granted')

    const is_installed = window.matchMedia('(display-mode: standalone)').matches ||
      (window.navigator as any).standalone === true

    active_alerts.value[Alerts.INSTALL_APP] = active_alerts.value[Alerts.INSTALL_APP] && !is_installed

    window.addEventListener('beforeinstallprompt', (e) => {
      e.preventDefault()
      deferred_prompt = e
      active_alerts.value[Alerts.INSTALL_APP] = true
    })
  })

  async function install_app() {
    if (!deferred_prompt) return

    deferred_prompt.prompt()
    const {outcome} = await deferred_prompt.userChoice

    if (outcome === 'accepted') {
      active_alerts.value[Alerts.INSTALL_APP] = false
      toast.success('App installed')
    }

    deferred_prompt = null
  }

  async function handle_play_click(index: number) {
    const next_video = queue.value[index + 1]

    // remove current video from queue
    queue.value = queue.value.filter((_, i) => i !== index)

    if (Notification.permission !== 'granted' || !next_video) return

    const registration = await navigator.serviceWorker.ready
    await registration.showNotification('Next video', {
      body: next_video.title || next_video.url,
      icon: '/favicon.png',
      tag: 'next-video',
      requireInteraction: true,
      data: {
        url: next_video.url,
        youtubePackage: youtube_app.value
      }
    })
  }
</script>

<div class="card card-dash bg-base-100 w-96 shadow-sm m-auto mt-10">
  <div class="card-body">
    <h2 class="card-title">Videos list</h2>

    <p class="text-base-content/60 text-sm">Share YouTube links to this app to add videos to the queue</p>

    {#if queue.value.length > 0}
      <ul class="list bg-base-100 rounded-box shadow-md">
        {#each queue.value as item, index (item.url)}
          <li class="list-row items-center">
            <div>
              <Icon class="size-10 rounded-box" icon="logos:youtube-icon"/>
            </div>
            <div class="truncate">
              {item.title || item.url}
            </div>
            <a onclick={() => handle_play_click(index)} href={item.url} target="_blank" rel="noopener noreferrer"
               class="btn btn-square btn-ghost">
              <Icon icon="ic:baseline-play-arrow"/>
            </a>
            <button class="btn btn-square btn-ghost" onclick={() => remove_item(index)}>
              <Icon icon="ic:baseline-delete-forever"/>
            </button>
          </li>
        {/each}
      </ul>
    {/if}

    {#if queue.value.length > 0}
      <div class="card-actions justify-end mt-4">
        <button class="btn btn-primary" onclick={() => queue.value = []}>Clear all</button>
      </div>
    {/if}

    {#if active_alerts.value[Alerts.OPEN_LINKS]}
      <div class="alert" role="alert">
        <Icon class="size-6" icon="ic:info"/>
        <span>Make sure that "Open links in apps" is enabled in your device settings.</span>
        <button class="btn btn-ghost btn-sm" onclick={() => active_alerts.value[Alerts.OPEN_LINKS] = false}>
          <Icon icon="ic:close"/>
        </button>
      </div>
    {/if}

    {#if active_alerts.value[Alerts.INSTALL_APP]}
      <div class="alert" role="alert">
        <Icon class="size-6" icon="ic:info"/>
        <span>Install this app for a better experience.</span>
        <button class="btn btn-success" onclick={install_app}>
          <Icon icon="ic:check"/>
        </button>
        <button class="btn btn-ghost btn-sm" onclick={() => active_alerts.value[Alerts.INSTALL_APP] = false}>
          <Icon icon="ic:close"/>
        </button>
      </div>
    {/if}

    {#if active_alerts.value[Alerts.NOTIFICATIONS]}
      <div class="alert" role="alert">
        <Icon class="size-6" icon="ic:info"/>
        <span>Enable notifications to skip to next video easily.</span>
        <button class="btn btn-success" onclick={enable_notifications}>
          <Icon icon="ic:check"/>
        </button>
        <button class="btn btn-ghost btn-sm" onclick={() => active_alerts.value[Alerts.NOTIFICATIONS] = false}>
          <Icon icon="ic:close"/>
        </button>
      </div>
    {/if}

    <div class="mt-4">
      <div class="label">
        <span class="label-text">YouTube app</span>
      </div>
      <div class="flex flex-col gap-2">
        <label class="flex items-center gap-2 cursor-pointer">
          <input type="radio" name="youtube-app" class="radio" value={YouTubeApp.REVANCED} bind:group={youtube_app.value} onchange={handle_youtube_app_change}/>
          <span>ReVanced</span>
        </label>
        <label class="flex items-center gap-2 cursor-pointer">
          <input type="radio" name="youtube-app" class="radio" value={YouTubeApp.OFFICIAL} bind:group={youtube_app.value} onchange={handle_youtube_app_change}/>
          <span>Official</span>
        </label>
        <input
          type="text"
          placeholder="com.example.youtube"
          class="input input-bordered w-full"
          bind:value={youtube_app.value}
          onblur={handle_youtube_app_change}
        />
      </div>
    </div>
  </div>
</div>
