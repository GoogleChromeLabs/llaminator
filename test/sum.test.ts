import { startDevServer } from '@web/dev-server'

it('can load a page', async () => {
  console.log("Hello Peter");
  const server = await startDevServer();
  console.log("Hello Peter");
  await server.stop();
});
