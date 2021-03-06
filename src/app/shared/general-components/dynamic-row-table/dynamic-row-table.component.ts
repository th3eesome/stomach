import { Component, OnInit } from '@angular/core';
import { ConfInterface } from '@app/shared/conf-interface';

@Component({
  selector: 'app-dc-dynamic-row-table',
  templateUrl: './dynamic-row-table.component.html',
  styleUrls: ['./dynamic-row-table.component.css']
})
export class DynamicRowTableComponent extends ConfInterface implements OnInit {
  displayControl = true;
  ngOnInit() {
    this.init_year_selector();
  }
  constructor() {
    super();
  }
  addRow() {
    if (this.conf.layout.contentLayout) {
      const elem = [];
      for ( let i = 0;  i < this.conf.layout.dynamicRowLayout.length; i++) {
        const ot = JSON.parse(JSON.stringify(this.conf.layout.dynamicRowLayout[i]));
        elem.push(ot);
      }
      this.conf.layout.contentLayout.push(elem);
    } else {
      this.conf.layout.contentLayout = [];
      const elem = [];
      for ( let i = 0;  i < this.conf.layout.dynamicRowLayout.length; i++) {
        const ot = JSON.parse(JSON.stringify(this.conf.layout.dynamicRowLayout[i]));
        elem.push(ot);
      }
      this.conf.layout.contentLayout.push(elem);
    }
  }
  deleteRow(index) {
    this.conf.layout.contentLayout.splice(index, 1);
  }
  init_year_selector () {
    for (let i = 0; i < this.conf.layout.dynamicRowLayout.length; i++) {
      if (this.conf.layout.dynamicRowLayout[i].type === 'year_selector') {
        const this_year = new Date().getFullYear();
        const options_tem = [];
        for ( let ago = 0; ago < 150; ago ++) {
          options_tem.push((this_year - ago) + '年');
        }
        this.conf.layout.dynamicRowLayout[i].options = options_tem;
      }
    }
  }
  answerChange() {
    for ( const group of this.conf.layout.contentLayout) {
      for ( const item of group) {
        if ( item.type === 'option') {
          if ( item.options_reference) {
            if (item.options_reference.length === 1) {
              const refc = group[item.options_reference[0]];
              const index_o = refc.options.indexOf(refc.key_value._value);
              item.options = item.ref_options[index_o];
            }
            if ( item.options_reference.length === 2) {
              const refc_1 = group[item.options_reference[0]];
              const refc_2 = group[item.options_reference[1]];
              const index_1 = refc_1.options.indexOf(refc_1.key_value._value);
              const index_2 = refc_2.options.indexOf(refc_2.key_value._value);
              item.options = item.ref_options[index_1][index_2];
            }
          }
          // if (item.options_referenceId) {
          //   const  refc = group[item.options_referenceId];
          //   item.options = item.ref_options[refc.options.indexOf()]
          // }
          if (item.disabled_ref === 0 || item.disabled_ref) {
            const ref_d = group[item.disabled_ref];
            if (ref_d.key_value._value && ref_d.key_value._value !== '') {
              item.disabled = false;
            }
          }
        }
        if (item.disabled_ref === 0 || item.disabled_ref) {
          const ref_d = group[item.disabled_ref];
          if (ref_d.key_value._value && ref_d.key_value._value !== '') {
            item.disabled = false;
          }
        }
      }
    }
  }
}
