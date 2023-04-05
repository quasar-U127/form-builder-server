const request = require("supertest");
const cors = require("cors");
const express = require("express")
const mongoose = require("mongoose") // new
const routes = require("../routes")

describe('Template Test Suite', () => {
    const app = express()
    let server
    // let mongoConnection
    app.use(cors());
    app.use(express.json())
    app.use("/api", routes)


    beforeAll(async () => {
        await mongoose.connect("mongodb://localhost:27017/sources-testdb", { useNewUrlParser: true })
        server = app.listen(5000, () => {
            // console.log("Server has started at 5000!")
        })
    });
    afterAll(async () => {
        await mongoose.connection.db.dropDatabase()
        await mongoose.connection.close()
        await server.close()
    });
    it('Test get response for /api/admin/create ', async () => {
        const response = await request(app).get("/api/admin/create")
        expect(response.text).toEqual("End point for creating new templates. Visit /admin/:id /templateId /templates /template/:id /user/form also")
    });

    it('Test post response for /api/admin/create ', async () => {
        const response = await request(app).post("/api/admin/create").send({
            "templateId": "source1",
            "templateFields": {
                "apiKey": {
                    "type": "input",
                    "label": "API key",
                    "regexErrorMessage": "Invalid api key",
                    "placeholder": "e.g: 1234asdf",
                    "regex": "[a-z0-9]",
                    "required": true
                },
                "useHTTP": {
                    "type": "checkbox",
                    "required": false,
                    "label": "Enable HTTP"
                },
                "category": {
                    "type": "singleSelect",
                    "label": "Select category",
                    "required": true,
                    "options": [
                        {
                            "label": "Android",
                            "value": "android"
                        },
                        {
                            "label": "IOS",
                            "value": "ios"
                        }
                    ]
                }
            }
        }
        )
        expect(response.status).toEqual(200)
        expect(response.text).toEqual("{\"errors\":0,\"message\":\"Successfully stored source1\"}")
    });

    it('Duplicate creation of Templates ', async () => {
        const response1 = await request(app).post("/api/admin/create").send({
            "templateId": "duplicate-source",
            "templateFields": {
                "apiKey": {
                    "type": "input",
                    "label": "API key",
                    "regexErrorMessage": "Invalid api key",
                    "placeholder": "e.g: 1234asdf",
                    "regex": "[a-z0-9]",
                    "required": true
                }
            }
        }
        )
        expect(response1.status).toEqual(200)
        expect(response1.text).toEqual("{\"errors\":0,\"message\":\"Successfully stored duplicate-source\"}")
        const response2 = await request(app).post("/api/admin/create").send({
            "templateId": "duplicate-source",
            "templateFields": {
                "apiKey": {
                    "type": "input",
                    "label": "API key",
                    "regexErrorMessage": "Invalid api key",
                    "placeholder": "e.g: 1234asdf",
                    "regex": "[a-z0-9]",
                    "required": true
                }
            }
        }
        )
        expect(response2.status).toEqual(403)
        expect(response2.text).toEqual("{\"errors\":1,\"message\":\"Cannot save duplicate-source, it already exists\"}")
    });

    it('Fetch query', async () => {
        const response1 = await request(app).post("/api/admin/create").send({
            "templateId": "good-source",
            "templateFields": {
                "apiKey": {
                    "type": "input",
                    "label": "API key",
                    "regexErrorMessage": "Invalid api key",
                    "placeholder": "e.g: 1234asdf",
                    "regex": "[a-z0-9]",
                    "required": true
                }
            }
        }
        )
        expect(response1.status).toEqual(200)
        expect(response1.text).toEqual("{\"errors\":0,\"message\":\"Successfully stored good-source\"}")

        const response2 = await request(app).get("/api/template/good-source")
        expect(response2.status).toEqual(200)
        const template = JSON.parse(response2.text)
        expect(template.templateId).toEqual("good-source")
        expect(template.templateFields).toEqual("{\"apiKey\":{\"type\":\"input\",\"label\":\"API key\",\"regexErrorMessage\":\"Invalid api key\",\"placeholder\":\"e.g: 1234asdf\",\"regex\":\"[a-z0-9]\",\"required\":true}}")
    });


});