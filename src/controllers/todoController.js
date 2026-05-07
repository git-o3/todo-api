import Todo from "../models/todo.js";
import { asyncHandler } from "../middleware/asyncHandler.js";

export const getTodos = asyncHandler(async (req, res) => {
    // set defaults and cast numbers
    const page = Number(req.query.page) || 1;
    const limit = Number(req.query.limit) || 10;
    const skip = (page - 1) * limit;

    const query = { user: req.user.id };

    // handle boolen filtering 
    if (req.query.comleted) {
        query.comleted = req.query.completed === "true";
    }
    // run both queries (total coun and paginated data)
    const [total, todos] = await Promise.all([
        Todo.countDocuments(query),
        Todo.find(query)
            .limit(limit)
            .skip(skip)
            .sort({ createdAt: -1})
    ])

    // return clean metadata
    res.json({
        success: true,
        count: todos.length,
        total,
        pagination: {
            page,
            limit,
            totalPages: Math.ceil(total / limit)
        },
        data: todos
    });
});

export const createTodo = asyncHandler(async (req, res) => {
    const { title, description } = req.body;

    if (!title || !description) {
        res.status(400);
        throw new Error("Please add both a title and a description");
    }

    const todo = await Todo.create({
        user: req.user.id,
        title,
        description
    });

    res.status(201).json(todo)
})

export const updateTodo = asyncHandler(async (req, res) => {
    const todo = await Todo.findById(req.params.id);

    if (!todo) {
        res.status(404);
        throw new Error("Todo not found");
    }

    // ownership check
    if (todo.user.toString() !== req.user.id) {
        res.status(403);
        throw new Error("Not authorized to update this item");
    }

    const updatedTodo = await Todo.findByIdAndUpdate(
        req.params.id,
        req.body,
        { new: true, runValidators: true }
    );

    res.json(updatedTodo)
})

export const deleteTodo = asyncHandler(async (req, res) => {
    const todo = await Todo.findById(req.params.id);

    if (!todo) {
        res.status(404);
        throw new Error("Todo not found");
    }

    if (todo.user.toString() !== req.user.id) {
        res.status(403);
        throw new Error("Not authorized to delete this item")
    }

    await todo.deleteOne();
    res.status(204).send();
});