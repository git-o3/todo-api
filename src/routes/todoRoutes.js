import { Router } from "express";
import {
    getTodos,
    createTodo,
    updateTodo,
    deleteTodo
} from "../controllers/todoController.js";
import { protect } from "../auth/auth.js";
import validate from "../validators/index.js";
import { createTodoSchema, 
         updateTodoSchema, 
         querySchema 
} from "../validators/todo.rules.js";


const router = Router();

router.use(protect);

router.route("/")
    .get(validate(querySchema, "query"), getTodos)
    .post(validate(createTodoSchema), createTodo);

router.route("/:id")
    .put(validate(updateTodoSchema), updateTodo)
    .delete(deleteTodo);

export default router;
