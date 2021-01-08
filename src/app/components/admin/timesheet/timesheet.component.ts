import {Component} from '@angular/core';


/* export interface PeriodicElement {
  project: string;
  mon: number;
  tue: number;
  wed: number;
  thru: number;
  fri: number;
  TotalHours: number;
}

const ELEMENT_DATA: PeriodicElement[] = [
  {project: 'Modular Processing Unit', mon: null, tue: 1, wed: 1, thru: 1, fri: 1, TotalHours:7},
  {project: 'FICOTEQ Laydown trailer', mon: 4, tue: 1, wed: 1, thru: 1, fri: 1, TotalHours:7},
  {project: 'Gas Processing', mon: 2, tue: 1, wed: 1, thru: 1, fri: 1, TotalHours:7},
  {project: 'GULEI Stack Extension', mon: 1, tue: 1, wed: 1, thru: 1, fri: 1, TotalHours:7},
  {project: 'Fractionation', mon: 0, tue: 1, wed: 1, thru: 1, fri: 1, TotalHours:7},
  {project: 'Targa Little Missouri IV', mon: 1, tue: 1, wed: 1, thru: 1, fri: 1, TotalHours:7},
  {project: 'a', mon: 0, tue: 0, wed: 0, thru: 0, fri: 0, TotalHours:0},
  {project: 'a', mon: 0, tue: 0, wed: 0, thru: 0, fri: 0, TotalHours:0},
  {project: 'a', mon: 0, tue: 0, wed: 0, thru: 0, fri: 0, TotalHours:0},
  {project: 'a', mon: 0, tue: 0, wed: 0, thru: 0, fri: 0, TotalHours:0},
]; */


@Component({
  selector: 'app-timesheet',
  styleUrls: ['./timesheet.component.css'],
  templateUrl: './timesheet.component.html',
})
export class TimesheetComponent {
  /* displayedColumns: string[] = ['project', 'mon', 'tue', 'wed', 'thru', 'fri','TotalHours'];
  dataSource = ELEMENT_DATA; */

  name= "Timesheet";


  timeEntryList: any =[
    {
      projectName: "Modular Processing Unit",
      timeDistributionList:[
        {
          dayTitle:"Monday",
          Hours: null
        },
        {
          dayTitle:"Tuesday",
          Hours: null
        },
        {
          dayTitle:"Wednesday",
          Hours: null
        },
        {
          dayTitle:"Thrusday",
          Hours: null
        },
        {
          dayTitle:"Friday",
          Hours: null
        },
      ]

    },
    {
      projectName: "FICOTEQ Laydown trailer",
      timeDistributionList:[
        {
          dayTitle:"Monday",
          Hours: null
        },
        {
          dayTitle:"Tuesday",
          Hours: null
        },
        {
          dayTitle:"Wednesday",
          Hours: null
        },
        {
          dayTitle:"Thrusday",
          Hours: null
        },
        {
          dayTitle:"Friday",
          Hours: null
        },
      ]

    },
    {
      projectName: "Gas Processing",
      timeDistributionList:[
        {
          dayTitle:"Monday",
          Hours: null
        },
        {
          dayTitle:"Tuesday",
          Hours: null
        },
        {
          dayTitle:"Wednesday",
          Hours: null
        },
        {
          dayTitle:"Thrusday",
          Hours: null
        },
        {
          dayTitle:"Friday",
          Hours: null
        },
      ]

    },
    {
      projectName: "GULEI Stack Extension",
      timeDistributionList:[
        {
          dayTitle:"Monday",
          Hours: null
        },
        {
          dayTitle:"Tuesday",
          Hours: null
        },
        {
          dayTitle:"Wednesday",
          Hours: null
        },
        {
          dayTitle:"Thrusday",
          Hours: null
        },
        {
          dayTitle:"Friday",
          Hours: null
        },
      ]

    },
    {
      projectName: "Fractionation",
      timeDistributionList:[
        {
          dayTitle:"Monday",
          Hours: null
        },
        {
          dayTitle:"Tuesday",
          Hours: null
        },
        {
          dayTitle:"Wednesday",
          Hours: null
        },
        {
          dayTitle:"Thrusday",
          Hours: null
        },
        {
          dayTitle:"Friday",
          Hours: null
        },
      ]

    },
    {
      projectName: "Targa Little Missouri IV",
      timeDistributionList:[
        {
          dayTitle:"Monday",
          Hours: null
        },
        {
          dayTitle:"Tuesday",
          Hours: null
        },
        {
          dayTitle:"Wednesday",
          Hours: null
        },
        {
          dayTitle:"Thrusday",
          Hours: null
        },
        {
          dayTitle:"Friday",
          Hours: null
        },
      ]

    }

  ]

  getTotal(time){
    let total = 0;
    time.forEach(item =>{
      total += Number(item.Hours);
    });

    return total;
  }

}

