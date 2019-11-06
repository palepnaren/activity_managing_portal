import { AbstractControl, ValidationErrors } from '@angular/forms';


export class EmailValidator {
   static emailValidate(control: AbstractControl): {[key: string]: any} | null {
        const email: string = control.value;


        if (email.match('^([1-zA-Z0-1@.\s]{1,255})$') && email.substr(email.lastIndexOf('.')).length >= 1 && email.lastIndexOf('.') != -1) {
            console.log('matched');
        } else {
            console.log('error matching string');
            return {emailError: true};
        }
    }

    static userNameValidate(control: AbstractControl): {[key: string]: any} | null {

        const username: string = control.value;

        if (username.match('^[a-zA-Z0-9]+$')) {
            console.log('Good username');
        } else {
            console.log('Enter correct Username');
            return {userNameError: true};
        }
    }


}
