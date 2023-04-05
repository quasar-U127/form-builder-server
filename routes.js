const express = require("express")
const Form = require("./models/Form")
const User = require("./models/User")
const Template = require("./models/Template")
const router = express.Router()

router.get("/admin/create", async (req, res) => {

    res.send("End point for creating new templates. Visit /admin/:id /templateId /templates /template/:id /user/form also")

})

router.post("/admin/create", async (req, res) => {

    const templateId = req.body.templateId
    var found = false

    try {
        const template = await Template.findOne({ templateId: templateId })
        console.log(template)
        if (template !== null)
            found = true

    } catch {
    }
    if (found) {
        res.status(403)
        res.send({ errors: 1, message: "Cannot save " + templateId + ", it already exists" })
    } else {
        const template = new Template(
            {
                templateId: templateId,
                templateFields: JSON.stringify(req.body.templateFields)
            }
        )
        await template.save()
        res.status(200)
        res.send({
            errors: 0,
            message: "Successfully stored " + templateId
        })
    }


})



async function get_template(req, res) {
    try {
        const template = await Template.findOne({ templateId: req.params.id })
        res.send(template)
    } catch {
        res.status(404)
        res.send({ error: "Template doesn't exist!" })
    }
}
router.get("/admin/:id", async (req, res) => get_template(req, res))



router.get("/templateId", async (req, res) => {
    try {
        const template = await Template.find({}).select("templateId")
        res.send(template)
    } catch {
        res.status(404)
        res.send({ error: "Template doesn't exist!" })
    }
})
router.get("/templates", async (req, res) => {
    try {
        const template = await Template.find({})
        res.send(template)
    } catch {
        res.status(404)
        res.send({ error: "Template doesn't exist!" })
    }
})

router.get("/template/:id", async (req, res) => get_template(req, res))

router.post("/user/form", async (req, res) => {
    console.log(req.body)
    const form = new Form(
        {
            formType: req.body.type,
            formData: JSON.stringify(req.body.data)
        }
    )
    await form.save()
    res.send({
        errors: 0,
        message: "Stored successfully"
    })
})
module.exports = router