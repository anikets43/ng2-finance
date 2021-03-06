/* tslint:disable:no-unused-variable */

import { TestBed } from '@angular/core/testing';
import {
  BaseRequestOptions,
  ConnectionBackend,
  Http,
  RequestMethod,
  Response,
  ResponseOptions
} from '@angular/http';
import {
  MockBackend,
  MockConnection
} from '@angular/http/testing';
import { LoaderService } from './loader.service';

export function main() {
  describe('ApiService', () => {
    const url = 'www.test.com';
    let backend: MockBackend;
    let service: LoaderService;
    let response:any;

    beforeEach(() => {
      let injector = TestBed.configureTestingModule({
        providers: [
          LoaderService,
          BaseRequestOptions,
          MockBackend,
          {
            provide: Http,
            deps: [MockBackend, BaseRequestOptions],
            useFactory: (backend: ConnectionBackend, options: BaseRequestOptions): Http => {
              return new Http(backend, options);
            }
          }
        ]
      });

      backend = injector.get(MockBackend);
      service = injector.get(LoaderService);

      response = new Response(new ResponseOptions({
        body: JSON.stringify({test: []})
      }));
    });

    afterEach(() => backend.verifyNoPendingRequests());

    describe('get()', () => {
      it('should perform GET request to provided url', () => {
        backend.connections.subscribe((c: MockConnection) => {
          expect(c.request.method).toBe(RequestMethod.Get);
          expect(c.request.url).toMatch(url);
        });

        service.get(url);
      });

      it('should return response data', () => {
        backend.connections.subscribe((c: MockConnection) => c.mockRespond(response));
        service.get(url)
          .subscribe(
            (res:any) => {
              expect(res).toBeDefined();
              expect(Array.isArray(res.test)).toBe(true);
            }
          );
      });

      it('should return error', () => {
        backend.connections.subscribe((c: MockConnection) => c.mockRespond(null));
        service.get(url)
          .subscribe(
            (res:any) =>  expect(res).toBeUndefined(),
            (error:any) => {
              expect(error.message).toBe('Cannot read property \'json\' of null');
            }
          );
      });
    });


    describe('post()', () => {
      it('should perform POST request to provided url', () => {
        backend.connections.subscribe((c: MockConnection) => {
          expect(c.request.method).toBe(RequestMethod.Post);
          expect(c.request.url).toMatch(url);
        });

        service.post(url, {});
      });

      it('should return response data', () => {
        backend.connections.subscribe((c: MockConnection) => c.mockRespond(response));
        service.post(url, {})
          .subscribe(
            (res:any) => {
              expect(res).toBeDefined();
              expect(Array.isArray(res.test)).toBe(true);
            }
          );
      });

      it('should return error', () => {
        backend.connections.subscribe((c: MockConnection) => c.mockRespond(null));
        service.post(url, {})
          .subscribe(
            (res:any) =>  expect(res).toBeUndefined(),
            (error:any) => {
              expect(error.message).toBe('Cannot read property \'json\' of null');
            }
          );
      });
    });
  });
}
