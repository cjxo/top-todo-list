import { format } from "date-fns";

function createEntry(name, projectCategory) {   
    let todoList = [];

    function addTodo(title, dueDate, priority) {
        const idx = todoList.push({
            title: title,
            dueDate: format(dueDate, "MMMM dd, yyyy"),
            priority: priority,
            notes: "",
            isComplete: false
        }) - 1;

        return todoList[idx];
    }

    function findTodo(title) {
        const result = todoList.find(todo => todo.title === title);
        if (result) {
            return result;
        } else {
            return null;
        }
    }

    function removeTodo(title) {
        const result = todoList.findIndex(todo => todo.title === title);
        if (result != -1) {
            todoList.splice(result, 1);
        }
    }

    return { name, todoList, projectCategory, addTodo, findTodo };
}

function createProject() {
    let categories = []

    // TODO: Uniqueness of category name.
    function addCategory(category, initialEntries) {
        const objProjectCategoryIndex = categories.push({
            name: category,
            entries: initialEntries.map((entryName) => createEntry(entryName, category)),
            removeEntry: function(entryName) {
                const idx = this.entries.findIndex(entry => entry.name === entryName);
                if (idx !== -1) {
                    this.entries.splice(idx, 1);
                    return true;
                }

                return false;
            },
            addEntry: function(entryName) {
                console.log(category);
                const idx = this.entries.push(createEntry(entryName, this.name)) - 1;
                return this.entries[idx];
            },
            findEntry: function(entryName) {
                const result = this.entries.find(entry => entry.name === entryName);
                if (result === undefined) {
                    return null;
                } else {
                    return result;
                }
            }
        }) - 1;

        return categories[objProjectCategoryIndex];
    }

    function removeCategory(categoryName) {
        const idx = categories.findIndex(c => c.name === categoryName);
        if (idx !== -1) {
            categories.splice(idx, 1);
        }
    }

    function findCategory(categoryName) {
        const result = categories.find(category => category.name === categoryName);
        if (result === undefined) {
            return null;
        } else {
            return result;
        }
    }

    return { categories, addCategory, removeCategory, findCategory };
}

export { createProject };