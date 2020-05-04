
//// <reference path="base-component.ts" />
//// <reference path="../decorators/autobind.ts" />
//// <reference path="../models/project.ts" />
//// <reference path="../models/drag-drop.ts" />

import { Draggable  } from "../models/drag-drop.js";
import { Project  } from "../models/project.js";
import Compon from "../components/base-component.js";
import { autobind  } from "../decorators/autobind.js";

// namespace App {
    
    //ProjectItem class 

    export class ProjectItem extends Compon<HTMLUListElement, HTMLLIElement> implements Draggable {
        private project: Project;


        get persons() {
            if (this.project.people === 1) {
                return '1 person'
            }
            else {
                return `${this.project.people} persons`
            }
        }


        constructor(hostId: string, project: Project) {
            super('single-project', hostId, false, project.id);
            this.project = project;

            this.configure();
            this.renderContent();
        }

        @autobind
        dragStartHandler(event: DragEvent) {
            event.dataTransfer!.setData('text/plain', this.project.id);
            event.dataTransfer!.effectAllowed = 'move';
        }

        dragEndHanlder(_: DragEvent) {
            console.log('Dragend');

        }

        configure() {
            this.element.addEventListener('dragstart', this.dragStartHandler)
            this.element.addEventListener('dragend', this.dragEndHanlder)
        }

        renderContent() {
            this.element.querySelector('h2')!.textContent = this.project.title;
            this.element.querySelector('h3')!.textContent = this.persons + ' assigned';
            this.element.querySelector('p')!.textContent = this.project.description;

        }
    }

// }