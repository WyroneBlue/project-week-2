const fastify = require('fastify')({logger: true});
const auth = require('@fastify/auth')
const bearerAuthPlugin = require('@fastify/bearer-auth')
const {Configuration, OpenAIApi} = require("openai");
const crypto = require('crypto');
const path = require('path');
const fs = require('fs');
require('dotenv').config();

fastify.register(require('@fastify/cookie'), {
    secret: [process.env.BLOOM, process.env.BLOOM2],
    hook: 'onRequest'
});

fastify.register(require('@fastify/view'), {
    engine: {
        eta: require("eta"),
    },
});

fastify.register(require('@fastify/formbody'));

fastify.register(import('@fastify/rate-limit'), {
    max: 1000,
    timeWindow: '1 minute'
});

fastify.setNotFoundHandler((request, reply) => {
    reply.status(404).view('/views/error.eta', {title: 'Error | Stadsdichter', authenticated: false});
});

const configuration = new Configuration({
    apiKey: process.env.KEY,
});

const openai = new OpenAIApi(configuration);

const poemTypes = {
    1: "limerick",
    2: "elevenie",
    "elfje": "elevenie",
    3: "ollekebolleke",
    4: "snelsonnet",
    5: "haiku",
    6: "romantisch drama plot",
    7: "tragedie plot",
    8: "manifest",
    9: "essay",
    10: "six word story",
    11: "toneel opening tragedie",
    12: "toneel opening komedie"
}
let messages = [];

function clean(jsonString) {
    let startIndex = jsonString.indexOf("{");
    if (startIndex === -1) {
        return "";
    }
    let endIndex = jsonString.lastIndexOf("}");
    if (endIndex === -1) {
        return "";
    }
    return jsonString.substring(startIndex, endIndex + 1);
}

function generate(poemType, themes) {
    poemType = poemTypes[poemType] || poemType;
    messages.push({
        "role": "user",
        "content": `Can you create part of a Dutch ${poemType} about these themes?: ${themes}`
    });


    switch (poemType) {
        case "limerick":
            messages.push({
                "role": "system",
                "content": "Schrijf een limerick van vijf regels met een metrum van twee regels met drie amfibrachen, " +
                    "twee regels met een amfibrachys en een jambe en afgesloten door weer een regel met drie amfibrachen met een rijmschema is a a b b a."
            });
            break;
        case "elevenie":
            messages.push({
                "role": "system",
                "content": "Schrijf een elfje van elf woorden op vijf dichtregels. " +
                    "De woorden worden als volgt verdeeld de eerste dichtregel: een woord de tweede regel: twee woorden de derde regel: " +
                    "drie woorden de vierde regel: vier woorden de vijfde regel: één woord, dat het gedicht samenvat. "
            });
            break;
        case "ollekebolleke":
            messages.push({
                "role": "system",
                "content": "Schrijf een Ollekebolleke met twee strofen van elk vier versregels met schema abcd efgd gebruik metrum dactylus met varianten."
            });
            break;
        case "snelsonnet":
            messages.push({
                "role": "system",
                "content": "Schrijf een snelsonnet met een kwatrijn van 4 regels, gevolgd door een distichon van 2 regels. " +
                    "Als metrum dient de vijfvoetige jambe met 10 of 11 lettergrepen, afwisselend onbeklemtoond en beklemtoond. " +
                    "Het rijm van het kwatrijn heeft rijmschema A-B-B-A en de regels van het distichon rijmen op elkaar met rijmschema: C-C " +
                    "maar nooit op een van beide reeds in het kwatrijn gebruikte rijmklanken. Na de laatste zin van het kwatrijn volgt een chute, " +
                    "zodanig dat het distichon de in het kwatrijn betrokken stelling relativeert."
            });
            break;
        case "haiku":
            messages.push({
                "role": "system",
                "content": "Schrijf een Haiku van drie regels waarvan de eerste regel 5, de tweede regel 7 en de derde regel weer 5 lettergrepen telt."
            });
            break;

        case "essay":
            messages.push({
                "role": "system",
                "content": "Schrijf een essay van max 500 woorden over het onderwerp."
            });
            break;
        case "six word story":
            messages.push({
                "role": "system",
                "content": "Schrijf een six word story van maximaal 6 woorden."
            });
            break;
        case "toneel opening tragedie":
            messages.push({
                "role": "system",
                "content": "Schrijf een toneel dialoog van een tragedie voor de eerste akte."
            });
            break;
        case "toneel opening komedie":
            messages.push({
                "role": "system",
                "content": "Schrijf een toneel dialoog van een komedie voor de eerste akte."
            });
            break;
    }

    messages.push({
        "role": "system",
        "content": "Output format in a valid JSON like {paragraph: '...', keywords: [{keyword: lopen, alternatives: [rennen, springen, ...]}, ...]}." +
            "Also use proper punctuation, no weird characters like newlines. Extract between 2 and 6 important adjectives, nouns and/or verbs from the text, " +
            "which are of importance for the text. Generate between 4 and 8 alternatives for each keyword."
            + "Output format in a valid JSON like {paragraph: '...', keywords: [{keyword: lopen, alternatives: [rennen, springen, ...]}, ...]}."
    });

    return messages;
}

