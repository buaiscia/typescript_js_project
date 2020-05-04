namespace App {
    //Drag & Drop interfaces
    export interface Draggable {
        dragStartHandler(event: DragEvent): void;

        dragEndHanlder(event: DragEvent): void;
    }

    export interface DragTarget {
        dragOverHandler(event: DragEvent): void;
        dropHandler(event: DragEvent): void;
        dragLeaveHandler(event: DragEvent): void;
    }
}

