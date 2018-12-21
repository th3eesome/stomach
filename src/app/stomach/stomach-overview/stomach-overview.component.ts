import { Component, OnInit, ViewChild, NgZone} from '@angular/core';
import { MatPaginator, MatTableDataSource,PageEvent} from '@angular/material';
import { HttpService} from '@app/core/services/http.service';
import { SettingsService} from '@app/core/services/settings.service';
import { ActivatedRoute, Router } from '@angular/router';
import { LocalConfigure} from '@app/shared/local-configure';

@Component({
  selector: 'app-stomach-overview',
  templateUrl: './stomach-overview.component.html',
  styleUrls: ['./stomach-overview.component.css']
})
export class StomachOverviewComponent implements OnInit {

  user;
  communityName = '';
  doctorName = '';
  patientName = '';
  startTime = '';
  endTime = '';
  idNumber = '';
  doctorList = [];
  communityList = [];
  pageSize = 10;
  pageIndex = 5;
  listLenth = 100;
  pageSizeOptions: number[] = [5, 10, 25, 100];
  condictions = {
      'filter_dict': { },
      'start': 0,
      'offset': this.listLenth,
      'disease': 'hypertension',
      'follow': 0
  };
  condiction = {
      'pagesize': this.pageSize,
      'pageindex': this.pageIndex
  };
  communitiesDict = new LocalConfigure().communitiesDict;
  communitiesDictReverse = new LocalConfigure().communitiesDictReverse;
  displayedColumns: string[] = ['PID', 'PatientName', 'Occupation', 'Disease', 'Staydays', 'operate'];
  PatientList = new MatTableDataSource(<PeriodicElement[]>(ELEMENT_DATA));
  @ViewChild(MatPaginator) paginator: MatPaginator;
  constructor(
      private service: HttpService,
      private settingService: SettingsService,
      private route: ActivatedRoute,
      private router: Router,
      private zone: NgZone
  ) {}
  ngOnInit() {
      this.user = this.settingService.user;
      this.PatientList.paginator = this.paginator;
      this.roleControl();
      this.getPageData(this.condiction);
  }
  roleControl() {
      if (this.user.role === 'doctor') {
          this.condictions.filter_dict = { complete_by: this.user.name, community: this.user.community};
      } else if (this.user.role === 'community') {
          this.condictions.filter_dict = { community: this.user.community };
      } else if (this.user.role === 'patient') {
          if ( typeof (this.user.idNumber) === 'undefined' ) {
              this.condictions.filter_dict = { '身份证号': this.user.idNumber };
          } else {
              this.condictions.filter_dict = { '身份证号': this.user.idNumber };
          }
      }
  }

  clear() {
      this.patientName = '';
      this.endTime = '';
      this.startTime = '';
      this.doctorName = '';
      this.communityName = '';
      this.idNumber = '';
      this.search();
  }
  search() {
      if (this.user.role === 'super') {
          this.condictions.filter_dict = {
              'community': this.communitiesDictReverse[this.communityName],
              'complete_by': this.doctorName,
              '身份证号': this.idNumber,
              'submit_time': [this.startTime, this.endTime],
              '姓名': this.patientName
          };
          this.getPageData(this.condiction);
      }
      if (this.user.role === 'community') {
          this.condictions.filter_dict = {
              'complete_by': this.doctorName,
              '身份证号': this.idNumber,
              'submit_time': [this.startTime, this.endTime],
              '姓名': this.patientName,
              'community': this.user.community,
          };
          this.getPageData(this.condiction);
      }
      if (this.user.role === 'doctor') {
          this.condictions.filter_dict = {
              'complete_by': this.user.name,
              'community': this.user.community,
              '身份证号': this.idNumber,
              'submit_time': [this.startTime, this.endTime],
              '姓名': this.patientName
          };
      }
  }
  deleteRecord(pid) {
      pid = pid + '';
      const deleteID = {
          PID: pid,
          disease: 'hypertension',
          follow: 0,
          FID: 0
      };
      const deleteParam = {
          body: deleteID
      };
      this.service.deleteRecord(deleteParam).subscribe(res => {
          this.getPageData(this.condiction);
      });
  }
 /* getPageData(condictions) {
      const tableData = [];
      this.service.getRecordList(condictions).subscribe((res) => {
          this.listLenth = res.Count_total;
          condictions.offset = this.listLenth;
          this.service.getRecordList(condictions).subscribe( (data) => {
              const recordList = data.PID_info;
              this.doctorList = [];
              this.communityList = [];
              for ( const item of recordList ) {
                  tableData.push(
                      {
                          PID: item['PID'],
                          PatientName: item['姓名'],
                          DoctorName: item['complete_by'],
                          Community: this.communitiesDict[item['community']],
                          SubmitTime: item['submit_time'].substring(0, 10),
                          UpdateTime: item['update_time'].substring(0, 10)
                      }
                  );
                  if ( this.doctorList.indexOf(item['complete_by']) === -1) {
                      this.doctorList.push(item['complete_by']);
                  }
                  if ( this.communityList.indexOf(this.communitiesDict[item['community']]) === -1) {
                      this.communityList.push(this.communitiesDict[item['community']]);
                  }
              }
              this.listLenth = data.Count_total;
              this.PatientList.data = tableData;
          });
      });
  }*/
  getPageData(condiction) {
      const tableData = [];
      this.service.getRecordList(condiction).subscribe((res) => {
        this.listLenth = res.count_num;
        console.log(this.listLenth)
          this.service.getRecordList(condiction).subscribe( (data) => {
              const recordList = data.data;
              for ( const item of recordList ) {
                  tableData.push(
                      {
                          PID: item['part1_pid'],
                          ZYH: item['part1_zylsh'],
                          PatientName: item['part1_xm'],
                          Occupation: item['part1_zy'],
                          Disease: item['part1_zzd'],
                          Staydays: item['part1_sjzyts'],
                      }
                  );
              }
              this.PatientList.data = tableData;
            });
          });
}
  goToDetail(ele) {
    console.log(ele);
     this.router.navigate([`./detail`, ele.PID, ele.ZYH], {relativeTo: this.route});
  }
}

export interface PeriodicElement {
  PID: string;
  PatientName: string;
  Occupation: string;
  Disease: string;
  Staydays: number;
}
const ELEMENT_DATA: PeriodicElement[] = [
];


