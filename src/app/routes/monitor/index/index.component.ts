import { Component, OnInit } from '@angular/core';
import { _HttpClient } from '@delon/theme';

@Component({
  selector: 'app-monitor-index',
  templateUrl: './index.component.html',
  styleUrls: ['./index.component.less']
})
export class MonitorIndexComponent implements OnInit {

  constructor(private http: _HttpClient) { }

  ngOnInit() { }

}
