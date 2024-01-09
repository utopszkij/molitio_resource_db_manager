import '@testing-library/jest-dom';
import { LabelTypeModel } from '../components/LabelTypes/LabelTypesModel';
import { setFetchResults } from '../objects/Mock';
import { preprocessor } from '../objects/DatabaseInterface';

describe("LabelTypeModel test", () => {
    const model = new LabelTypeModel();
    test('communitiesModel initRecord test', () => {
        setFetchResults([]);
        let res = model.initRecord();
        expect(res.id).toBe('');
    });
    test('labelTypeModel getRecord test OK', () => {
        setFetchResults([
            { data:{records:[{id:'123','type_name':'name123'}]}}
        ]);
        model.getRecord('123')
        .then( (res) => {
            res = preprocessor(res)[0];
            expect(res.id).toBe('123');
            expect(res.type_name).toBe('name123');
        });
    });
    test('labelTypeModel getRecord test notfound', () => {
        setFetchResults([
            { errors:[{message:'notfound'}] }
        ]);
        model.getRecord('0')
        .then( (res) => {
            res = preprocessor(res);
            expect(res.error).toBe('notfound');
        });
    });
    test('labelTypeModel getRecords test', () => {
        setFetchResults([
            { data:{records:[{id:'123','type_name':'name123'}, 
                            {id:'124','type_name':'name124'}]}}
        ]);
        model.getRecords({name:'',
                        filter:[],
                        order:'',
                        offset:0,
                        limit:10,
                        paginatorSize:5
                        })
        .then( (res) => {
            res = preprocessor(res);
            expect(res.length).toBe(2);
        });
    });
    test('labelTypeModel getTotal test', () => {
        setFetchResults([
            {data:{ resource_table_aggregate: { aggregate:{count:2}}}} 
        ]);
        model.getTotal({name:'',
                        filter:[],
                        order:'',
                        offset:0,
                        limit:10,
                        paginatorSize:5
                        })
        .then( (res) => {
            res = preprocessor(res);
            expect(res.count).toBe(2);
        });
    });
    test('labelTypeModel save / insert test', () => {
        setFetchResults([
            {data:[{ id: '1'}]} 
        ]);
        let record = model.initRecord();
        record.id = '';
        model.save(record)
        .then( (res) => {
            res = preprocessor(res);
            expect(res.id).toBe('1');
        });
    });
    test('labelTypeModel save / update test', () => {
        setFetchResults([
            {data:[{ id: '123'}]} 
        ]);
        let record = model.initRecord();
        record.id = '123';
        model.save(record)
        .then( (res) => {
            res = preprocessor(res);
            expect(res.id).toBe('123');
        });
    });
    test('labelTypeModel delete test', () => {
        setFetchResults([
            {data:[{ affected_rows: 1}]} // delete record
        ]);
        model.delete('123')
        .then( (res) => {
            res = preprocessor(res);
            expect(res.affected_rows).toBe(1);
        });
    });
});

