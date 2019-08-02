import { AbstractControl, ValidationErrors } from '@angular/forms';


export class EmailValidator {
   static emailValidate(control: AbstractControl): {[key: string]: any} | null {
        const email: string = control.value;


        if (email.match('^([1-zA-Z0-1@.\s]{1,255})$')) {
            console.log('matched');
        } else {
            console.log('error matching string');
            return {emailError: true};
        }
    }


}
