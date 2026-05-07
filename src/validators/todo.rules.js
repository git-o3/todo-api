import Joi from "joi";

export const createTodoSchema = Joi.object({
    title: Joi.string().min(3).max(50).required().trim(),
    description: Joi.string().max(500).allow(" ").trim(),
    completed: Joi.boolean().default(false)
});

export const updateTodoSchema = Joi.object({
    title: Joi.string().min(3).max(50).trim(), // Removed .required()
    description: Joi.string().max(500).allow("").trim(),
    completed: Joi.boolean()
}).min(1)

// validator for the get /todos?page=1&limit=10 query parameters
export const querySchema = Joi.object({
    page: Joi.number().integer().min(1).default(1),
    limit: Joi.number().integer().min(1).max(100).default(10),
    completed: Joi.boolean()
}).min(1)