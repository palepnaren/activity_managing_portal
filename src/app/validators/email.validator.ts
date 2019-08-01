import { AbstractControl, ValidationErrors } from '@angular/forms';


export class EmailValidator{
   static emailValidate(control: AbstractControl): {[key: string] : any} | null {
        const email: string = control.value;


        if(email.indexOf('\'') == -1 || email == null || email == undefined){
            return null;
        } else if( email.indexOf('OR') == -1){
            return null;
        } else if (email.indexOf('1OR1') == -1){
            return null;
        } else if ( email.indexOf('1or1') == -1){
            return null;
        } else {
            console.log('3');
            return {'emailError': true};
        }
    }    

    
}