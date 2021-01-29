import { Pipe, PipeTransform } from '@angular/core';

@Pipe({
    name: 'optionFilter',
    pure: false
})
export class OptionFilter implements PipeTransform {
    transform(items: any[], filter: Object): any {
        console.log("items >>>>>>>>>>>",items);
        console.log("filter >>>>>>>>>>>",filter);
        if (!items || !filter) {
            return items;
        }
        // filter items array, items which match and return true will be
        // kept, false will be filtered out
       
    }
}