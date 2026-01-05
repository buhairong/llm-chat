"use strict";
const common_vendor = require("../../common/vendor.js");
const common_assets = require("../../common/assets.js");
const _sfc_main = {
  __name: "chat",
  setup(__props) {
    const messages = common_vendor.reactive([]);
    const userInput = common_vendor.ref("");
    function send() {
      messages.push({
        role: "user",
        content: userInput.value
      });
      userInput.value = "";
      common_vendor.index.request({
        url: "https://qianfan.baidubce.com/v2/chat/completions",
        method: "POST",
        header: {
          "Content-Type": "application/json",
          Authorization: "Bearer bce-v3/ALTAK-70ouDlcS3WIdV6HEETNpZ/853d9711854a2f130f725bca613e1a59b39a3161"
        },
        data: {
          model: "ernie-3.5-8k",
          messages
        }
      }).then((res) => {
        common_vendor.index.__f__("log", "at pages/chat/chat.vue:29", res);
        messages.push(res.data.choices[0].message);
        common_vendor.index.setStorageSync("chat-list", messages);
      });
    }
    common_vendor.onLoad(() => {
      common_vendor.index.getStorageSync("chat-list");
      common_vendor.index.__f__("log", "at pages/chat/chat.vue:39", "res");
    });
    return (_ctx, _cache) => {
      return {
        a: common_assets._imports_0$1,
        b: common_vendor.f(messages, (message, index, i0) => {
          return {
            a: common_vendor.t(message.content),
            b: index,
            c: common_vendor.n(message.role)
          };
        }),
        c: userInput.value,
        d: common_vendor.o(($event) => userInput.value = $event.detail.value),
        e: common_vendor.o(send)
      };
    };
  }
};
const MiniProgramPage = /* @__PURE__ */ common_vendor._export_sfc(_sfc_main, [["__scopeId", "data-v-0a633310"]]);
wx.createPage(MiniProgramPage);
//# sourceMappingURL=../../../.sourcemap/mp-weixin/pages/chat/chat.js.map
