<script lang="ts">
    import '../../../app.scss';
    import { ModeWatcher } from 'mode-watcher';
    import Logo from "$lib/components/logo.svelte";

	let { form } = $props();
</script>


<section class="bg-muted py-20 lg:py-[120px]">
	<div class="container mx-auto">
		<div class="-mx-4 flex flex-wrap">
			<div class="w-full px-4">
				<div class="relative mx-auto max-w-[525px] overflow-hidden rounded-lg bg-background px-10 py-16 text-center sm:px-12 md:px-[60px]">
					<div class="mb-10 text-center md:mb-16">
                        <h1 class="hidden">Minatrox</h1>
                        <div class="">
                            <Logo/>
                        </div>
					</div>
					<form action="?/login" method="POST">
						<div class="mb-6">
							<input
								type="text"
                                name="username"
								placeholder="@username"
								class="border-stroke text-body-color dark:border-dark-3 w-full min-w-72 rounded-md border bg-transparent px-5 py-3 text-base outline-none focus:border-primary focus-visible:shadow-none dark:text-white"
							/>
						</div>
						<div class="mb-6">
							<input
								type="password"
                                name="password"
								placeholder="Password"
								class="border-stroke text-body-color dark:border-dark-3 w-full min-w-72 rounded-md border bg-transparent px-5 py-3 text-base outline-none focus:border-primary focus-visible:shadow-none dark:text-white"
							/>
						</div>
						<div class="mb-10">
							<input
								type="submit"
								value="Sign In"
								class="w-full min-w-72 cursor-pointer rounded-md border border-primary bg-primary px-5 py-3 text-base font-medium text-white transition hover:bg-opacity-90"
							/>
						</div>
					</form>
                    {#if form?.invalid}
                        <p class="error mb-6 text-base text-red-600">Username and password is required.</p>
                    {/if}
					<div>
						<span class="absolute right-1 top-1">
							<svg
								width="40"
								height="40"
								viewBox="0 0 40 40"
								fill="none"
								xmlns="http://www.w3.org/2000/svg"
							>
								<circle
									cx="1.39737"
									cy="38.6026"
									r="1.39737"
									transform="rotate(-90 1.39737 38.6026)"
									fill="#3056D3"
								/>
								<circle
									cx="1.39737"
									cy="1.99122"
									r="1.39737"
									transform="rotate(-90 1.39737 1.99122)"
									fill="#3056D3"
								/>
								<circle
									cx="13.6943"
									cy="38.6026"
									r="1.39737"
									transform="rotate(-90 13.6943 38.6026)"
									fill="#3056D3"
								/>
								<circle
									cx="13.6943"
									cy="1.99122"
									r="1.39737"
									transform="rotate(-90 13.6943 1.99122)"
									fill="#3056D3"
								/>
								<circle
									cx="25.9911"
									cy="38.6026"
									r="1.39737"
									transform="rotate(-90 25.9911 38.6026)"
									fill="#3056D3"
								/>
								<circle
									cx="25.9911"
									cy="1.99122"
									r="1.39737"
									transform="rotate(-90 25.9911 1.99122)"
									fill="#3056D3"
								/>
								<circle
									cx="38.288"
									cy="38.6026"
									r="1.39737"
									transform="rotate(-90 38.288 38.6026)"
									fill="#3056D3"
								/>
								<circle
									cx="38.288"
									cy="1.99122"
									r="1.39737"
									transform="rotate(-90 38.288 1.99122)"
									fill="#3056D3"
								/>
								<circle
									cx="1.39737"
									cy="26.3057"
									r="1.39737"
									transform="rotate(-90 1.39737 26.3057)"
									fill="#3056D3"
								/>
								<circle
									cx="13.6943"
									cy="26.3057"
									r="1.39737"
									transform="rotate(-90 13.6943 26.3057)"
									fill="#3056D3"
								/>
								<circle
									cx="25.9911"
									cy="26.3057"
									r="1.39737"
									transform="rotate(-90 25.9911 26.3057)"
									fill="#3056D3"
								/>
								<circle
									cx="38.288"
									cy="26.3057"
									r="1.39737"
									transform="rotate(-90 38.288 26.3057)"
									fill="#3056D3"
								/>
								<circle
									cx="1.39737"
									cy="14.0086"
									r="1.39737"
									transform="rotate(-90 1.39737 14.0086)"
									fill="#3056D3"
								/>
								<circle
									cx="13.6943"
									cy="14.0086"
									r="1.39737"
									transform="rotate(-90 13.6943 14.0086)"
									fill="#3056D3"
								/>
								<circle
									cx="25.9911"
									cy="14.0086"
									r="1.39737"
									transform="rotate(-90 25.9911 14.0086)"
									fill="#3056D3"
								/>
								<circle
									cx="38.288"
									cy="14.0086"
									r="1.39737"
									transform="rotate(-90 38.288 14.0086)"
									fill="#3056D3"
								/>
							</svg>
						</span>
						<span class="absolute bottom-1 left-1">
							<svg
								width="29"
								height="40"
								viewBox="0 0 29 40"
								fill="none"
								xmlns="http://www.w3.org/2000/svg"
							>
								<circle
									cx="2.288"
									cy="25.9912"
									r="1.39737"
									transform="rotate(-90 2.288 25.9912)"
									fill="#3056D3"
								/>
								<circle
									cx="14.5849"
									cy="25.9911"
									r="1.39737"
									transform="rotate(-90 14.5849 25.9911)"
									fill="#3056D3"
								/>
								<circle
									cx="26.7216"
									cy="25.9911"
									r="1.39737"
									transform="rotate(-90 26.7216 25.9911)"
									fill="#3056D3"
								/>
								<circle
									cx="2.288"
									cy="13.6944"
									r="1.39737"
									transform="rotate(-90 2.288 13.6944)"
									fill="#3056D3"
								/>
								<circle
									cx="14.5849"
									cy="13.6943"
									r="1.39737"
									transform="rotate(-90 14.5849 13.6943)"
									fill="#3056D3"
								/>
								<circle
									cx="26.7216"
									cy="13.6943"
									r="1.39737"
									transform="rotate(-90 26.7216 13.6943)"
									fill="#3056D3"
								/>
								<circle
									cx="2.288"
									cy="38.0087"
									r="1.39737"
									transform="rotate(-90 2.288 38.0087)"
									fill="#3056D3"
								/>
								<circle
									cx="2.288"
									cy="1.39739"
									r="1.39737"
									transform="rotate(-90 2.288 1.39739)"
									fill="#3056D3"
								/>
								<circle
									cx="14.5849"
									cy="38.0089"
									r="1.39737"
									transform="rotate(-90 14.5849 38.0089)"
									fill="#3056D3"
								/>
								<circle
									cx="26.7216"
									cy="38.0089"
									r="1.39737"
									transform="rotate(-90 26.7216 38.0089)"
									fill="#3056D3"
								/>
								<circle
									cx="14.5849"
									cy="1.39761"
									r="1.39737"
									transform="rotate(-90 14.5849 1.39761)"
									fill="#3056D3"
								/>
								<circle
									cx="26.7216"
									cy="1.39761"
									r="1.39737"
									transform="rotate(-90 26.7216 1.39761)"
									fill="#3056D3"
								/>
							</svg>
						</span>
					</div>
				</div>
			</div>
		</div>
	</div>
</section>

