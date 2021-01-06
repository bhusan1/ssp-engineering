import { Component, Input } from '@angular/core';
import { FormControl } from '@angular/forms';

@Component({
  selector: 'app-form-validator',
  templateUrl: './form-validator.component.html',
  styleUrls: ['./form-validator.component.css']
})
export class FormValidatorComponent {
  @Input() control: FormControl;
  constructor() {}

  get errorMessage(): any {
    if (this.control) {
      for (const propertyName in this.control.errors) {
        if (this.control.errors.hasOwnProperty(propertyName) && this.control.touched && this.control.dirty && !this.control.valid) {
          return this.getValidatorErrorMessage(propertyName, this.control.errors[propertyName]);
        }
      }
    }
    return null;
  }

  getValidatorErrorMessage(validatorName: string, validatorValue?: any): any {
    const config = <any>{
      'required': 'This field is required',
      'email': 'Invalid email address',
      'minlength': `Minimum length ${validatorValue.requiredLength}`,
      'pattern': 'Invalid URL pattern',
      'image': 'Please enter valid image URL'
    };
    return config[validatorName];
  }
}
