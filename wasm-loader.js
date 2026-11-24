// GitHub's browser uploader limits individual files. Serve the official engine
// compressed and expose a standard streaming WASM response to Godot's loader.
(() => {
  const originalFetch = window.fetch.bind(window);
  window.fetch = async (input, init) => {
    const url = new URL(typeof input === 'string' ? input : input.url, location.href);
    if (url.origin === location.origin && url.pathname.endsWith('/game.wasm')) {
      const response = await originalFetch(new URL('game.wasm.gz', url), init);
      if (!response.ok) throw new Error('Could not download the game engine. Please reload.');
      return new Response(response.body.pipeThrough(new DecompressionStream('gzip')), {
        headers: {'Content-Type': 'application/wasm', 'Content-Length': '39514754'}
      });
    }
    return originalFetch(input, init);
  };
})();
