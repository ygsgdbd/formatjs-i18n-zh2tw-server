import {Hono} from 'hono'
import {cors} from "hono/cors";
import cnchar from "cnchar-trad";
import {prettyJSON} from "hono/pretty-json";

const app = new Hono()

app.use(cors({
    origin: ["*"],
    allowMethods: ["*"],
    allowHeaders: ["*"]
}))


app.get('/', (c) => {
    return c.text(`${new Date()}`)
})

app.post("/messages2tw", prettyJSON(), async (c) => {
    const body = await c.req.parseBody<{
        file: File
    }>()
    const text = await body.file.text()
    const messages: Record<string, {
        defaultMessage: string
    }> = JSON.parse(text)
    let converted: Record<string, string> = {}
    Object.keys(messages).forEach((key) => {
        converted[key] = cnchar.convert.simpleToTrad(messages[key].defaultMessage)
    })
    return c.json(converted)
})

export default app
