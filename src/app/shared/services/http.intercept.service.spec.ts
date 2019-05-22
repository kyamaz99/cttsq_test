import { TestBed } from "@angular/core/testing";

import { HttpInterceptService } from "./http.intercept.service";

describe("HttpInterceptService", () => {
  beforeEach(() => TestBed.configureTestingModule({}));

  it("should be created", () => {
    const service: HttpInterceptService = TestBed.get(HttpInterceptService);
    expect(service).toBeTruthy();
  });
});
