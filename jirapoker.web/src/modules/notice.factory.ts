import Vue from 'vue';

export class NoticeCustom {

  public static info(content: { title: any, desc: any }, duration: number): any {
    const notice: any = (new Vue()).$Notice;
    notice.config({
      top: 70,
      duration,
    });
    notice.info({
      title: content.title,
      desc: content.desc,
    });
  }
}
