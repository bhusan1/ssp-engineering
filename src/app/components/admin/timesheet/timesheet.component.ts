import {Component} from '@angular/core';


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
      projectName: "Shree Liquor",
      timeDistributionList:[
        {dayTitle:"Monday",Hours: null},
        {dayTitle:"Tuesday",Hours: null},
        {dayTitle:"Wednesday",Hours: null},
        {dayTitle:"Thrusday",Hours: null},
        {dayTitle:"Friday",Hours: null},
        {dayTitle:"Saturday",Hours: null},
        {dayTitle:"Sunday",Hours: null},
    ]},
    {
      projectName: "Fresh & Fast Strip Mall",
      timeDistributionList:[
        {dayTitle:"Monday",Hours: null},
        {dayTitle:"Tuesday",Hours: null},
        {dayTitle:"Wednesday",Hours: null},
        {dayTitle:"Thrusday",Hours: null},
        {dayTitle:"Friday",Hours: null},
        {dayTitle:"Saturday",Hours: null},
        {dayTitle:"Sunday",Hours: null},
    ]},
    {
      projectName: "Mount Pleasant Container Liquor Store",
      timeDistributionList:[
        {dayTitle:"Monday",Hours: null},
        {dayTitle:"Tuesday",Hours: null},
        {dayTitle:"Wednesday",Hours: null},
        {dayTitle:"Thrusday",Hours: null},
        {dayTitle:"Friday",Hours: null},
        {dayTitle:"Saturday",Hours: null},
        {dayTitle:"Sunday",Hours: null},
    ]},
    {
      projectName: "GULEI Stack Extension",
      timeDistributionList:[
        {dayTitle:"Monday",Hours: null},
        {dayTitle:"Tuesday",Hours: null},
        {dayTitle:"Wednesday",Hours: null},
        {dayTitle:"Thrusday", Hours: null},
        {dayTitle:"Friday", Hours: null},
        {dayTitle:"Saturday", Hours: null},
        {dayTitle:"Sunday", Hours: null},
    ]},
    {
      projectName: "Fractionation",
      timeDistributionList:[
        {dayTitle:"Monday",Hours: null},
        {dayTitle:"Tuesday",Hours: null},
        {dayTitle:"Wednesday",Hours: null},
        {dayTitle:"Thrusday",Hours: null},
        {dayTitle:"Friday",Hours: null},
        {dayTitle:"Saturday",Hours: null},
        {dayTitle:"Sunday",Hours: null},
    ]},
    {
      projectName: "Targa Little Missouri IV",
      timeDistributionList:[
        {dayTitle:"Monday",Hours: null},
        {dayTitle:"Tuesday",Hours: null},
        {dayTitle:"Wednesday",Hours: null},
        {dayTitle:"Thrusday",Hours: null},
        {dayTitle:"Friday",Hours: null},
        {dayTitle:"Saturday",Hours: null},
        {dayTitle:"Sunday",Hours: null},
    ]}

  ]

  getTotal(time){
    let total = 0;
    time.forEach(item =>{
      total += Number(item.Hours);
    });

    return total;
  }

}

