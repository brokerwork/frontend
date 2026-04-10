1. 安装typescript
npm install -g typescript
npm install -g typings

2. 进入fooui目录执行以下命令
npm install --registry=https://registry.npm.taobao.org
typings install
npm link

3. 进入brokerwork目录
npm link fooui
npm install --registry=https://registry.npm.taobao.org
typings install

4. 启动brokerwork项目git bash here
gulp dev