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

// angular:jit:template:src\app\pages\page\page.html
var page_default;
var init_page = __esm({
  "angular:jit:template:src\\app\\pages\\page\\page.html"() {
    page_default = "<p>page works!</p>\r\n";
  }
});

// angular:jit:style:src\app\pages\page\page.css
var page_default2;
var init_page2 = __esm({
  "angular:jit:style:src\\app\\pages\\page\\page.css"() {
    page_default2 = "/* src/app/pages/page/page.css */\n/*# sourceMappingURL=page.css.map */\n";
  }
});

// src/app/pages/page/page.ts
var Page;
var init_page3 = __esm({
  "src/app/pages/page/page.ts"() {
    "use strict";
    init_tslib_es6();
    init_page();
    init_page2();
    init_core();
    Page = class Page2 {
    };
    Page = __decorate([
      Component({
        selector: "app-page",
        imports: [],
        template: page_default,
        styles: [page_default2]
      })
    ], Page);
  }
});

// src/app/pages/page/page.spec.ts
var require_page_spec = __commonJS({
  "src/app/pages/page/page.spec.ts"(exports) {
    init_testing();
    init_page3();
    describe("Page", () => {
      let component;
      let fixture;
      beforeEach(() => __async(null, null, function* () {
        yield TestBed.configureTestingModule({
          imports: [Page]
        }).compileComponents();
        fixture = TestBed.createComponent(Page);
        component = fixture.componentInstance;
        fixture.detectChanges();
      }));
      it("should create", () => {
        expect(component).toBeTruthy();
      });
    });
  }
});
export default require_page_spec();
//# sourceMappingURL=spec-page.spec.js.map
