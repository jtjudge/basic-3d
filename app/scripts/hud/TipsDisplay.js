
Basic3D.loadModule("TipsDisplay", function (Input, Bindings, Display, EditMenu) {

  var modes = {};
  var list = false;

  EditMenu.registerComponent(function () {

    var menu = document.createElement("div");
    menu.className = "edit-menu-section";

    var title = document.createElement("div");
    title.className = "edit-menu-label edit-menu-tips-header";
    menu.appendChild(title);

    var content = document.createElement("div");
    menu.appendChild(content);

    Input.addKeyBinding("KeyH", "TOGGLE_TIPS", "Toggle Tips");
    Input.register({
      onkeydown: function () {
        if (Input.action("TOGGLE_TIPS")) {
          content.style.display = (content.style.display === "none") ? "block" : "none";
        }
      }
    });

    function buildTip(content, index) {
      var html = "";
      if (!list) {
        html += "<div>";
      } else {
        html += (index > 0) ? ", " : " ";
      }
      html += content;
      if (!list) {
        html += "</div>";
      }
      return html;
    }

    return {
      name: "TipsDisplay",
      element: menu,
      update: function () {
        var mode = modes[Input.mode()];
        if (mode === undefined) {
          mode = { display: Input.mode(), tips: [] };
        }
        var html = "";
        var shown = mode.tips.filter(function (obj) {
          if (obj.condition === undefined) return true;
          return obj.condition();
        });
        shown.forEach(function(obj, index) {
          var txt = obj.builder(function (actionCode) {
            return Bindings.getBinding(actionCode).keyDisplay;
          });
          html += buildTip(txt, index);
        });
        html += buildTip(`${Bindings.getBinding("TOGGLE_TIPS").keyDisplay} to hide tips`, shown.length);
        content.innerHTML = html;
        title.innerHTML = 
        `<div class="edit-menu-tips-mode">${mode.display} Mode</div>`;
      }
    };
  });

  return {
    registerMode: function (params) {
      modes[params.name] = { display: params.display, tips: [] };
      if (params.mapped !== undefined) {
        params.mapped.forEach(function (m) {
          modes[m] = modes[params.name];
        });
      }
    },
    registerTip: function (params) {
      if (modes[params.mode] === undefined) {
        throw (`Cannot register tip for unregistered mode '${params.mode}'`)
      }
      modes[params.mode].tips.push(params);
    },
    toggleListMode: function () {
      list = !list;
    }
  };

});

Basic3D.loadScript("ToggleTipsList", function (TipsDisplay) {

  return TipsDisplay.toggleListMode;

});