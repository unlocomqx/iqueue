<script lang="ts">
  import {queue} from "$lib/store/queue"
  import Icon from "@iconify/svelte"
  import {active_alerts, Alerts} from "$lib/store/alerts"
  import {toast} from "svelte-sonner"
  import {onMount} from "svelte"

  function removeItem(index: number) {
    queue.value = queue.value.filter((_, i) => i !== index)
  }

  async function enableNotifications() {
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

  let deferredPrompt: any = null

  onMount(() => {
    active_alerts.value[Alerts.NOTIFICATIONS] = !('Notification' in window && Notification.permission === 'granted')

    const isInstalled = window.matchMedia('(display-mode: standalone)').matches ||
      (window.navigator as any).standalone === true

    active_alerts.value[Alerts.INSTALL_APP] = active_alerts.value[Alerts.INSTALL_APP] && !isInstalled

    window.addEventListener('beforeinstallprompt', (e) => {
      e.preventDefault()
      deferredPrompt = e
      active_alerts.value[Alerts.INSTALL_APP] = true
    })
  })

  async function installApp() {
    if (!deferredPrompt) return

    deferredPrompt.prompt()
    const {outcome} = await deferredPrompt.userChoice

    if (outcome === 'accepted') {
      active_alerts.value[Alerts.INSTALL_APP] = false
      toast.success('App installed')
    }

    deferredPrompt = null
  }

  async function handlePlayClick(index: number) {
    const nextVideo = queue.value[index + 1]

    // remove current video from queue
    queue.value = queue.value.filter((_, i) => i !== index)

    if (Notification.permission !== 'granted' || !nextVideo) return

    const registration = await navigator.serviceWorker.ready
    await registration.showNotification('Next video', {
      body: nextVideo.title || nextVideo.url,
      icon: '/favicon.png',
      tag: 'next-video',
      requireInteraction: true,
      data: {url: nextVideo.url}
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
            <a onclick={() => handlePlayClick(index)} href={item.url} target="_blank" rel="noopener noreferrer"
               class="btn btn-square btn-ghost">
              <Icon icon="ic:baseline-play-arrow"/>
            </a>
            <button class="btn btn-square btn-ghost" onclick={() => removeItem(index)}>
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
        <button class="btn btn-success" onclick={installApp}>
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
        <button class="btn btn-success" onclick={enableNotifications}>
          <Icon icon="ic:check"/>
        </button>
        <button class="btn btn-ghost btn-sm" onclick={() => active_alerts.value[Alerts.NOTIFICATIONS] = false}>
          <Icon icon="ic:close"/>
        </button>
      </div>
    {/if}
  </div>
</div>
