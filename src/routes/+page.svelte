<script lang="ts">
  import {queue} from "$lib/store/queue";
  import Icon from "@iconify/svelte";

  function removeItem(index: number) {
    queue.value = queue.value.filter((_, i) => i !== index);
  }
</script>

<div class="card card-dash bg-base-100 w-96 shadow-sm m-auto mt-10">
  <div class="card-body">
    <h2 class="card-title">Videos list</h2>

    {#if queue.value.length > 0}
      <ul class="menu bg-base-200 rounded-box">
        {#each queue.value as item, index (item.url)}
          <li>
            <div class="flex justify-between items-center">
              <a href={item.url} target="_blank" rel="noopener noreferrer" class="flex-1">
                {item.title || item.url}
              </a>
              <a href={item.url} target="_blank" rel="noopener noreferrer" class="btn btn-square btn-ghost">
                <Icon icon="ic:baseline-play-arrow" />
              </a>
              <button class="btn btn-square btn-ghost" onclick={() => removeItem(index)}>
                <Icon icon="ic:baseline-delete-forever" />
              </button>
            </div>
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
  </div>
</div>
