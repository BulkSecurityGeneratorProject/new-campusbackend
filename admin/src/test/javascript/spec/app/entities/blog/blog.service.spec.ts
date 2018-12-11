/* tslint:disable max-line-length */
import { TestBed, getTestBed } from '@angular/core/testing';
import { HttpClientTestingModule, HttpTestingController } from '@angular/common/http/testing';
import { HttpClient, HttpResponse } from '@angular/common/http';
import { of } from 'rxjs';
import { take, map } from 'rxjs/operators';
import * as moment from 'moment';
import { DATE_TIME_FORMAT } from 'app/shared/constants/input.constants';
import { BlogService } from 'app/entities/blog/blog.service';
import { IBlog, Blog } from 'app/shared/model/blog.model';

describe('Service Tests', () => {
    describe('Blog Service', () => {
        let injector: TestBed;
        let service: BlogService;
        let httpMock: HttpTestingController;
        let elemDefault: IBlog;
        let currentDate: moment.Moment;
        beforeEach(() => {
            TestBed.configureTestingModule({
                imports: [HttpClientTestingModule]
            });
            injector = getTestBed();
            service = injector.get(BlogService);
            httpMock = injector.get(HttpTestingController);
            currentDate = moment();

            elemDefault = new Blog(0, 'AAAAAAA', 'AAAAAAA', 'AAAAAAA', 'AAAAAAA', currentDate, false);
        });

        describe('Service methods', async () => {
            it('should find an element', async () => {
                const returnedFromService = Object.assign(
                    {
                        fecha: currentDate.format(DATE_TIME_FORMAT)
                    },
                    elemDefault
                );
                service
                    .find(123)
                    .pipe(take(1))
                    .subscribe(resp => expect(resp).toMatchObject({ body: elemDefault }));

                const req = httpMock.expectOne({ method: 'GET' });
                req.flush(JSON.stringify(returnedFromService));
            });

            it('should create a Blog', async () => {
                const returnedFromService = Object.assign(
                    {
                        id: 0,
                        fecha: currentDate.format(DATE_TIME_FORMAT)
                    },
                    elemDefault
                );
                const expected = Object.assign(
                    {
                        fecha: currentDate
                    },
                    returnedFromService
                );
                service
                    .create(new Blog(null))
                    .pipe(take(1))
                    .subscribe(resp => expect(resp).toMatchObject({ body: expected }));
                const req = httpMock.expectOne({ method: 'POST' });
                req.flush(JSON.stringify(returnedFromService));
            });

            it('should update a Blog', async () => {
                const returnedFromService = Object.assign(
                    {
                        titulo: 'BBBBBB',
                        autor: 'BBBBBB',
                        descripcion: 'BBBBBB',
                        url: 'BBBBBB',
                        fecha: currentDate.format(DATE_TIME_FORMAT),
                        status: true
                    },
                    elemDefault
                );

                const expected = Object.assign(
                    {
                        fecha: currentDate
                    },
                    returnedFromService
                );
                service
                    .update(expected)
                    .pipe(take(1))
                    .subscribe(resp => expect(resp).toMatchObject({ body: expected }));
                const req = httpMock.expectOne({ method: 'PUT' });
                req.flush(JSON.stringify(returnedFromService));
            });

            it('should return a list of Blog', async () => {
                const returnedFromService = Object.assign(
                    {
                        titulo: 'BBBBBB',
                        autor: 'BBBBBB',
                        descripcion: 'BBBBBB',
                        url: 'BBBBBB',
                        fecha: currentDate.format(DATE_TIME_FORMAT),
                        status: true
                    },
                    elemDefault
                );
                const expected = Object.assign(
                    {
                        fecha: currentDate
                    },
                    returnedFromService
                );
                service
                    .query(expected)
                    .pipe(
                        take(1),
                        map(resp => resp.body)
                    )
                    .subscribe(body => expect(body).toContainEqual(expected));
                const req = httpMock.expectOne({ method: 'GET' });
                req.flush(JSON.stringify([returnedFromService]));
                httpMock.verify();
            });

            it('should delete a Blog', async () => {
                const rxPromise = service.delete(123).subscribe(resp => expect(resp.ok));

                const req = httpMock.expectOne({ method: 'DELETE' });
                req.flush({ status: 200 });
            });
        });

        afterEach(() => {
            httpMock.verify();
        });
    });
});
