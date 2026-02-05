<script lang="ts">
  import './layout.css'
  import {onMount} from "svelte"
  import {page} from '$app/state'
  import {queue} from "$lib/store/queue"
  import { Toaster, toast } from 'svelte-sonner'

  let {children} = $props()

  onMount(() => {
    if(!page.url.searchParams.get('text')){
      return;
    }
    addLinkToQueue(page.url.searchParams.get('title'), page.url.searchParams.get('text'))
  })

  function addLinkToQueue(title: string | null, url: string | null) {
    if (!url) {
      toast.error('No URL provided')
      return
    }

    if (!url.startsWith('http')) {
      toast.error('Invalid URL')
      return
    }

    if(queue.value.some(item => item.url === url)){
      toast.info('Video already in queue')
      return
    }

    if (!title) {
      title = url
    }
    queue.value.push({title, url})
    toast.success('Video added to queue')
  }

</script>

{@render children()}
<Toaster />
