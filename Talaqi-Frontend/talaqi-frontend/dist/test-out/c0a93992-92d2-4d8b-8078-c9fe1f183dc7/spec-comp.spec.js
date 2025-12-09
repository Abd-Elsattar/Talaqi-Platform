import {
  Component,
  TestBed,
  __decorate,
  init_core,
  init_testing,
  init_tslib_es6
} from "./chunk-3WXPC76P.js";
import {
  __async,
  __commonJS,
  __esm
} from "./chunk-HBW54YOI.js";

// angular:jit:template:src\app\components\comp\comp.html
var comp_default;
var init_comp = __esm({
  "angular:jit:template:src\\app\\components\\comp\\comp.html"() {
    comp_default = "<p>comp works!</p>\r\n";
  }
});

// angular:jit:style:src\app\components\comp\comp.css
var comp_default2;
var init_comp2 = __esm({
  "angular:jit:style:src\\app\\components\\comp\\comp.css"() {
    comp_default2 = "/* src/app/components/comp/comp.css */\n/*# sourceMappingURL=comp.css.map */\n";
  }
});

// src/app/components/comp/comp.ts
var Comp;
var init_comp3 = __esm({
  "src/app/components/comp/comp.ts"() {
    "use strict";
    init_tslib_es6();
    init_comp();
    init_comp2();
    init_core();
    Comp = class Comp2 {
    };
    Comp = __decorate([
      Component({
        selector: "app-comp",
        imports: [],
        template: comp_default,
        styles: [comp_default2]
      })
    ], Comp);
  }
});

// src/app/components/comp/comp.spec.ts
var require_comp_spec = __commonJS({
  "src/app/components/comp/comp.spec.ts"(exports) {
    init_testing();
    init_comp3();
    describe("Comp", () => {
      let component;
      let fixture;
      beforeEach(() => __async(null, null, function* () {
        yield TestBed.configureTestingModule({
          imports: [Comp]
        }).compileComponents();
        fixture = TestBed.createComponent(Comp);
        component = fixture.componentInstance;
        fixture.detectChanges();
      }));
      it("should create", () => {
        expect(component).toBeTruthy();
      });
    });
  }
});
export default require_comp_spec();
//# sourceMappingURL=spec-comp.spec.js.map
