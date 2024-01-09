import '@testing-library/jest-dom';
import { LabelTypeController, FormData } from '../components/LabelTypes/LabelTypesController';
import { setFetchResults } from '../objects/Mock';

var formData: FormData = {
    compStatus: '',
    // messages
    errorMsg: '',
    successMsg: '',
    // data form
    id: '',
    type_name: '',
    unit: '',
    created_by: '',
    creatorName: '',
    created_at: '',
    updated_by: '',
    updaterName: '',
    updated_at: '',
    // filter form
    filterTypeName: '',
    filterUnit: '',
    // browser
    offset:0,
    order:'',
    total:0,
    items: [],
    pages: []
}
const getFormData = ():FormData => {
    return formData;
}
const setFormDataField = (fname: string, value: any):void => {
    if (fname == 'compStatus') formData.compStatus = value;
    if (fname == 'errorMsg') formData.errorMsg = value;
    if (fname == 'successMsg') formData.successMsg = value;
    if (fname == 'id') formData.id = value;
    if (fname == 'type_name') formData.type_name = value;
    if (fname == 'unit') formData.unit = value;
    if (fname == 'created_by') formData.created_by = value;
    if (fname == 'creatorName') formData.creatorName = value;
    if (fname == 'created_at') formData.created_at = value;
    if (fname == 'updated_by') formData.updated_by = value;
    if (fname == 'updaterName') formData.updaterName = value;
    if (fname == 'updated_at') formData.updated_at = value;
    if (fname == 'filterTypeName') formData.filterTypeName = value;
    if (fname == 'filterUnit') formData.filterUnit = value;
    if (fname == 'offset') formData.offset = value;
    if (fname == 'order') formData.order = value;
    if (fname == 'total') formData.total = value;
    if (fname == 'items') formData.items = value;
    if (fname == 'pages') formData.pages = value;
}

describe("LabelTypeController test", () => {
    const controller = new LabelTypeController();
    const wait = 500; // ms wait for asnc process
    let record0 = {
        id:'123', 
        type_name: 'name123',
        unit:'',
        created_by:'',
        created_at:'',
        updated_by:'',
        updated_at:'', 
        user_creator: {username_public: ''},
        user_modifier: {username_public: ''}
     }    

    test('LabelTypeController', () => {
        controller.id = '0';
        setFetchResults([
            { data:{ table:[record0]} },
            { data:{ table:{agregate:{count:1}}} }
        ]);
        controller.onLoad('0', setFormDataField, getFormData);
        setTimeout( () => {
            expect(formData.compStatus).toBe('browser');
        }, wait);          
    });    
    test('LabelTypeController getOneRecord OK test', () => {
         setFetchResults([
             { data:{ table:[record0]} }
         ]);
         controller.getOneRecord('123','show');
        setTimeout( () => {
            expect(formData.compStatus).toBe('show');
            expect(formData.errorMsg).toBe('');
            expect(formData.type_name).toBe('name123');
        }, wait);          
    });
    test('LabelTypeController getOneRecord notfound test', () => {
        setFetchResults([
            { errors:[ {message:'notFound'} ] }
        ]);
        controller.getOneRecord('999','show');
        setTimeout( () => {
            expect(formData.errorMsg).toBe('notFound');
        }, wait);          
    });
    test('LabelTypeController new test', () => {
        controller.new();
        expect(formData.compStatus).toBe('edit');
        expect(formData.created_by).toBe(controller.user.id);
    });
    test('LabelTypeController doFilter test OK', () => {
         setFetchResults([
             { data:{ table:[record0]} },
             { data:{ table:{agregate:{count:1}}} }
         ]);
        formData.filterTypeName = 'filerName1';
        controller.doFilter();
        setTimeout( () => {
            expect(formData.compStatus).toBe('browser');
            expect(formData.total).toBe(1);
        }, wait);          
    });
    test('LabelTypeController doFilter test notFound', () => {
       setFetchResults([
            { data:{ table:[]} },
            { data:{ table:{agregate:{count:0}}} }
       ]);
       formData.filterTypeName = 'filerName1';
       controller.doFilter();
       setTimeout( () => {
           expect(formData.compStatus).toBe('browser');
           expect(formData.total).toBe(0);
       }, wait);          
   });
   test('LabelTypeController delFilter test', () => {
        setFetchResults([
            { data:{ table:[]} },
            { data:{ table:{agregate:{count:0}}} }
        ]);
        controller.delFilter();
        setTimeout( () => {
            expect(formData.compStatus).toBe('browser');
        }, wait);          
    });
    test('LabelTypeController validator test ok', () => {
        formData.type_name = 'name1';
        formData.unit = 'desc1';
        let res = controller.validator();
        expect(res).toBe('');
    });
    test('LabelTypeController validator test notok', () => {
        formData.type_name = '';
        let res = controller.validator();
        expect(res.indexOf('NAME_REQUIRED')).toBeGreaterThanOrEqual(0);
    });
    test('LabelTypeController save test insert OK', () => {
        formData.id = '';
        formData.type_name = 'name1';
        formData.unit = 'desc1';
        controller.save();
        setTimeout( () => {
            expect(formData.compStatus).toBe('browser');
            expect(formData.errorMsg).toBe('');
            expect(formData.successMsg).toBe('SAVED');
        }, wait);          
    });
    test('LabelTypeController save test update OK', () => {
        formData.id = '123';
        formData.type_name = 'name1';
        formData.unit = 'desc1';
        formData.created_at = '200-01-01';
        formData.created_by = '111';
        formData.compStatus = 'edit';
        controller.save();
        setTimeout( () => {
            expect(formData.compStatus).toBe('browser');
            expect(formData.errorMsg).toBe('');
            expect(formData.successMsg).toBe('SAVED');
        }, wait);          
    });
    test('LabelTypeController save test update not valid', () => {
        formData.id = '123';
        formData.type_name = '';
        formData.created_at = '200-01-01';
        formData.created_by = '111';
        controller.save();
        setTimeout( () => {
            expect(formData.compStatus).toBe('edit');
            expect(formData.errorMsg.indexOf('NAME_REQUIRED')).toBeGreaterThanOrEqual(0);
            expect(formData.successMsg).toBe('');
        }, wait);          
    });
    test('LabelTypeController doDelete test', () => {
        setFetchResults([
            { data:[{ affected_rows: 0} ]}  // delete record
        ]);
        controller.doDelete('123');
        setTimeout( () => {
            expect(formData.compStatus).toBe('browser');
        }, wait);          

    });    

});

