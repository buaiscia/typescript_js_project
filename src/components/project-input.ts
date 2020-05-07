//// <reference path="base-component.ts" />
//// <reference path="base-component.ts" />
//// <reference path="../decorators/autobind.ts" />
//// <reference path="../util/validation.ts" />
//// <reference path="../state/project-state.ts" />

import Compon from "../components/base-component";  //default export allows the exported thing to be the default one, so any name can be assigned
import  * as Validation from "../util/validation";
import { autobind } from "../decorators/autobind";
import { projectState } from "../state/project-state";

// namespace App {
    
    //Project input class
    export class ProjectInput extends Compon<HTMLDivElement, HTMLFormElement>{


        titleInputElement: HTMLInputElement;
        descriptionInputElement: HTMLInputElement;
        peopleInputElement: HTMLInputElement;

        constructor() {
            super('project-input', 'app', true, 'user-input');

            this.titleInputElement = this.element.querySelector('#title') as HTMLInputElement;
            this.descriptionInputElement = this.element.querySelector('#description') as HTMLInputElement;
            this.peopleInputElement = this.element.querySelector('#people') as HTMLInputElement;

            this.configure();
        }

        configure() {

            this.element.addEventListener('submit', this.submitHandler)
        }

        renderContent() {

        }


        private gatherUserInput(): [string, string, number] | void {  //validation
            const enteredTitle = this.titleInputElement.value;
            const enteredDescription = this.descriptionInputElement.value;
            const enteredPeople = this.peopleInputElement.value;

            const titleValidatable: Validation.Validatable = {
                value: enteredTitle,
                required: true
            }
            const descriptionValidatable: Validation.Validatable = {
                value: enteredDescription,
                required: true,
                minLength: 5
            }
            const peopleValidatable: Validation.Validatable = {
                value: enteredPeople,
                required: true,
                min: 1,
                max: 5
            }

            // if(enteredTitle.trim().length === 0 || enteredDescription.trim().length === 0 || enteredPeople.trim().length === 0) {
            if (
                !Validation.validate(titleValidatable) ||
                !Validation.validate(descriptionValidatable) ||
                !Validation.validate(peopleValidatable)

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


    }

// }