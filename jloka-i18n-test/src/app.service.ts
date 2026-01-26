import { Injectable } from '@nestjs/common';
import { I18nContext, I18nService } from 'nestjs-i18n';

@Injectable()
export class AppService {
  constructor(private readonly i18n: I18nService) {}
  getHello(): Object {
    return {
      "1": this.i18n.t('test.HELLO', { lang: I18nContext?.current()?.lang }),
      "2": this.i18n.t('test.PRODUCT.NEW', { args: { name: "Jafar Loka-01" }})
    };
  }

}
