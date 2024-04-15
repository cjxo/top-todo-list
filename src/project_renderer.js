export default function
createProjectRenderer(projectToBind) {
    const spanProjectCategoryName = document.querySelector(".project-category-name");
    const spanProjectEntryName = document.querySelector(".project-entry-name");

    const divProjectCategories = document.querySelector(".project-categories");
    const divEntryTodos = document.querySelector(".entry-todos");
    const divTodoExpanded = document.querySelector(".todo-expanded");

    const btnCreateNewCategory = document.querySelector(".create-new-category");
    const btnCloseFormNewCategory = document.querySelector(".add-project-category-dlg .close-form-btn");
    const formCreateNewCategory = document.querySelector(".add-project-category-dlg form");
    const inpNewCategory = document.getElementById("new-project-category");
    const dlgAddProject = document.querySelector(".add-project-category-dlg");

    const btnCreateNewTodo = document.querySelector(".create-new-todo");
    const formCreateTodo = document.querySelector(".add-todo-dlg form");
    const inpNewTodo = document.getElementById("new-todo");
    const inpDueDate = document.getElementById("due-date");
    const inpPriority = document.getElementById("priority");
    const btnCloseFormTodo = document.querySelector(".add-todo-dlg .close-form-btn");
    const dlgAddTodo = document.querySelector(".add-todo-dlg");

    let currentlySelectedProjectEntry = null;

    btnCloseFormNewCategory.addEventListener("click", () => {
        dlgAddProject.close("no accepto");
    });

    btnCreateNewCategory.addEventListener("click", () => {
        dlgAddProject.showModal();
    });

    dlgAddProject.addEventListener("close", () => {
        if (dlgAddProject.returnValue === "accept") {
            createRenderablesFromCategory(projectToBind.addCategory(inpNewCategory.value, []));
            inpNewCategory.value = "";

            dlgAddProject.returnValue = "";
        }

        formCreateNewCategory.reset();    
    });

    formCreateNewCategory.addEventListener("submit", (e) => {
        e.preventDefault();
        dlgAddProject.close("accept");
    });

    btnCloseFormTodo.addEventListener("click", () => {
        dlgAddTodo.close("no accepto");
    });

    btnCreateNewTodo.addEventListener("click", () => {
        if (currentlySelectedProjectEntry) {
            dlgAddTodo.showModal();
        }
    });
    
    dlgAddTodo.addEventListener("close", (e) => {
        if (dlgAddTodo.returnValue === "accept") {
            currentlySelectedProjectEntry.addTodo(inpNewTodo.value, inpDueDate.value, inpPriority.value);
            updateTodoListDisplay();
            dlgAddTodo.returnValue = "";
        }

        formCreateTodo.reset();
    });
    
    formCreateTodo.addEventListener("submit", (e) => {
        e.preventDefault();
        dlgAddTodo.close("accept");
    });

    function updateTodoListDisplay() {
        if (!currentlySelectedProjectEntry) return;

        const getWeightFromTodo = (todo) => {
            if (todo.isComplete) {
                return 0;
            }
    
            if (todo.priority === "High") {
                return 2;
            } else {
                return 1;
            }
        };

        clearEntryTodoDisplay();
        currentlySelectedProjectEntry.todoList.sort((a, b) => {
            const wa = getWeightFromTodo(a);
            const wb = getWeightFromTodo(b);
            if (wa > wb) {
                return -1;
            } else if (wa < wb) {
                return 1;
            } else {
                return 0;
            }
        });

        currentlySelectedProjectEntry.todoList.forEach(todo => {
            createTodoRenderables(todo);
        });
    }

    function createTodoRenderables(todo) {
        const divTodoCard = document.createElement("div");
        divTodoCard.setAttribute("class", "todo-card");

        const btnNotComplete = document.createElement("button");
        btnNotComplete.setAttribute("class", todo.isComplete ? "complete" : "not-complete");
        btnNotComplete.appendChild(document.createElement("div"));

        btnNotComplete.addEventListener("click", () => {
            if (btnNotComplete.getAttribute("class") === "not-complete") {
                btnNotComplete.setAttribute("class", "complete");
            } else {
                btnNotComplete.setAttribute("class", "not-complete");
            }

            todo.isComplete = !todo.isComplete;
            updateTodoListDisplay();
        });
        
        const btnCardContent = document.createElement("button");
        btnCardContent.setAttribute("class", "card-content");
        btnCardContent.addEventListener("click", () => {
            clearExpandedTodoDisplay();
            createExpandedTodoRenderables(todo);
        });

        const divTodoTitle = document.createElement("div");
        divTodoTitle.setAttribute("class", "todo-title");
        divTodoTitle.textContent = todo.title;

        btnCardContent.append(divTodoTitle);
        divTodoCard.append(btnNotComplete, btnCardContent);

        divEntryTodos.appendChild(divTodoCard);
    }

    function updateDisplayHeaderForSelectedEntry() {
        if (currentlySelectedProjectEntry) {
            spanProjectCategoryName.textContent = currentlySelectedProjectEntry.projectCategory;
            spanProjectEntryName.textContent = currentlySelectedProjectEntry.name;
        } else {
            spanProjectCategoryName.textContent = "NIL";
            spanProjectEntryName.textContent = "NIL";
        }
    }

    function clearExpandedTodoDisplay() {
        while (divTodoExpanded.firstChild) {
            divTodoExpanded.firstChild.remove();
        }
    }

    function clearEntryTodoDisplay() {
        while(divEntryTodos.firstChild) {
            divEntryTodos.firstChild.remove();
        }
    }

    function createExpandedTodoRenderables(todo) {
        const divTitleHeader = document.createElement("div");
        divTitleHeader.setAttribute("class", "todo-title-header");
        {
            const divTitle = document.createElement("div");
            divTitle.setAttribute("class", "title");
            divTitle.textContent = todo.title;

            const divAdditionalInfo = document.createElement("div");
            divAdditionalInfo.setAttribute("class", "additional-info");
            {
                const divDueDisplay = document.createElement("div");
                divDueDisplay.setAttribute("class", "due-display");
                divDueDisplay.textContent = "Due: " + todo.dueDate;

                const divPrioDisplay = document.createElement("div");
                divPrioDisplay.setAttribute("class", "prio-display");
                {
                    const spanPriorityLabel = document.createElement("span");
                    spanPriorityLabel.textContent = "Priority: ";
                    
                    const spanPriority = document.createElement("span");
                    if (todo.priority === "High") {
                        spanPriority.setAttribute("class", "high-prio");
                    } else {
                        spanPriority.setAttribute("class", "normal-prio");
                    }

                    spanPriority.textContent = todo.priority;

                    divPrioDisplay.append(spanPriorityLabel, spanPriority);
                }

                divAdditionalInfo.append(divDueDisplay, divPrioDisplay);
            }

            divTitleHeader.append(divTitle, divAdditionalInfo);
        }

        const divNotesWrapper = document.createElement("div");
        divNotesWrapper.setAttribute("class", "notes-wrapper");
        {
            const lblNotes = document.createElement("label");
            lblNotes.setAttribute("for", "notes");
            lblNotes.textContent = "Notes";

            const txtNotes = document.createElement("textarea");

            txtNotes.setAttribute("id", "notes");
            txtNotes.placeholder = "add some notes here";
            txtNotes.value = todo.notes;

            txtNotes.addEventListener("input", () => {
                todo.notes = txtNotes.value;
            });

            divNotesWrapper.append(lblNotes, txtNotes);
        }

        const btnSetFinish = document.createElement("button");
        btnSetFinish.setAttribute("class", "set-as-finish-btn");
        btnSetFinish.textContent = !todo.isComplete ? "mark as done" : "done!";

        btnSetFinish.addEventListener("click", () => {
            if (todo.isComplete) {
                btnSetFinish.textContent = "mark as done";
            } else {
                btnSetFinish.textContent = "done!";
            }

            todo.isComplete = !todo.isComplete;
            updateTodoListDisplay();
        });

        divTodoExpanded.append(divTitleHeader, divNotesWrapper, btnSetFinish);
    }

    function createProjectEntryRenderables(entry) {
        const liProjectEntry = document.createElement("li");

        const btnDeleteProjectEntry = document.createElement("button");
        btnDeleteProjectEntry.setAttribute("class", "delete-project-entry-btn");
        btnDeleteProjectEntry.appendChild(document.createElement("div"));
        btnDeleteProjectEntry.addEventListener("click", () => {
            if (currentlySelectedProjectEntry === entry) {
                currentlySelectedProjectEntry = null;
            }

            const category = projectToBind.findCategory(entry.projectCategory)
            category.removeEntry(entry.name);

            if (category.entries.length) {
                currentlySelectedProjectEntry = category.entries[0];
            } else {
                for (let categoryIndex = 0; categoryIndex < projectToBind.categories.length; ++categoryIndex) {
                    const cat = projectToBind.categories[categoryIndex];
                    if (cat.entries.length) {
                        currentlySelectedProjectEntry = cat.entries[0];
                        break;
                    }
                }
            }

            clearEntryTodoDisplay();
            clearExpandedTodoDisplay();
            
            if (currentlySelectedProjectEntry && currentlySelectedProjectEntry.todoList.length) {
                currentlySelectedProjectEntry.todoList.forEach(todo => {
                    createTodoRenderables(todo);
                });
                createExpandedTodoRenderables(currentlySelectedProjectEntry.todoList[0]);
            }

            updateDisplayHeaderForSelectedEntry();
            liProjectEntry.remove();
        });

        const btnToggleTodoDisplay = document.createElement("button");
        btnToggleTodoDisplay.setAttribute("class", "display-project-todo-btn");
        btnToggleTodoDisplay.textContent = entry.name;
        btnToggleTodoDisplay.addEventListener("click", () => {
            currentlySelectedProjectEntry = entry;

            clearEntryTodoDisplay();
            clearExpandedTodoDisplay();
            entry.todoList.forEach(todo => {
                createTodoRenderables(todo);
            });

            updateDisplayHeaderForSelectedEntry();
            if (entry.todoList.length) {
                createExpandedTodoRenderables(entry.todoList[0]);
            }
        });

        liProjectEntry.append(btnDeleteProjectEntry, btnToggleTodoDisplay);

        return(liProjectEntry);
    }

    function createRenderablesFromCategory(category) {
        const ulProjectEntry = document.createElement("ul");
        ulProjectEntry.setAttribute("class", "project-entry");

        const divEntryHeader = document.createElement("div");
        divEntryHeader.setAttribute("class", "entry-header");

        const divTitle = document.createElement("div");
        divTitle.setAttribute("class", "entry-title");
        divTitle.textContent = category.name;

        const btnAddProjectEntry = document.createElement("button");
        btnAddProjectEntry.setAttribute("class", "add-project-entry-btn");
        const divForBtnAdd = document.createElement("div");
        divForBtnAdd.setAttribute("class", "add-entry");
        btnAddProjectEntry.appendChild(divForBtnAdd);

        btnAddProjectEntry.addEventListener("click", () => {
            const liProjectEntry = document.createElement("li");
            const inpProjectEntryName = document.createElement("input");
            inpProjectEntryName.setAttribute("maxlength", 120);
            liProjectEntry.appendChild(inpProjectEntryName);
            ulProjectEntry.append(liProjectEntry);
            
            inpProjectEntryName.required = true;
            inpProjectEntryName.addEventListener("keyup", (e) => {
                if ((e.key === "Enter") && inpProjectEntryName.validity.valid) {
                    const entry = category.addEntry(inpProjectEntryName.value);
                    ulProjectEntry.append(createProjectEntryRenderables(entry));
                    inpProjectEntryName.blur();
                } else if (e.key === "Escape") {
                    inpProjectEntryName.blur();
                }
            });
            
            inpProjectEntryName.addEventListener("focusout", () => {
                liProjectEntry.remove();
                inpProjectEntryName.remove();
            });
            
            inpProjectEntryName.focus();
        });

        const btnDeleteCategory = document.createElement("button");
        btnDeleteCategory.setAttribute("class", "delete-category-btn");
        const divForBtnDelete = document.createElement("div");
        divForBtnDelete.setAttribute("class", "delete-category");
        btnDeleteCategory.appendChild(divForBtnDelete);

        btnDeleteCategory.addEventListener("click", () => {
            projectToBind.removeCategory(category.name);
            ulProjectEntry.remove();
            
            if (currentlySelectedProjectEntry && (category.name === currentlySelectedProjectEntry.projectCategory)) {
                currentlySelectedProjectEntry = null;

                clearEntryTodoDisplay();
                clearExpandedTodoDisplay();
                
                for (let categoryIndex = 0; categoryIndex < projectToBind.categories.length; ++categoryIndex) {
                    const cat = projectToBind.categories[categoryIndex];
                    if (cat.entries.length) {
                        currentlySelectedProjectEntry = cat.entries[0];
                        break;
                    }
                }

                if (currentlySelectedProjectEntry) {
                    if (currentlySelectedProjectEntry.todoList.length) {
                        createExpandedTodoRenderables(currentlySelectedProjectEntry.todoList[0]);
                    }
                    updateTodoListDisplay();
                }
            }
            
            updateDisplayHeaderForSelectedEntry();
        });

        const btnExpandEntries = document.createElement("button");
        btnExpandEntries.setAttribute("class", "expand-btn");
        const divForBtnExpand = document.createElement("div");
        divForBtnExpand.setAttribute("class", "collapse");
        btnExpandEntries.appendChild(divForBtnExpand);

        divForBtnExpand.addEventListener("click", () => {
            if (divForBtnExpand.getAttribute("class") === "collapse") {
                divForBtnExpand.setAttribute("class", "expand");
                btnAddProjectEntry.setAttribute("class", "");

                while (true) {
                    const li = ulProjectEntry.querySelector("li");
                    if (li) {
                        li.remove();
                    } else {
                        break;
                    }
                }
            } else {
                divForBtnExpand.setAttribute("class", "collapse");
                btnAddProjectEntry.setAttribute("class", "add-project-entry-btn");

                category
                    .entries
                    .forEach((entry) => {
                        ulProjectEntry.appendChild(createProjectEntryRenderables(entry));
                    });
            }
        })

        divEntryHeader.append(divTitle, btnAddProjectEntry, btnDeleteCategory, btnExpandEntries);

        ulProjectEntry.appendChild(divEntryHeader);

        category.entries.forEach((entry) => {
            ulProjectEntry.appendChild(createProjectEntryRenderables(entry));
        });

        divProjectCategories.appendChild(ulProjectEntry);
    }

    function begin(initialBoundProjectEntry) {
        currentlySelectedProjectEntry = initialBoundProjectEntry;
        
        projectToBind.categories.forEach(catgeory => {
            createRenderablesFromCategory(catgeory);
        });

        if (initialBoundProjectEntry) {
            clearExpandedTodoDisplay();
            updateTodoListDisplay();
            createExpandedTodoRenderables(initialBoundProjectEntry.todoList[0]);
        }

        updateDisplayHeaderForSelectedEntry();
    }

    return { begin };
}