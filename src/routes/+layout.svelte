<script lang="ts">
  import './layout.css'
  import {onMount} from "svelte"
  import {page} from '$app/state'
  import {queue} from "$lib/store/queue"

  let {children} = $props()

  onMount(() => {
    console.log([...page.url.searchParams])
    addLinkToQueue(page.url.searchParams.get('title'), page.url.searchParams.get('text'))
  })

  function addLinkToQueue(title: string | null, url: string | null) {
    if (!url) {
      alert('No URL provided')
      return
    }

    if (!url.startsWith('http')) {
      alert('Invalid URL')
      return
    }

    if (!title) {
      title = url
    }
    queue.value.push({title, url})
  }

  $inspect(queue.value)
</script>

{@render children()}
