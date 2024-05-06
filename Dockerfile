# class_detection_frontend enviroment 

FROM node:20

LABEL classDetection_frontend="author"

# 复制代码
ADD . /app

# 设置容器启动后的默认运行目录
WORKDIR /app

# 设置默认源
# RUN npm set registry https://registry.npm.taobao.org

# 安装源管理工具
# RUN npm install -g nrm

# 切换镜像源
# RUN npm use taobao

# 安装cnpm
RUN npm install -g cnpm

# 安装node_modules依赖(使用npm)
# RUN npm install --registry=https://registry.npm.taobao.org
RUN cnpm install

#启动项目
CMD npm run start