import { TDetectData } from '@/interface';

export const rectColor = ['blue', 'yellow', 'red'];

export const detectCanvasDraw = (data: TDetectData, canvas: any) => {
  let context = canvas.getContext('2d');
  let canvasSend = canvas.current;

  context.drawImage(canvasSend, 0, 0, 400, 300);
  let { imageInfo, detectTargetList, percentList, totalTargetNum } = data;

  for (let index = 0; index < detectTargetList.length; index++) {
    let detectLocalTarget = detectTargetList[index];
    // 将视频帧绘制到canvas上
    // context.drawImage(video, 0, 0, video.width, video.height);
    context.strokeStyle = rectColor[index / 3]; // 框线颜色
    context.lineWidth = 2; // 框线宽度

    let {
      corporation_x_min,
      corporation_y_min,
      corporation_x_max,
      corporation_y_max,
      chooseName,
      corporationList,
    } = detectLocalTarget;
    // 绘制一个框
    let width = corporation_x_max - corporation_x_min;
    let height = corporation_y_max - corporation_y_min;
    context.beginPath();
    context.rect(corporation_x_min, corporation_y_min, width, height); // x, y, 宽度, 高度
    context.closePath();
    context.stroke(); // 绘制框线
    // 设置字体样式
    context.font = '15px Arial';
    context.fillStyle = 'red';
    // 在Canvas上写字
    context.fillText(
      `${chooseName}:${corporationList}`,
      corporation_x_min,
      corporation_y_min,
    );
    console.log({ width, height });
  }
};
