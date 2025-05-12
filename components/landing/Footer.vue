<template>
  <div class="flex flex-col min-h-screen">
    <!-- header opcional -->
    <main class="flex-grow">
      <!-- todo o seu conteúdo de página aqui -->
    </main>

    <footer class="py-5 bg-slate-400">
      <p class="text-center text-sm text-slate-900">
        Copyright © {{ new Date().getFullYear() }} Zeeget. All rights reserved.
      </p>
      <p class="text-center text-xs text-slate-900 mt-1">
        Made by
        <a href="https://github.com/Gr33nW33n" target="_blank" rel="noopener"
           class="hover:underline">
          Gr33nW33n
        </a>
        with attribution to
        <a href="https://web3templates.com" target="_blank" rel="noopener"
           class="hover:underline">
          Web3Templates
        </a>
      </p>
    </footer>
  </div>
</template>
