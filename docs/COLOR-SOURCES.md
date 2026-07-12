# 成员与组合代表色数据规范

- 核验日期：2026-07-12
- 项目指定权威源：[shinycolors.moe](https://shinycolors.moe/idolinfo?idolid=1)
- 机器可读源：[shinycolors.moe unitInfo API](https://api.shinycolors.moe/info/unitInfo)
- 用途：约束成员和组合身份色的数据取值、字段和无障碍使用
- 结论：实现阶段应把颜色加入 `shiny_colors_idol_measurements.json`，本次规划阶段不修改原始数据

## 1. 产品数据裁决

本项目的成员和组合颜色以用户指定的 `shinycolors.moe` 当前数据为准。该站是第三方资料库，不应在页面文案中称为万代南梦宫官方站，但在本项目范围内是颜色值的权威数据源。

实施规则：

1. 成员采用 API 的 `color2`，与成员页面显示的“色碼”一致。
2. 组合同时保留 API 的 `color1` 和 `color2`，不压缩为一个猜测值。
3. 不从头像、官方站图片或 CSS 再次取色覆盖 API 数据。
4. 若其他来源与 API 冲突，记录冲突但仍采用 API 当前值，除非产品负责人再次变更数据源。
5. 页面可说明“颜色数据来自 shinycolors.moe”，不能把第三方 API 值描述为官方明示 HEX。

## 2. 数据来源与可复现方式

- 全量组合和成员：`GET https://api.shinycolors.moe/info/unitInfo`
- 单成员：`GET https://api.shinycolors.moe/info/idolInfo?idolId={id}`
- 成员页面：`https://shinycolors.moe/idolinfo?idolid={id}`
- 开源前端：[ShinyColorsDB-DataSite](https://github.com/ShinyColorsDB/ShinyColorsDB-DataSite)
- 开源 API：[ShinyColorsDB-ApiServer](https://github.com/ShinyColorsDB/ShinyColorsDB-ApiServer)

28 名目标成员使用 `idolId=1..28`。91、801-804 等其他角色不属于本产品当前范围。

颜色应在数据更新流程中离线抄入本地 JSON。网站运行时不请求第三方 API，避免可用性、隐私和性能依赖。

## 3. 成员代表色

下表采用 shinycolors.moe API 的 `color2`。

| idolId | 成员 ID | 日文名 | `color2` | 页面 |
|---:|---|---|---:|---|
| 1 | `mano_sakuragi` | 櫻木 真乃 | `#ffbad6` | [查看](https://shinycolors.moe/idolinfo?idolid=1) |
| 2 | `hiori_kazano` | 風野 灯織 | `#144384` | [查看](https://shinycolors.moe/idolinfo?idolid=2) |
| 3 | `meguru_hachimiya` | 八宮 めぐる | `#ffe012` | [查看](https://shinycolors.moe/idolinfo?idolid=3) |
| 4 | `kogane_tsukioka` | 月岡 恋鐘 | `#f84cad` | [查看](https://shinycolors.moe/idolinfo?idolid=4) |
| 5 | `mamimi_tanaka` | 田中 摩美々 | `#a846fb` | [查看](https://shinycolors.moe/idolinfo?idolid=5) |
| 6 | `sakuya_shirase` | 白瀬 咲耶 | `#006047` | [查看](https://shinycolors.moe/idolinfo?idolid=6) |
| 7 | `yuika_mitsumine` | 三峰 結華 | `#3b91c4` | [查看](https://shinycolors.moe/idolinfo?idolid=7) |
| 8 | `kiriko_yukoku` | 幽谷 霧子 | `#d9f2ff` | [查看](https://shinycolors.moe/idolinfo?idolid=8) |
| 9 | `kaho_komiya` | 小宮 果穂 | `#e5461c` | [查看](https://shinycolors.moe/idolinfo?idolid=9) |
| 10 | `chiyoko_sonoda` | 園田 智代子 | `#f93b90` | [查看](https://shinycolors.moe/idolinfo?idolid=10) |
| 11 | `juri_saijo` | 西城 樹里 | `#ffc602` | [查看](https://shinycolors.moe/idolinfo?idolid=11) |
| 12 | `rinze_morino` | 杜野 凛世 | `#89c3eb` | [查看](https://shinycolors.moe/idolinfo?idolid=12) |
| 13 | `natsuha_arisugawa` | 有栖川 夏葉 | `#90e667` | [查看](https://shinycolors.moe/idolinfo?idolid=13) |
| 14 | `amana_osaki` | 大崎 甘奈 | `#f54275` | [查看](https://shinycolors.moe/idolinfo?idolid=14) |
| 15 | `tenka_osaki` | 大崎 甜花 | `#e75bec` | [查看](https://shinycolors.moe/idolinfo?idolid=15) |
| 16 | `chiyuki_kuwayama` | 桑山 千雪 | `#fbfafa` | [查看](https://shinycolors.moe/idolinfo?idolid=16) |
| 17 | `asahi_serizawa` | 芹沢 あさひ | `#f30100` | [查看](https://shinycolors.moe/idolinfo?idolid=17) |
| 18 | `fuyuko_mayuzumi` | 黛 冬優子 | `#5ce626` | [查看](https://shinycolors.moe/idolinfo?idolid=18) |
| 19 | `mei_izumi` | 和泉 愛依 | `#ff00ff` | [查看](https://shinycolors.moe/idolinfo?idolid=19) |
| 20 | `toru_asakura` | 浅倉 透 | `#50d0d0` | [查看](https://shinycolors.moe/idolinfo?idolid=20) |
| 21 | `madoka_higuchi` | 樋口 円香 | `#be1e3e` | [查看](https://shinycolors.moe/idolinfo?idolid=21) |
| 22 | `koito_fukumaru` | 福丸 小糸 | `#7967c3` | [查看](https://shinycolors.moe/idolinfo?idolid=22) |
| 23 | `hinana_ichikawa` | 市川 雛菜 | `#ffc639` | [查看](https://shinycolors.moe/idolinfo?idolid=23) |
| 24 | `nichika_nanakusa` | 七草 にちか | `#a6ceb6` | [查看](https://shinycolors.moe/idolinfo?idolid=24) |
| 25 | `mikoto_aketa` | 緋田 美琴 | `#760f10` | [查看](https://shinycolors.moe/idolinfo?idolid=25) |
| 26 | `luca_ikaruga` | 斑鳩 ルカ | `#24130d` | [查看](https://shinycolors.moe/idolinfo?idolid=26) |
| 27 | `hana_suzuki` | 鈴木 羽那 | `#e0b5d3` | [查看](https://shinycolors.moe/idolinfo?idolid=27) |
| 28 | `haruki_ikuta` | 郁田 はるき | `#ead7a4` | [查看](https://shinycolors.moe/idolinfo?idolid=28) |

## 4. 组合颜色

组合同时保留 shinycolors.moe `unitInfo` API 的 `color1` 和 `color2`。领域命名采用 `soft` 和 `primary`，并在来源字段中记录原始字段名。

| source_id | 组合 ID | 名称 | `color1` / soft | `color2` / primary |
|---:|---|---|---:|---:|
| 1 | `illumination_stars` | illumination STARS | `#ffea86` | `#ffe462` |
| 2 | `lantica` | L’Antica | `#f7d8ff` | `#e3b1fa` |
| 3 | `hokagoclimaxgirls` | 放課後クライマックスガールズ | `#fedec7` | `#ffa95c` |
| 4 | `alstroemeria` | ALSTROEMERIA | `#ffd9e6` | `#ffabc9` |
| 5 | `straylight` | Straylight | `#ffdbdb` | `#ffb3b6` |
| 6 | `noctchill` | noctchill | `#dbe4ff` | `#a9bbfd` |
| 7 | `shhis` | SHHis | `#c3f4ee` | `#8cdbd1` |
| 8 | `cometik` | CoMETIK | `#827976` | `#827976` |

### 组合颜色使用

- `primary` 用于组合榜色条、组合图标边界和小面积身份标记。
- `soft` 用于组合图标底板或低对比背景。
- 不要求把二者组成渐变。若使用渐变，必须只是身份底板，不能承载文字可读性。
- CoMETIK 两值相同，应按单色呈现，不人为制造第二色。

## 5. 与其他来源的冲突记录

这部分只用于追溯，不参与首版取值。

| 成员 | shinycolors.moe 权威值 | 其他已发现值 | 处理 |
|---|---:|---:|---|
| 桑山 千雪 | `#fbfafa` | 当前官方图片背景 `#fafafa` | 采用 shinycolors.moe |
| 黛 冬優子 | `#5ce626` | 当前官方图片背景 `#5aff19` | 采用 shinycolors.moe |
| 七草 にちか | `#a6ceb6` | 当前官方图片背景 `#a6cdb6` | 采用 shinycolors.moe |
| 斑鳩 ルカ | `#24130d` | imas-db 旧整理 `#35281f` | 采用 shinycolors.moe |

这些差异说明不能通过截图或素材像素自动覆盖产品数据。只有产品负责人明确更换权威源时才更新。

## 6. JSON 最小扩展方案

根级 `schema_version` 从 `1.0` 升为 `1.1`。

成员对象增加 `source_id`，同时用于第三方数据追溯和头像编号：

```json
{
  "source_id": 1,
  "representative_color": {
    "hex": "#ffbad6",
    "source": "shinycolors_moe",
    "source_field": "color2",
    "source_url": "https://api.shinycolors.moe/info/idolInfo?idolId=1",
    "verified_at": "2026-07-12"
  }
}
```

组合对象增加对应 `unitId` 的 `source_id`，同时用于组合图标编号：

```json
{
  "source_id": 1,
  "representative_colors": {
    "soft": "#ffea86",
    "primary": "#ffe462",
    "source": "shinycolors_moe",
    "source_fields": {
      "soft": "color1",
      "primary": "color2"
    },
    "source_url": "https://api.shinycolors.moe/info/unitInfo",
    "verified_at": "2026-07-12"
  }
}
```

第三方 API 的 `idolId` 和 `unitId` 只写入 `source_id`，不替代项目主键。现有 snake_case `id` 和 `unit_id` 继续作为稳定主键。成员头像路径使用 `source_id` 补足三位数，例如 `1 -> 001.png`；绝不能按 JSON 扁平数组下标配图。

## 7. 界面使用规则

- 颜色是身份数据，不是正文文字色。
- 成员总榜进度条填充使用成员 `representative_color.hex`。
- 组合榜使用组合 `primary`，图标底板可用 `soft`。
- 千雪 `#fbfafa` 等近白色必须增加中性外描边或有对比底板，不能改写 HEX。
- 雷达图使用成员原色作为上层线和低透明填充，下方增加较宽的中性 halo。
- A/B 同时使用线型和点形区分，不能只依赖颜色。
- 焦点环、正文、按钮使用固定无障碍 token，不随代表色改变。
- 不为满足对比度而把代表色另造为“深色版本”。

## 8. 更新与测试

- 实现阶段一次性把批准值写入本地 JSON，运行时不请求 API。
- 自动测试验证 28 个成员值、8 组双颜色、HEX 格式和来源字段完整。
- 更新前记录 API 响应时间和差异，不自动覆盖仓库数据。
- 若 API 不可用，继续使用已提交的本地数据。
- 若 API 将来变化，先生成差异报告并由产品负责人确认，再更新本地 JSON。
