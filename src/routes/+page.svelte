<script lang="ts">
  import {queue} from "$lib/store/queue"
  import Icon from "@iconify/svelte"
  import {active_alerts, Alerts} from "$lib/store/alerts"

  function removeItem(index: number) {
    queue.value = queue.value.filter((_, i) => i !== index)
  }
</script>

<div class="card card-dash bg-base-100 w-96 shadow-sm m-auto mt-10">
  <div class="card-body">
    <h2 class="card-title">Videos list</h2>

    {#if queue.value.length > 0}
      <ul class="list bg-base-100 rounded-box shadow-md">

        <li class="p-4 pb-2 text-xs opacity-60 tracking-wide">Videos added to the queue</li>

        {#each queue.value as item, index (item.url)}
          <li class="list-row items-center">
            <div>
              <Icon class="size-10 rounded-box" icon="logos:youtube-icon"/>
            </div>
            <div class="truncate">
              {item.title || item.url}
            </div>
            <a href={item.url} target="_blank" rel="noopener noreferrer" class="btn btn-square btn-ghost">
              <Icon icon="ic:baseline-play-arrow"/>
            </a>
            <button class="btn btn-square btn-ghost" onclick={() => removeItem(index)}>
              <Icon icon="ic:baseline-delete-forever"/>
            </button>
          </li>
        {/each}
      </ul>
    {:else}
      <p class="text-base-content/60 text-sm">No items in queue</p>
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
  </div>
</div>