function continuePoem(oldWord, newWord) {
    messages.push({
        "role": "user",
        "content": `Can you replace ${oldWord} with ${newWord} in the paragraph text?: Try to make it fit and rewrite the text starting from the replaced word. Change it up a bit, make something cool.`
    });

    messages.push({
        "role": "system",
        "content": "Output format in a valid JSON like {paragraph: '...', keywords: [{keyword: lopen, alternatives: [rennen, springen, ...]}, ...]}." +
            "Use proper punctuation. Extract between 2 and 6 important adjectives, nouns and/or verbs from the text, " +
            "which are of importance for the text. Generate between 4 and 8 alternatives for each keyword."
            + "I only want the Output in a valid JSON format like {paragraph: '...', keywords: [{keyword: lopen, alternatives: [rennen, springen, ...]}, ...]}."
    });

    return messages;
}

function api_generate(poemType, themes) {
    let msgs = [];
    poemType = poemTypes[poemType] || poemType;
    msgs.push({
        "role": "user",
        "content": `Can you create part of a Dutch ${poemType} about these themes?: ${themes}`
    });


    switch (poemType) {
        case "limerick":
            msgs.push({
                "role": "system",
                "content": "Schrijf een limerick van vijf regels met een metrum van twee regels met drie amfibrachen, " +
                    "twee regels met een amfibrachys en een jambe en afgesloten door weer een regel met drie amfibrachen met een rijmschema is a a b b a."
            });
            break;
        case "elevenie":
            msgs.push({
                "role": "system",
                "content": "Schrijf een elfje van elf woorden op vijf dichtregels. " +
                    "De woorden worden als volgt verdeeld de eerste dichtregel: een woord de tweede regel: twee woorden de derde regel: " +
                    "drie woorden de vierde regel: vier woorden de vijfde regel: één woord, dat het gedicht samenvat. "
            });
            break;
        case "ollekebolleke":
            msgs.push({
                "role": "system",
                "content": "Schrijf een Ollekebolleke met twee strofen van elk vier versregels met schema abcd efgd gebruik metrum dactylus met varianten."
            });
            break;
        case "snelsonnet":
            msgs.push({
                "role": "system",
                "content": "Schrijf een snelsonnet met een kwatrijn van 4 regels, gevolgd door een distichon van 2 regels. " +
                    "Als metrum dient de vijfvoetige jambe met 10 of 11 lettergrepen, afwisselend onbeklemtoond en beklemtoond. " +
                    "Het rijm van het kwatrijn heeft rijmschema A-B-B-A en de regels van het distichon rijmen op elkaar met rijmschema: C-C " +
                    "maar nooit op een van beide reeds in het kwatrijn gebruikte rijmklanken. Na de laatste zin van het kwatrijn volgt een chute, " +
                    "zodanig dat het distichon de in het kwatrijn betrokken stelling relativeert."
            });
            break;
        case "haiku":
            msgs.push({
                "role": "system",
                "content": "Schrijf een Haiku van drie regels waarvan de eerste regel 5, de tweede regel 7 en de derde regel weer 5 lettergrepen telt."
            });
            break;

        case "essay":
            msgs.push({
                "role": "system",
                "content": "Schrijf een essay van max 500 woorden over het onderwerp."
            });
            break;
        case "six word story":
            msgs.push({
                "role": "system",
                "content": "Schrijf een six word story van maximaal 6 woorden."
            });
            break;
        case "toneel opening tragedie":
            msgs.push({
                "role": "system",
                "content": "Schrijf een toneel dialoog van een tragedie voor de eerste akte."
            });
            break;
        case "toneel opening komedie":
            msgs.push({
                "role": "system",
                "content": "Schrijf een toneel dialoog van een komedie voor de eerste akte."
            });
            break;
    }

    msgs.push({
        "role": "system",
        "content": "Output format in a valid JSON like {paragraph: '...'} Also use proper punctuation, no weird characters like newlines."
    });


    return msgs;
}

function api_extract(jsonString) {
    let msgs = [];
    msgs.push({
        "role": "user",
        "content": `Can you extract keywords from this text?: ${jsonString}`
    });

    msgs.push({
        "role": "system",
        "content": "Output format in a valid JSON like {paragraph: '...', keywords: [{keyword: lopen, alternatives: [rennen, springen, ...]}, ...]}." +
            "Also use proper punctuation, no weird characters like newlines. Extract between 2 and 6 important adjectives, nouns and/or verbs from the text, " +
            "which are of importance for the text. Generate between 4 and 8 alternatives for each keyword."
            + "Output format in a valid JSON like {paragraph: '...', keywords: [{keyword: lopen, alternatives: [rennen, springen, ...]}, ...]}."
    });

    return msgs;
}

