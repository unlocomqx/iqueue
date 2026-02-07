<script>
	import { page } from '$app/stores';
</script>

<div class="flex min-h-screen items-center justify-center">
	<div class="text-center">
		<h1 class="text-6xl font-bold">{$page.status}</h1>
		<p class="mt-4 text-xl">{$page.error?.message || 'Page not found'}</p>
		<a href="/" class="btn btn-primary mt-8">Go Home</a>
	</div>
</div>
