import { Application, Router } from 'https://deno.land/x/oak@v11.1.0/mod.ts'

const app = new Application()
const router = new Router()

router.get('/', () => {
  console.log('hello')
})

app.use(router.routes())
await app.listen({ port: 3333 })
