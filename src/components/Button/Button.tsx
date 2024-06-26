/*
 * @Author: wanglinxiang
 * @Date: 2024-05-02 22:53:29
 * @LastEditTime: 2024-05-02 22:53:51
 * @LastEditors: wanglinxiang
 * @Description:
 * @FilePath: \class_detection_frontend\src\components\Button\Button.tsx
 */
import { PropsWithChildren } from 'react';

function Button(props: PropsWithChildren<{ onClick(): void }>) {
  return (
    <button
      onClick={props.onClick}
      className="bg-blue-600 rounded-xl hover:bg-blue-300 text-white
    w-32 py-2 my-6 transition-all"
    >
      {props.children}
    </button>
  );
}

export default Button;
