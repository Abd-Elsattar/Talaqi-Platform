import {
  Injectable,
  TestBed,
  __decorate,
  init_core,
  init_testing,
  init_tslib_es6
} from "./chunk-3WXPC76P.js";
import "./chunk-HBW54YOI.js";

// src/app/services/service.spec.ts
init_testing();

// src/app/services/service.ts
init_tslib_es6();
init_core();
var Service = class Service2 {
};
Service = __decorate([
  Injectable({
    providedIn: "root"
  })
], Service);

// src/app/services/service.spec.ts
describe("Service", () => {
  let service;
  beforeEach(() => {
    TestBed.configureTestingModule({});
    service = TestBed.inject(Service);
  });
  it("should be created", () => {
    expect(service).toBeTruthy();
  });
});
//# sourceMappingURL=spec-service.spec.js.map
