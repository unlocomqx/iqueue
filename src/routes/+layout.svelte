<script lang="ts">
  import './layout.css'
  import {onMount} from "svelte"
  import {page} from '$app/state'
  import {queue} from "$lib/store/queue"
  import { Toaster, toast } from 'svelte-sonner'
  import {youtube_app} from "$lib/store/settings"

  let {children} = $props()

  onMount(() => {
    if(!page.url.searchParams.get('text')){
      return;
    }
    add_link_to_queue(page.url.searchParams.get('title'), page.url.searchParams.get('text'))
  })

  onMount(async () => {
    if ('serviceWorker' in navigator) {
      const registration = await navigator.serviceWorker.ready
      registration.addEventListener('updatefound', () => {
        const new_worker = registration.installing
        if (new_worker) {
          new_worker.addEventListener('statechange', () => {
            if (new_worker.state === 'installed' && navigator.serviceWorker.controller) {
              toast('New version available', {
                action: {
                  label: 'Reload',
                  onClick: () => window.location.reload()
                },
                duration: Infinity
              })
            }
          })
        }
      })
    }
  })

  async function add_link_to_queue(title: string | null, url: string | null) {
    if (!url) {
      toast.error('No URL provided')
      return
    }

    if (!url.startsWith('http')) {
      toast.error('Invalid URL')
      return
    }

    if (queue.value.some(item => item.url === url)) {
      toast.info('Video already in queue')
      return
    }

    if (!title) {
      title = url
    }
    queue.value.push({title, url})
    toast.success('Video added to queue')

    if (Notification.permission === 'granted' && queue.value.length === 1) {
      const registration = await navigator.serviceWorker.ready
      await registration.showNotification('Next video', {
        body: title || url,
        icon: '/favicon.png',
        tag: 'next-video',
        requireInteraction: true,
        data: {
          url,
          youtubePackage: youtube_app.value
        }
      })
    }

    window.close()
  }

</script>

{@render children()}
<Toaster />
