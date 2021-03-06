import { HttpClient } from '@angular/common/http';
import { Inject, Injectable, Injector } from '@angular/core';
import { Router } from '@angular/router';
import { ACLService } from '@delon/acl';
import { DA_SERVICE_TOKEN, ITokenService } from '@delon/auth';
import { ALAIN_I18N_TOKEN, MenuService, SettingsService, TitleService } from '@delon/theme';
import { zip } from 'rxjs';
import { catchError } from 'rxjs/operators';

import { NzIconService } from 'ng-zorro-antd/icon';
import { ICONS } from '../../../style-icons';
import { ICONS_AUTO } from '../../../style-icons-auto';
import { group } from '@angular/animations';

/**
 * Used for application startup
 * Generally used to get the basic data of the application, like: Menu Data, User Data, etc.
 */
@Injectable()
export class StartupService {
  constructor(
    iconSrv: NzIconService,
    private menuService: MenuService,
    private settingService: SettingsService,
    private aclService: ACLService,
    private titleService: TitleService,
    @Inject(DA_SERVICE_TOKEN) private tokenService: ITokenService,
    private httpClient: HttpClient,
    private injector: Injector
  ) {
    iconSrv.addIcon(...ICONS_AUTO, ...ICONS);
  }

  private viaHttp(resolve: any, reject: any) {
    zip(
      this.httpClient.get('./assets/tmp/app-data.json')
    ).pipe(
      catchError(([appData]) => {
        resolve(null);
        return [appData];
      })
    ).subscribe(([appData]) => {

      // Application data
      const res: any = appData;
      // Application information: including site name, description, year
      this.settingService.setApp(res.app);
      // User information: including name, avatar, email address
      this.settingService.setUser(res.user);
      // ACL: Set the permissions to full, https://ng-alain.com/acl/getting-started
      this.aclService.setFull(true);
      // Menu data, https://ng-alain.com/theme/menu
      this.menuService.add(res.menu);
      // Can be set page suffix title, https://ng-alain.com/theme/title
      this.titleService.suffix = res.app.name;
    },
      () => { },
      () => {
        resolve(null);
      });
  }

  private viaMock(resolve: any, reject: any) {
    // const tokenData = this.tokenService.get();
    // if (!tokenData.token) {
    //   this.injector.get(Router).navigateByUrl('/passport/login');
    //   resolve({});
    //   return;
    // }
    // mock
    const app: any = {
      name: `ng-alain`,
      description: `Ng-zorro admin panel front-end framework`
    };
    const user: any = {
      name: 'Admin',
      avatar: './assets/tmp/img/avatar.jpg',
      email: 'cipchk@qq.com',
      token: '123456789'
    };
    // Application information: including site name, description, year
    this.settingService.setApp(app);
    // User information: including name, avatar, email address
    this.settingService.setUser(user);
    // ACL: Set the permissions to full, https://ng-alain.com/acl/getting-started
    this.aclService.setFull(true);
    // Menu data, https://ng-alain.com/theme/menu
    this.menuService.add([
      {
        text: '主导航',
        group: true,
        children: [
          {
            text: '仪表盘',
            link: '/dashboard',
            icon: { type: 'icon', value: 'home' }
          },
          // {
          //   text: '快捷导航',
          //   icon: { type: 'icon', value: 'rocket' },
          //   shortcutRoot: true
          // }
        ]
      },
      {
        text: '功能',
        group: true,
        children: [
          {
            text: '资源中心',
            link: '/resources',
            icon: { type: 'icon', value: 'appstore' }
          },
          {
            text: '监控中心',
            link: '/monitor',
            icon: { type: 'icon', value: 'radar-chart' }
          },
          {
            text: '公告管理',
            link: '/notice',
            icon: { type: 'icon', value: 'audit' }
          },
          {
            text: '用户管理',
            link: '/users',
            icon: { type: 'icon', value: 'user' }
          },
        ]
      },
      {
        text: '配置中心',
        group: true,
        children: [
          {
            text: '个人设置',
            link: '/setting',
            icon: { type: 'icon', value: 'profile' }
          },
          {
            text: '全局设置',
            icon: { type: 'icon', value: 'setting' },
            group: true,
            children: [
              {
                text: '阿里云配置',
                link: '/config/ali',
                icon: { type: 'icon', value: 'aliyun' }
              },
              {
                text: '腾讯云配置',
                link: '/config/tencent',
                icon: { type: 'icon', value: 'codepen-circle' }
              },
              {
                text: '七牛云配置',
                link: '/config/qiniu',
                icon: { type: 'icon', value: 'ant-cloud' }
              },
            ]
          },
        ]
      }
    ]);
    // Can be set page suffix title, https://ng-alain.com/theme/title
    this.titleService.suffix = app.name;

    resolve({});
  }

  load(): Promise<any> {
    // only works with promises
    // https://github.com/angular/angular/issues/15088
    return new Promise((resolve, reject) => {
      // http
      // this.viaHttp(resolve, reject);
      // mock：请勿在生产环境中这么使用，viaMock 单纯只是为了模拟一些数据使脚手架一开始能正常运行
      this.viaMock(resolve, reject);

    });
  }
}
