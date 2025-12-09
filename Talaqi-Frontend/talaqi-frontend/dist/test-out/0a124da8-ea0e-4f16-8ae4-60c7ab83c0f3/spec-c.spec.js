import {
  Component,
  TestBed,
  __decorate,
  init_core,
  init_testing,
  init_tslib_es6
} from "./chunk-USG3UEQQ.js";
import {
  __async,
  __commonJS,
  __esm
} from "./chunk-HBW54YOI.js";

// angular:jit:template:src\app\pages\page\components\c\c.html
var c_default;
var init_c = __esm({
  "angular:jit:template:src\\app\\pages\\page\\components\\c\\c.html"() {
    c_default = "<p>c works!</p>\r\n";
  }
});

// angular:jit:style:src\app\pages\page\components\c\c.css
var c_default2;
var init_c2 = __esm({
  "angular:jit:style:src\\app\\pages\\page\\components\\c\\c.css"() {
    c_default2 = "/* src/app/pages/page/components/c/c.css */\n/*# sourceMappingURL=c.css.map */\n";
  }
});

// src/app/pages/page/components/c/c.ts
var C;
var init_c3 = __esm({
  "src/app/pages/page/components/c/c.ts"() {
    "use strict";
    init_tslib_es6();
    init_c();
    init_c2();
    init_core();
    C = class C2 {
    };
    C = __decorate([
      Component({
        selector: "app-c",
        imports: [],
        template: c_default,
        styles: [c_default2]
      })
    ], C);
  }
});

// src/app/pages/page/components/c/c.spec.ts
var require_c_spec = __commonJS({
  "src/app/pages/page/components/c/c.spec.ts"(exports) {
    init_testing();
    init_c3();
    describe("C", () => {
      let component;
      let fixture;
      beforeEach(() => __async(null, null, function* () {
        yield TestBed.configureTestingModule({
          imports: [C]
        }).compileComponents();
        fixture = TestBed.createComponent(C);
        component = fixture.componentInstance;
        fixture.detectChanges();
      }));
      it("should create", () => {
        expect(component).toBeTruthy();
      });
    });
  }
});
export default require_c_spec();
//# sourceMappingURL=spec-c.spec.js.map
