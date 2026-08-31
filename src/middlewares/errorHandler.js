// Maps internal/driver errors onto a safe, stable client-facing shape.


const translate = (err) => {
    if (err.code === 11000) {
        const field = Object.keys(err.keyValue || {})[0] || "field"
        return { status: 409, code: "DUPLICATE", message: `An account with this ${field} already exists` }
    }

    if (err.name === "ValidationError") {
        const message = Object.values(err.errors).map((e) => e.message).join(", ")
        return { status: 400, code: "VALIDATION", message }
    }

    if (err.name === "CastError") {
        return { status: 400, code: "INVALID_INPUT", message: `Invalid value for ${err.path}` }
    }

    return { status: 500, code: "INTERNAL", message: "Something went wrong" }
}

const errorHandler = (err, req, res, next) => {
    const { status, code, message } = translate(err)

    // Unrecognised errors are real bugs - log the original, send the client nothing useful to an attacker.
    if (status === 500) {
        console.error(err)
    }

    res.status(status).json({ error: { code, message } })
}

module.exports = { errorHandler }
