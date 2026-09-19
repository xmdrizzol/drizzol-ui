---
'@xmdrizzol/drizzol-ui': minor
---

文件地址不再内置后端契约路径，完全由宿主声明（源码默认为空）：

- **行为变更**：上传接口路径（此前默认 `/general/file/upload[/image]`）与文件访问前缀（此前默认 `/api/general/file/access/`）默认改为**空**。库源码不再内置任何后端地址。按 drizzol 契约使用的宿主需在入口配置一次：`configureFileApi({ uploadUrl, uploadImageUrl })` + `configureFileAccessPrefix(prefix)`（用法见 README）。未配置上传路径时上传会 console.warn 提醒一次；访问前缀未配置时 src 一律原样返回。
- **修复**：DImage / DAvatar / DUpload 预览对服务端相对路径 src（如 `/uploads/abc.png`）误判为 fileRef 拼接访问前缀导致 404（双斜杠地址）——`/` 开头的同源相对路径现在原样使用。
- **新增** `configureFileAccessResolver(resolver)`：宿主完全接管 src → 访问 URL 的解析，优先于前缀配置与内置豁免规则；传 `undefined` 恢复内置规则。
- 文档（README / 演示站）写明 src 的 URL 语义与各后端约定的配置方法。
