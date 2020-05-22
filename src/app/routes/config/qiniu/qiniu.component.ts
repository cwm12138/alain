import { Component, OnInit } from '@angular/core';
import { _HttpClient } from '@delon/theme';
import { Config } from 'src/app/shared/domain/config';
import { NzMessageService } from 'ng-zorro-antd/message';

@Component({
  selector: 'app-config-qiniu',
  templateUrl: './qiniu.component.html',
  styleUrls: ["./qiniu.component.less"]
})
export class ConfigQiniuComponent implements OnInit {
  loading = false;
  yun: any = {};
  constructor(private http: _HttpClient, private msg: NzMessageService) { }

  ngOnInit() {
    this.getData();
  }

  getData() {
    this.loading = true;
    this.http.get("/config/qiniu").subscribe(
      res => {
        this.loading = false;
        this.yun = res.data;
      }
    )
  }

  save() {
    this.loading = true;
    let update = {
      "systemId": this.yun.systemId,
      "accessKey": this.yun.accessKey,
      "secretKey": this.yun.secretKey,
      "quota": this.yun.quota,
      "time": this.yun.time
    }
    this.http.put("/config", update).subscribe(
      res => {
        this.loading = false;
        if (res.data == true) {
          this.msg.success("更新成功");
          this.getData();
        } else {
          this.msg.success("更新失败")
        }
      }
    )
  }
}
