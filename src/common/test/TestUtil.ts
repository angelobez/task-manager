import { Task } from "@prisma/client";

export default class TestUtil {
    static giveMeAValidTask(): Task {
        return {
            id: 'task_id',
            title: 'title',
            description: 'description',
            status: 'DONE',
            userId: 'user_id',
            dueDate: new Date(),
            createdAt: new Date(),
            updatedAt: new Date()
        }
    }
}