function api_rewrite(prev, oldWord, newWord) {
    let msgs = [];
    msgs.push({
        "role": "user",
        "content": `Can you replace ${oldWord} with ${newWord} in this text?: ${prev} Try to make it fit and rewrite the text starting from the replaced word. Change it up a bit, make something cool.`
    });

    msgs.push({
        "role": "system",
        "content": "Output format in a valid JSON like {paragraph: '...'} Also use proper punctuation, no weird characters like newlines."
    });

    return msgs;
}

async function getCompletion(prompts) {
    const completion = await openai.createChatCompletion({
        model: "gpt-4",
        messages: prompts,
    });

    let output = clean(completion.data.choices[0].message.content);
    return JSON.parse(output);
}

const start = async () => {
    const keys = new Set([process.env.BK]);
    await fastify
        .register(auth)
        .register(bearerAuthPlugin, {addHook: false, keys, verifyErrorLogLevel: 'debug'});

    fastify.route({
        method: 'GET',
        url: '/api/poetry',
        preHandler: fastify.auth([
            fastify.verifyBearerAuth
        ]),
        handler: async (request, reply) => {
            let poemType = poemTypes[request.query["type"]] || Object.keys(poemTypes).find(key => poemTypes[key] === request.query["type"]);
            let theme = request.query["theme"];

            if (!poemType || !theme) {
                reply.status(400).send({"message": "Missing theme or poem type"});
            }

            let prompts = api_generate(poemType, theme);
            let data = await getCompletion(prompts);

            reply.send({data: data});
        }
    });

    fastify.route({
        method: 'POST',
        url: '/api/keywords',
        preHandler: fastify.auth([
            fastify.verifyBearerAuth
        ]),
        handler: async (request, reply) => {
            try {
                let body = JSON.parse(request.body);
                let prompts = api_extract(body.data.paragraph);
                let data = await getCompletion(prompts);

                reply.send({data: data});
            } catch (e) {
                console.log(e);
                reply.status(400).send({"message": "Invalid JSON"});
            }
        }
    });

    fastify.route({
        method: 'POST',
        url: '/api/rewrite',
        preHandler: fastify.auth([
            fastify.verifyBearerAuth
        ]),
        handler: async (request, reply) => {
            try {
                let oldWord = request.query["old"];
                let newWord = request.query["new"];

                if (!oldWord || !newWord) {
                    reply.status(400).send({"message": "Missing old and / or new word query parameters"});
                }

                let body = JSON.parse(request.body);
                let prompts = api_rewrite(body.data.paragraph, oldWord, newWord);
                let data = await getCompletion(prompts);

                reply.send({data: data});
            } catch (e) {
                console.log(e);
                reply.status(400).send({"message": "Invalid JSON"});
            }
        }
    });

    fastify.get('/', async (request, reply) => {
        const nonce = crypto.randomBytes(16).toString('base64');
        reply
            .cookie('__sesh', nonce, {
                path: '/',
                httpOnly: true,
                secure: true,
                sameSite: true,
                signed: true,
            })
            .view('/views/index.eta', {title: 'Home | Stadsdichter'});
    });

    fastify.get('/docs', async (request, reply) => {
        reply.view('/views/docs.eta', {title: 'Docs | Stadsdichter', bk: process.env.BK, host: process.env.ENDPOINT});
    });

    fastify.get('/api', async (request, reply) => {
        reply.redirect('/docs');
    });

    fastify.post('/', async (request, reply) => {
        let cookie = request.cookies.__sesh;
        if (!cookie || !fastify.unsignCookie(cookie).valid) {
            reply.status(401).send({"message": "Unauthorized"});
        } else {
            let poemType = poemTypes[request.body["type"]] || Object.keys(poemTypes).find(key => poemTypes[key] === request.body["type"]);
            let theme = request.body["theme"];

            if (!poemType || !theme) {
                reply.status(400).send({"message": "Missing theme or poem type"});
            }

            let prompts = generate(poemType, theme, true);
            let data = await getCompletion(prompts);

            return reply.view('/views/output.eta', {data: data});
        }
    });

    fastify.get('/cont', async (request, reply) => {
        let cookie = request.cookies.__sesh;
        if (!cookie || !fastify.unsignCookie(cookie).valid) {
            reply.status(401).send({"message": "Unauthorized"});
        } else {
            let oldWord = Object.keys(request.query)[0];
            let newWord = Object.values(request.query)[0];

            let prompts = continuePoem(oldWord, newWord);
            let data = await getCompletion(prompts);

            return reply.view('/views/output.eta', {data: data});
        }
    });

    try {
        await fastify.listen({host: "0.0.0.0", port: process.env.PORT || 3000})
    } catch (err) {
        fastify.log.error(err)
        process.exit(1)
    }
}

start()