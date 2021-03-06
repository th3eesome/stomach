import { Component, OnInit } from '@angular/core';
import { survey_list } from '../surveyList';
import { HttpService } from '@app/core/services/http.service';
import {ActivatedRoute, Router} from '@angular/router';
import { dictionary } from '@app/shared/config-items/dictionary-items';

@Component({
  selector: 'app-stomach-form',
  templateUrl: './stomach-form.component.html',
  styleUrls: ['./stomach-form.component.css']
})
export class StomachFormComponent implements OnInit {

  stomach_list = survey_list;
  pid;
  zyh;
  advice_dic = dictionary.part2_yz;
  lis_dic = dictionary.part3_lis;
  result_dic = dictionary.part5_result;
  home_data = [];

 sex = {
    '1': '男',
    '2': '女'
  };

  datainfo = '';
  constructor(
    private http: HttpService,
    private router: ActivatedRoute,
    private route: Router
  ) { }

  ngOnInit() {
   this.pid = this.router.params['value']['PID'];
   this.zyh = this.router.params['value']['ZYH'];
    this.initForm().subscribe((res) => {
      this.home_data = res.data['home'][0];
      // tslint:disable-next-line:max-line-length
      this.datainfo = `住院号：${this.home_data['part1_zyh']}  姓名：${this.home_data['part1_xm']}  年龄：${this.home_data['part1_nl']}岁  性别：${this.sex[this.home_data['part1_xb']]}  主诊断：${this.home_data['part1_zzd']}`;
      const mazui_data = res.data['mazui'][0];
      const result_data = res.data['results'];
      const lis_data = res.data['lis'];
      console.log(res.data['advice']);
      this.stomach_list[2].items[0]['data'] = res.data['advice'];
      this.stomach_list[2].items[0]['dic'] = this.advice_dic;
      this.stomach_list[3].items[0]['data'] = res.data['lis'];
      this.stomach_list[3].items[0]['dic'] = this.lis_dic;
      this.stomach_list[6].items[0]['data'] = res.data['results'];
      this.stomach_list[6].items[0]['dic'] = this.result_dic;
      this.stomach_list[3].items[0]['data'] = lis_data;

      for ( let i = 0; i < this.stomach_list[0].items[0]['layout'].length; i++) {
        const part1 = this.stomach_list[0].items[0]['layout'][i];
        if (part1.key_value) {
          part1.key_value._value = this.home_data[part1.key_value._key];
          // tslint:disable-next-line:max-line-length
          if ( part1.key_value._key === 'part1_sr' || part1.key_value._key === 'part1_rysj' || part1.key_value._key === 'part1_cysj' || part1.key_value._key === 'part1_ssrq') {
            part1.key_value._value = this.home_data[part1.key_value._key].substring(0, 10);
          }
        }
      }
      for ( let i = 0; i < this.stomach_list[5].items[0]['layout'].length; i++) {
        const part4 = this.stomach_list[5].items[0]['layout'][i];
        if (part4.key_value) {
          part4.key_value._value = mazui_data[part4.key_value._key];
          if (part4.key_value._key === 'part4_ssrq') {
            part4.key_value._value = mazui_data[part4.key_value._key].substring(0, 10);
          }

        }
      }
      /*for(let j = 0;j < result_data.length;j++)
      {
         for ( let i = 0; i < this.stomach_list[6].items[0]['layout'].length; i++) {
        const part5 = this.stomach_list[6].items[0]['layout'][i];
        if (part5.key_value) {
          part5.key_value._value = result_data[j][part5.key_value._key];
          console.log(part5.key_value._value);
        }
      }
      }*/

    });
  }

  initForm() {
    return this.http.getPatient(this.pid, this.zyh);
  }
}
