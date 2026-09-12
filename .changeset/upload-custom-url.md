---
'@xmdrizzol/drizzol-ui': patch
---

上传接口地址支持自定义（此前写死为后端契约路径 `/general/file/upload[/image]`）：

- 新增 `configureFileApi({ uploadUrl?, uploadImageUrl? })`：全局调整上传文件 / 裁剪图片的接口路径，与 `configureRequest`、`configureFileAccessPrefix` 同属运行时配置，宿主在入口调用一次。
- `DUpload` / `DCropper` 新增 `action` 属性：按组件实例覆盖上传地址（如头像上传走独立接口）。
- `uploadFile` / `uploadImage` 的参数新增 `url` 字段：单次调用覆盖，优先级 `params.url` > 全局配置 > 默认契约。
- 默认值不变，未配置时行为与旧版完全一致。
