


export const InputTypes = new Set(["input", "checkbox", "singleSelect"])

function verifycheckbox(fieldFormat, fieldData) {
    return ""
}
function verifyRadio(fieldFormat, fieldData) {
    // console.log(fieldData)
    if (fieldFormat.required && typeof fieldData === 'undefined') {
        return "Please select an option"
    }
    return ""
}

function verifyInput(fieldFormat, fieldData) {
    if (fieldFormat.required && typeof fieldData === 'undefined') {
        return "Required field"
    }
    if (fieldFormat.regex) {
        var re = new RegExp("^".concat(fieldFormat.regex, "$"));
        if (!re.test(fieldData)) {
            return fieldFormat.regexErrorMessage
        }
    }
    return ""
}
function verifyElement(fieldFormat, fieldData) {
    switch (fieldFormat.type) {
        case "input":
            return verifyInput(fieldFormat, fieldData)
        case "checkbox":
            return verifycheckbox(fieldFormat, fieldData)
        case "singleSelect":
            return verifyRadio(fieldFormat, fieldData)
    }
}

export function verifyData(format, formData) {
    // console.log(format)
    var errorMessages = {}
    Object.entries(format).map(
        ([elementName, elementFormat]) => { errorMessages[elementName] = verifyElement(elementFormat, formData[elementName]) }
    )
    // console.log(errors)
    // console.log(formData)
    var errors = 0
    var errorMessage = ""

    for (let element in errorMessages) {
        if (errorMessages[element] != "") {
            errorMessage = errorMessage.concat(errorMessages[element], "<br/>")
            errors++
        }
    }

    if (errors > 0)
        return {
            clientVerified: false,
            message: errorMessage
        }
    return {
        clientVerified: true,
        message: "Client Checks Pass"
    }
}

function verifycheckboxTemplate(template) {
    return ""
}
function verifyRadioTemplate(template) {
    // console.log(fieldData)
    if (!("options" in template)) {
        return "\"singleSelect\" type must include \"option\""
    }
    for (let ii in template.options) {
        const option = template.options[ii]
        if (!("value" in option))
            return "Option ".concat(" ", ii, ": Option is missing \"value\"")
        if (typeof option.value !== "string")
            return "Option ".concat(" ", ii, ": The \"value\" field can only accept string values")

        if (!("label" in option))
            return "Option ".concat(" ", ii, ": Option is missing \"label\"")
        if (typeof option.label !== "string")
            return "Option ".concat(" ", ii, ": The \"label\" field can only accept string values")
    }
    return ""
}

function verifyInputTemplate(template) {
    if ("placeholder" in template && typeof template.placeholder !== "string")
        return "The \"placeholder\" field can only accept string values"

    if ("regex" in template) {
        if (typeof template.regex !== "string")
            return "The \"regex\" field can only accept string values"

        if (!("regexErrorMessage" in template))
            return "If using regex please give \"regexErrorMessage\""
        if (typeof template.regexErrorMessage !== "string")
            return "The \"regexErrorMessage\" field can only accept string values"

    }
    return ""
}

function verifyElementTemplate(template) {
    console.log(template)
    if (!("type" in template))
        return "Fields must have a type"

    if (!InputTypes.has(template.type))
        return "Types should be one of [ ".concat(Array.from(InputTypes).join(', '), "]")

    if (!("label" in template))
        return "Fields must have a label"
    if (typeof template.label !== "string")
        return "The \"label\" field can only accept string values"

    if ("required" in template && typeof template.required !== "boolean")
        return "The \"required\" field can only accept boolean values"

    switch (template.type) {
        case "input":
            return verifyInputTemplate(template)
        case "checkbox":
            return verifycheckboxTemplate(template)
        case "singleSelect":
            return verifyRadioTemplate(template)
    }
    return ""
}

export function TemplateVerifier(data) {
    var template = {}
    try {
        template = JSON.parse(data)

    } catch (e) {
        return {
            clientVerified: false,
            message: "This is not a valid JSON"
        }
    }
    console.log(template)
    if (typeof template.templateFields !== "object")
        return {
            clientVerified: false,
            message: "Invalid \"templateFields\" or not found"
        }
    const fields = template.templateFields
    try {
        for (let key in fields) {
            const msg = verifyElementTemplate(fields[key])
            if (msg !== "")
                return {
                    clientVerified: false,
                    message: key.concat(": ", msg)
                }
        }
    } catch (e) {
        return {
            clientVerified: false,
            message: e.message
        }
    }

    return {
        clientVerified: true,
        message: "All checks passed"
    }
}