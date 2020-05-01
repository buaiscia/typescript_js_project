//Project type
enum ProjectStatus { Active, Finished}

class Project {
    constructor(
        public id: string, 
        public title: string, 
        public description: string, 
        public people: number, 
        public status: ProjectStatus) {

    }
}


//Project State management

type Listener = (items: Project []) => void;

class ProjectState {
    private projects: Project [] = [];
    private static instance: ProjectState;
    private listeners: Listener[] = [];
    private constructor() {

    }

    static getInstance() {
        if(this.instance) {
            return this.instance;
        }
        this.instance = new ProjectState();
        return this.instance;
    }

    addListener(listenerFc: Listener) {
        this.listeners.push(listenerFc);
    }

    addProject(title: string, description: string, numOfPeople: number) {
        const newProject = new Project(
                Math.random().toString(),
                title, 
                description, 
                numOfPeople, 
                ProjectStatus.Active)
        // const newProject = {
        //     id: Math.random().toString(),
        //     title: title,
        //     description: description,
        //     people: numOfPeople
        // }
        this.projects.push(newProject);
        for(const listenerFc of this.listeners) {
            listenerFc(this.projects.slice())
        }
    }
}


const projectState = ProjectState.getInstance();


//validation
interface Validatable {
    value: string | number;
    required?: boolean;
    minLength?: number;
    maxLength?: number;
    min?: number;
    max?: number;
}


function validate(validatableInput: Validatable) {
    let isValid = true;
    if (validatableInput.required) {
        isValid = isValid && validatableInput.value.toString().trim().length !== 0;
    }
    if (validatableInput.minLength != null && typeof validatableInput.value === 'string') {
        isValid = isValid && validatableInput.value.length >= validatableInput.minLength;
    }
    if (validatableInput.maxLength != null
        && typeof validatableInput.value === 'string') {
        isValid = isValid && validatableInput.value.length <= validatableInput.maxLength;
    }
    if (validatableInput.min != null && typeof validatableInput.value === 'number') {
        isValid = isValid && validatableInput.value >= validatableInput.min;
    }
    if (validatableInput.max != null && typeof validatableInput.value === 'number') {
        isValid = isValid && validatableInput.value <= validatableInput.max;
    }
    return isValid;
}


// autobind decorator

function autobind(
    _target: any,
    _methodName: string,
    descriptor: PropertyDescriptor) {
    const originalMethod = descriptor.value;
    const adjDescriptor: PropertyDescriptor = {
        configurable: true,
        get() {
            const bindFn = originalMethod.bind(this);
            return bindFn;
        }
    }
    return adjDescriptor
}


//ProjectList class

class ProjectList {

    templateElement: HTMLTemplateElement;
    hostElement: HTMLDivElement;
    element: HTMLElement;
    assignedProjects: Project[];

    constructor(private type: 'active' | 'finished') {
        this.templateElement = document.getElementById('project-list')! as HTMLTemplateElement;
        this.hostElement = document.getElementById('app')! as HTMLDivElement;
        this.assignedProjects = [];

        const importedNode = document.importNode(this.templateElement.content, true);
        this.element = importedNode.firstElementChild as HTMLElement;
        this.element.id = `${type}-projects`;

        projectState.addListener((projects: Project[]) => {
            this.assignedProjects = projects;
            this.renderProjects();
        })

        this.attach();
        this.renderContent();
    }

    private renderProjects() {
            const listEl = document.getElementById(`${this.type}-project-list`)! as HTMLUListElement;
            for (const prjItems of this.assignedProjects) {
                const listItem = document.createElement('li');
                listItem.textContent = prjItems.title;
                listEl.appendChild(listItem)
            }
    }


    private renderContent() {
        const listId = `${this.type}-project-list`;
        this.element.querySelector('ul')!.id = listId;
        this.element.querySelector('h2')!.textContent = this.type.toLocaleUpperCase() + 'PROJECTS';
    }

    private attach() {
        this.hostElement.insertAdjacentElement('beforeend', this.element)
    }
}


//Project input class
class ProjectInput {

    templateElement: HTMLTemplateElement;
    hostElement: HTMLDivElement;
    element: HTMLFormElement;
    titleInputElement: HTMLInputElement;
    descriptionInputElement: HTMLInputElement;
    peopleInputElement: HTMLInputElement;

    constructor() {
        this.templateElement = document.getElementById('project-input')! as HTMLTemplateElement;
        this.hostElement = document.getElementById('app')! as HTMLDivElement;

        const importedNode = document.importNode(this.templateElement.content, true);
        this.element = importedNode.firstElementChild as HTMLFormElement;
        this.element.id = 'user-input';

        this.titleInputElement = this.element.querySelector('#title') as HTMLInputElement;
        this.descriptionInputElement = this.element.querySelector('#description') as HTMLInputElement;
        this.peopleInputElement = this.element.querySelector('#people') as HTMLInputElement;

        this.configure();

        this.attach();
    }


    private gatherUserInput(): [string, string, number] | void {  //validation
        const enteredTitle = this.titleInputElement.value;
        const enteredDescription = this.descriptionInputElement.value;
        const enteredPeople = this.peopleInputElement.value;

        const titleValidatable: Validatable = {
            value: enteredTitle,
            required: true
        }
        const descriptionValidatable: Validatable = {
            value: enteredDescription,
            required: true,
            minLength: 5
        }
        const peopleValidatable: Validatable = {
            value: enteredPeople,
            required: true,
            min: 1,
            max: 5
        }

        // if(enteredTitle.trim().length === 0 || enteredDescription.trim().length === 0 || enteredPeople.trim().length === 0) {
        if (
            !validate(titleValidatable) ||
            !validate(descriptionValidatable) ||
            !validate(peopleValidatable)

        ) {
            alert('invalid input, try again');
            return;
        }
        else {
            return [enteredTitle, enteredDescription, +enteredPeople]
        }
    }

    private clearInputs() {
        this.titleInputElement.value = '';
        this.descriptionInputElement.value = '';
        this.peopleInputElement.value = ''
    }

    @autobind
    private submitHandler(event: Event) {
        event.preventDefault();
        // console.log(this.titleInputElement.value);
        const userInput = this.gatherUserInput();
        if (Array.isArray(userInput)) {
            const [title, description, people] = userInput;
            // console.log(title, description, people);
            projectState.addProject(title, description, people)
            this.clearInputs();
        }
    }

    private configure() {
        this.element.addEventListener('submit', this.submitHandler)
    }

    private attach() {
        this.hostElement.insertAdjacentElement('afterbegin', this.element)
    }
}

const PrgtInput = new ProjectInput();
const activePrjList = new ProjectList('active');
const finishedPrjList = new ProjectList('finished');